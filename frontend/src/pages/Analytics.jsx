import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExerciseList, fetchExerciseProgression, fetchMuscleProgression, fetchTemplateProgression } from '../store/slices/analyticsSlice';
import { fetchTemplates } from '../store/slices/templatesSlice';
import { Container, Card, Grid, Row, Select, Input, Label, H1, H2, Sub, Pill, Btn } from '../styles/ui';
import ChartCard from '../components/charts/ChartCard';
import LineProgress from '../components/charts/LineProgress';

const MUSCLES = ['chest','back','legs','shoulders','arms','core','cardio'];

export default function Analytics(){
  const dispatch = useDispatch();
  const { exercises, exercise, muscle, template } = useSelector(s => s.analytics);
  const templates = useSelector(s => s.templates.items);

  const [tab, setTab] = useState('exercise');
  const [ex, setEx] = useState('');
  const [mu, setMu] = useState('chest');
  const [tp, setTp] = useState('all');
  const [from, setFrom] = useState(''); const [to, setTo] = useState('');

  useEffect(()=>{ dispatch(fetchExerciseList()); dispatch(fetchTemplates()); }, [dispatch]);
  useEffect(()=>{ if (!ex && exercises[0]) setEx(exercises[0].name); }, [exercises, ex]);

  const reload = useCallback(() => {
    const range = {}; if (from) range.from = from; if (to) range.to = to;
    if (tab==='exercise' && ex) dispatch(fetchExerciseProgression({ name: ex, ...range }));
    if (tab==='muscle' && mu) dispatch(fetchMuscleProgression({ group: mu, ...range }));
    if (tab==='template') dispatch(fetchTemplateProgression({ template: tp, ...range }));
  }, [dispatch, tab, ex, mu, tp, from, to]);

  useEffect(()=>{ reload(); }, [reload]);

  return (
    <Container>
      <H1 className="display">Exercise Analytics</H1>
      <Sub>True training progression — session-indexed, no calendar gaps.</Sub>

      <div style={{height:14}}/>
      <Card>
        <Row gap="8px" wrap="wrap">
          {['exercise','muscle','template'].map(t => (
            <Btn key={t} size="sm" variant={tab===t?'primary':'ghost'} onClick={()=>setTab(t)}>{t}</Btn>
          ))}
        </Row>
        <div style={{height:12}}/>
        <Grid cols={1} sm={2} md={4}>
          {tab==='exercise' && (
            <div><Label>Exercise</Label>
              <Select value={ex} onChange={e=>setEx(e.target.value)}>
                {exercises.map(x => <option key={x.name} value={x.name}>{x.name}{x.muscle_group?` — ${x.muscle_group}`:''}</option>)}
              </Select>
            </div>
          )}
          {tab==='muscle' && (
            <div><Label>Muscle group</Label>
              <Select value={mu} onChange={e=>setMu(e.target.value)}>
                {MUSCLES.map(m=><option key={m}>{m}</option>)}
              </Select>
            </div>
          )}
          {tab==='template' && (
            <div><Label>Template</Label>
              <Select value={tp} onChange={e=>setTp(e.target.value)}>
                <option value="all">All</option>
                {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </Select>
            </div>
          )}
          <div><Label>From</Label><Input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></div>
          <div><Label>To</Label><Input type="date" value={to} onChange={e=>setTo(e.target.value)}/></div>
          <div style={{display:'flex', alignItems:'flex-end'}}><Btn onClick={reload}>Apply</Btn></div>
        </Grid>
      </Card>

      {tab==='exercise' && exercise && (
        <>
          <div style={{height:14}}/>
          <Grid cols={2} sm={2} md={4}>
            <StatTile label="Total Volume" value={`${exercise.totals.volume} kg`}/>
            <StatTile label="Total Sets" value={exercise.totals.sets}/>
            <StatTile label="Total Reps" value={exercise.totals.reps}/>
            <StatTile label="PR" value={`${exercise.totals.pr} kg`} accent/>
          </Grid>
          <div style={{height:14}}/>
          <Grid cols={1} md={2}>
            <ChartCard title="Volume progression" subtitle="One point per session that included this exercise">
              <LineProgress data={exercise.points} dataKey="volume" color="#ff6a3d"/>
            </ChartCard>
            <ChartCard title="Top weight per session" subtitle="Heaviest set on each occurrence">
              <LineProgress data={exercise.points} dataKey="max_weight" color="#38bdf8"/>
            </ChartCard>
            <ChartCard title="PR trajectory" subtitle="Running personal record">
              <LineProgress data={exercise.points} dataKey="pr_after" color="#22c55e"/>
            </ChartCard>
            <ChartCard title="Reps per session">
              <LineProgress data={exercise.points} dataKey="reps" color="#f59e0b"/>
            </ChartCard>
          </Grid>

          <div style={{height:14}}/>
          <Card>
            <H2>Workout log</H2>
            <Sub>{exercise.totals.frequency} sessions</Sub>
            <div style={{overflowX:'auto', marginTop:8}}>
              <table style={{width:'100%', borderCollapse:'collapse', minWidth: 480}}>
                <thead><tr style={{textAlign:'left', color:'#9aa1ad', fontSize:12}}>
                  <th style={th}>Date</th><th style={th}>Volume</th><th style={th}>Top weight</th><th style={th}>Sets</th><th style={th}>Reps</th>
                </tr></thead>
                <tbody>
                  {[...exercise.points].reverse().map(p => (
                    <tr key={p.session_id}><td style={td}>{p.date}</td><td style={td}>{p.volume} kg</td><td style={td}>{p.max_weight} kg</td><td style={td}>{p.sets}</td><td style={td}>{p.reps}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {tab==='muscle' && muscle && (
        <>
          <div style={{height:14}}/>
          <Grid cols={2} sm={4}>
            <StatTile label="Volume" value={`${muscle.totals.volume} kg`}/>
            <StatTile label="Sets" value={muscle.totals.sets}/>
            <StatTile label="Sessions" value={muscle.totals.frequency}/>
          </Grid>
          <div style={{height:14}}/>
          <ChartCard title={`${muscle.group} volume per session`}>
            <LineProgress data={muscle.points} dataKey="volume"/>
          </ChartCard>
        </>
      )}

      {tab==='template' && template && (
        <>
          <div style={{height:14}}/>
          <ChartCard title="Template volume per session">
            <LineProgress data={template.points} dataKey="volume"/>
          </ChartCard>
        </>
      )}
    </Container>
  );
}

const th = { padding:'10px 8px', borderBottom: '1px solid rgba(255,255,255,.08)' };
const td = { padding:'10px 8px', borderBottom: '1px solid rgba(255,255,255,.05)', fontSize:14 };

function StatTile({ label, value, accent }){
  return (
    <Card>
      <div style={{fontSize:12, color:'#9aa1ad', textTransform:'uppercase', letterSpacing:'.08em'}}>{label}</div>
      <div className="display" style={{fontSize:24, marginTop:6, color: accent?'#ff3d7f':'#fff'}}>{value}</div>
    </Card>
  );
}
