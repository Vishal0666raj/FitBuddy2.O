import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSession, updateSession, deleteSession } from '../store/slices/sessionsSlice';
import { Container, Card, Row, Btn, H1, H2, Sub, Input, Pill, Label } from '../styles/ui';
import styled from 'styled-components';
import { Check, Plus, Trash2, Minus } from 'lucide-react';

const Bar = styled.div`
  position: sticky; top:0; z-index:5; padding:12px; margin:-20px -16px 16px;
  background:${p=>p.theme.colors.bg}; border-bottom:1px solid ${p=>p.theme.colors.border};
  @media (min-width:960px){ position:static; margin:0 0 16px; padding:0; background:transparent; border:0; }
`;
const SetRow = styled.div`
  display:grid; grid-template-columns: 28px 1fr 1fr 44px 44px; gap:8px; align-items:center;
  padding:8px 0; border-top:1px solid ${p=>p.theme.colors.border};
`;
const Step = styled.button`
  width:36px; height:36px; border-radius:10px; border:1px solid ${p=>p.theme.colors.border};
  background:${p=>p.theme.colors.surface2}; color:#fff; display:grid; place-items:center; cursor:pointer;
`;

function Stepper({ value, onChange, step=1, min=0 }){
  return (
    <Row gap="6px">
      <Step onClick={()=>onChange(Math.max(min, (+value||0) - step))}><Minus size={14}/></Step>
      <Input type="number" value={value} onChange={e=>onChange(+e.target.value)} style={{textAlign:'center', minHeight:36, padding:'4px 8px'}}/>
      <Step onClick={()=>onChange((+value||0) + step)}><Plus size={14}/></Step>
    </Row>
  );
}

export default function Session(){
  const { id } = useParams(); const nav = useNavigate();
  const dispatch = useDispatch();
  const s = useSelector(s => s.sessions.current);
  const [local, setLocal] = useState(null);

  useEffect(() => { dispatch(fetchSession(id)); }, [dispatch, id]);
  useEffect(() => { if (s && s._id === id) setLocal(s); }, [s, id]);

  const save = useCallback(async (patch) => {
    const next = { ...local, ...patch };
    setLocal(next);
    await dispatch(updateSession({ id, body: patch }));
  }, [dispatch, id, local]);

  if (!local) return <Container><Sub>Loading…</Sub></Container>;

  const totals = (local.logs||[]).reduce((a,l)=>{
    for (const st of l.sets||[]) { a.sets++; a.reps += st.reps||0; a.vol += (st.weight_kg||0)*(st.reps||0); }
    return a;
  }, { sets:0, reps:0, vol:0 });

  function updateSet(li, si, patch){
    const logs = JSON.parse(JSON.stringify(local.logs));
    logs[li].sets[si] = { ...logs[li].sets[si], ...patch };
    save({ logs });
  }
  function addSet(li){
    const logs = JSON.parse(JSON.stringify(local.logs));
    const last = logs[li].sets[logs[li].sets.length-1] || { weight_kg:0, reps:8 };
    logs[li].sets.push({ weight_kg: last.weight_kg, reps: last.reps, done:false });
    save({ logs });
  }
  function delSet(li, si){
    const logs = JSON.parse(JSON.stringify(local.logs));
    logs[li].sets.splice(si,1);
    save({ logs });
  }

  return (
    <Container>
      <Bar>
        <Row justify="space-between" wrap="wrap" gap="10px">
          <div><H1 className="display">{local.name || 'Workout'}</H1>
            <Row gap="6px"><Pill>{totals.sets} sets</Pill><Pill>{totals.reps} reps</Pill><Pill>{Math.round(totals.vol)} kg</Pill></Row>
          </div>
          <Row gap="8px">
            <Btn variant={local.completed?'ghost':'primary'} onClick={()=>save({ completed: !local.completed })}>
              <Check size={16}/> {local.completed?'Mark open':'Complete'}
            </Btn>
            <Btn variant="danger" onClick={async()=>{ if(confirm('Delete session?')){ await dispatch(deleteSession(id)); nav('/history'); } }}><Trash2 size={16}/></Btn>
          </Row>
        </Row>
      </Bar>

      <div style={{display:'grid', gap:12}}>
        {(local.logs||[]).map((l, li) => (
          <Card key={li}>
            <Row justify="space-between"><H2>{l.exercise_name}</H2><Pill>{l.muscle_group}</Pill></Row>
            <SetRow style={{borderTop:0, fontSize:12, color:'#9aa1ad'}}>
              <div>#</div><div>Weight (kg)</div><div>Reps</div><div></div><div></div>
            </SetRow>
            {(l.sets||[]).map((st, si) => (
              <SetRow key={si}>
                <div style={{color:'#9aa1ad'}}>{si+1}</div>
                <Stepper value={st.weight_kg} onChange={v=>updateSet(li,si,{weight_kg:v})} step={2.5}/>
                <Stepper value={st.reps} onChange={v=>updateSet(li,si,{reps:v})}/>
                <Step onClick={()=>updateSet(li,si,{done:!st.done})} style={{background: st.done?'#22c55e':'',borderColor: st.done?'#22c55e':''}}>
                  <Check size={16}/>
                </Step>
                <Step onClick={()=>delSet(li,si)}><Trash2 size={14}/></Step>
              </SetRow>
            ))}
            <Row style={{marginTop:10}}><Btn size="sm" onClick={()=>addSet(li)}><Plus size={14}/> Add set</Btn></Row>
          </Card>
        ))}
      </div>
    </Container>
  );
}
