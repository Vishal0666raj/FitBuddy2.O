import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates, createTemplate, deleteTemplate, updateTemplate } from '../store/slices/templatesSlice';
import { createSession } from '../store/slices/sessionsSlice';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Grid, Row, Btn, Input, Select, Label, H1, H2, Sub, Pill } from '../styles/ui';
import { Plus, Trash2, Play, Edit } from 'lucide-react';
import styled from 'styled-components';

const MUSCLES = ['chest','back','legs','shoulders','arms','core','cardio'];
const ExRow = styled.div` display:grid; grid-template-columns: 1fr 130px 80px 80px 44px; gap:8px; align-items:end;
  @media (max-width:640px){ grid-template-columns: 1fr 1fr; }
`;

export default function Templates(){
  const dispatch = useDispatch(); const nav = useNavigate();
  const items = useSelector(s => s.templates.items);
  const [editing, setEditing] = useState(null);
  useEffect(()=>{ dispatch(fetchTemplates()); }, [dispatch]);

  function startEdit(t){ setEditing(t ? JSON.parse(JSON.stringify(t)) : { name:'New routine', exercises: [emptyEx()] }); }
  function emptyEx(){ return { name:'', muscle_group:'chest', target_sets:3, target_reps:8 }; }
  function setEx(i, patch){ const ex=[...editing.exercises]; ex[i]={...ex[i], ...patch}; setEditing({...editing, exercises:ex}); }
  function delEx(i){ const ex=[...editing.exercises]; ex.splice(i,1); setEditing({...editing, exercises:ex}); }
  function addEx(){ setEditing({...editing, exercises:[...editing.exercises, emptyEx()]}); }
  async function save(){
    if (editing._id) await dispatch(updateTemplate({id: editing._id, body: editing}));
    else await dispatch(createTemplate(editing));
    setEditing(null);
  }
  async function start(t){
    const r = await dispatch(createSession({ template: t._id }));
    if (r.meta.requestStatus === 'fulfilled') nav(`/session/${r.payload._id}`);
  }

  return (
    <Container>
      <Row justify="space-between">
        <div><H1 className="display">Templates</H1><Sub>Reusable workout routines.</Sub></div>
        <Btn variant="primary" onClick={()=>startEdit(null)}><Plus size={16}/> New template</Btn>
      </Row>

      <div style={{height:14}}/>
      <Grid cols={1} sm={2} md={3}>
        {items.map(t => (
          <Card key={t._id}>
            <H2>{t.name}</H2>
            <Sub>{t.exercises?.length||0} exercises</Sub>
            <Row gap="6px" style={{marginTop:8}}>
              {[...new Set((t.exercises||[]).map(e=>e.muscle_group).filter(Boolean))].map(m => <Pill key={m}>{m}</Pill>)}
            </Row>
            <Row gap="8px" style={{marginTop:14}}>
              <Btn variant="primary" onClick={()=>start(t)}><Play size={16}/> Start</Btn>
              <Btn onClick={()=>startEdit(t)}><Edit size={16}/></Btn>
              <Btn variant="danger" onClick={()=>{if(confirm('Delete template?'))dispatch(deleteTemplate(t._id));}}><Trash2 size={16}/></Btn>
            </Row>
          </Card>
        ))}
      </Grid>

      {editing && (
        <>
          <div style={{height:18}}/>
          <Card>
            <H2>{editing._id?'Edit':'New'} template</H2>
            <div style={{height:10}}/>
            <Grid cols={1} sm={2}>
              <div><Label>Name</Label><Input value={editing.name} onChange={e=>setEditing({...editing, name:e.target.value})}/></div>
            </Grid>
            <div style={{height:12}}/>
            <Sub>Exercises</Sub>
            <div style={{display:'grid', gap:10, marginTop:8}}>
              {editing.exercises.map((e,i) => (
                <ExRow key={i}>
                  <div><Label>Name</Label><Input value={e.name} onChange={ev=>setEx(i,{name:ev.target.value})}/></div>
                  <div><Label>Muscle</Label>
                    <Select value={e.muscle_group} onChange={ev=>setEx(i,{muscle_group:ev.target.value})}>
                      {MUSCLES.map(m=><option key={m}>{m}</option>)}
                    </Select>
                  </div>
                  <div><Label>Sets</Label><Input type="number" value={e.target_sets} onChange={ev=>setEx(i,{target_sets:+ev.target.value})}/></div>
                  <div><Label>Reps</Label><Input type="number" value={e.target_reps} onChange={ev=>setEx(i,{target_reps:+ev.target.value})}/></div>
                  <Btn variant="danger" onClick={()=>delEx(i)}><Trash2 size={16}/></Btn>
                </ExRow>
              ))}
            </div>
            <Row gap="8px" style={{marginTop:12}}>
              <Btn onClick={addEx}><Plus size={16}/> Add exercise</Btn>
              <Btn variant="primary" onClick={save}>Save</Btn>
              <Btn variant="ghost" onClick={()=>setEditing(null)}>Cancel</Btn>
            </Row>
          </Card>
        </>
      )}
    </Container>
  );
}
