import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSessions } from '../store/slices/sessionsSlice';
import { fetchTemplates } from '../store/slices/templatesSlice';
import { Container, Card, Grid, Row, Btn, Input, Select, Label, H1, Sub, Pill } from '../styles/ui';
import styled from 'styled-components';
import { Search, ChevronRight, Dumbbell } from 'lucide-react';

const Item = styled(Link)`
  display:grid; grid-template-columns: 44px 1fr auto; gap:12px; align-items:center;
  padding:14px; border-radius:14px;
  &:hover{ background: rgba(255,255,255,.04); }
  + a { border-top:1px solid ${p=>p.theme.colors.border}; }
`;
const Avatar = styled.div` width:44px; height:44px; border-radius:12px; display:grid; place-items:center;
  background:linear-gradient(135deg,#ff6a3d,#ff3d7f); color:#fff; `;

export default function History(){
  const dispatch = useDispatch();
  const { items, total, page, pages } = useSelector(s => s.sessions);
  const templates = useSelector(s => s.templates.items);
  const [q, setQ] = useState(''); const [tpl, setTpl] = useState('all');
  const [status, setStatus] = useState('all'); const [range, setRange] = useState('all');
  const [p, setP] = useState(1);

  const params = useMemo(() => {
    const f = { page: p, limit: 20 };
    if (q) f.q = q;
    if (tpl !== 'all') f.template = tpl;
    if (status !== 'all') f.status = status;
    if (range !== 'all') {
      const d = new Date(); d.setDate(d.getDate() - +range);
      f.from = d.toISOString();
    }
    return f;
  }, [q, tpl, status, range, p]);

  useEffect(() => { dispatch(fetchTemplates()); }, [dispatch]);
  useEffect(() => { dispatch(fetchSessions(params)); }, [dispatch, params]);

  const fmt = useCallback(d => new Date(d).toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' }), []);

  return (
    <Container>
      <H1 className="display">Workout History</H1>
      <Sub>{total} sessions · filter, search, and revisit.</Sub>

      <div style={{height:14}}/>
      <Card>
        <Grid cols={1} sm={2} md={4}>
          <div>
            <Label>Search</Label>
            <div style={{position:'relative'}}>
              <Search size={16} style={{position:'absolute', left:12, top:14, color:'#9aa1ad'}}/>
              <Input style={{paddingLeft:36}} placeholder="Workout name…" value={q} onChange={e=>{setQ(e.target.value); setP(1);}}/>
            </div>
          </div>
          <div><Label>Template</Label>
            <Select value={tpl} onChange={e=>{setTpl(e.target.value); setP(1);}}>
              <option value="all">All</option>
              {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </Select>
          </div>
          <div><Label>Status</Label>
            <Select value={status} onChange={e=>{setStatus(e.target.value); setP(1);}}>
              <option value="all">Any</option><option value="completed">Completed</option><option value="in_progress">In progress</option>
            </Select>
          </div>
          <div><Label>Range</Label>
            <Select value={range} onChange={e=>{setRange(e.target.value); setP(1);}}>
              <option value="all">All time</option><option value="7">Last 7d</option><option value="30">Last 30d</option>
              <option value="90">Last 90d</option><option value="365">Last year</option>
            </Select>
          </div>
        </Grid>
      </Card>

      <div style={{height:14}}/>
      <Card style={{padding:8}}>
        {items.length === 0 && <div style={{padding:24, color:'#9aa1ad'}}>No sessions match those filters.</div>}
        {items.map(s => {
          let sets=0, reps=0, vol=0;
          for (const l of s.logs||[]) for (const st of l.sets||[]) { sets++; reps += st.reps||0; vol += (st.weight_kg||0)*(st.reps||0); }
          return (
            <Item to={`/session/${s._id}`} key={s._id}>
              <Avatar><Dumbbell size={20}/></Avatar>
              <div style={{minWidth:0}}>
                <div style={{fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{s.name || 'Workout'}</div>
                <Row gap="8px" style={{marginTop:4}}>
                  <Pill>{fmt(s.date)}</Pill>
                  <Pill style={{background: s.completed?'rgba(34,197,94,.15)':'rgba(245,158,11,.15)', color: s.completed?'#86efac':'#fcd34d'}}>
                    {s.completed?'Done':'Open'}
                  </Pill>
                  <Pill>{sets} sets · {reps} reps · {Math.round(vol)} kg</Pill>
                </Row>
              </div>
              <ChevronRight color="#9aa1ad"/>
            </Item>
          );
        })}
      </Card>

      <Row justify="space-between" style={{marginTop:14}}>
        <Btn size="sm" disabled={p<=1} onClick={()=>setP(p-1)}>← Prev</Btn>
        <Pill>Page {page} / {pages}</Pill>
        <Btn size="sm" disabled={p>=pages} onClick={()=>setP(p+1)}>Next →</Btn>
      </Row>
    </Container>
  );
}
