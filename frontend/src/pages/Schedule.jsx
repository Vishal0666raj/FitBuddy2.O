import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedule, setSchedule } from '../store/slices/scheduleSlice';
import { fetchTemplates } from '../store/slices/templatesSlice';
import { Container, Card, Grid, H1, H2, Sub, Select, Label } from '../styles/ui';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function Schedule(){
  const dispatch = useDispatch();
  const items = useSelector(s => s.schedule.items);
  const templates = useSelector(s => s.templates.items);
  useEffect(()=>{ dispatch(fetchSchedule()); dispatch(fetchTemplates()); }, [dispatch]);
  return (
    <Container>
      <H1 className="display">Weekly Schedule</H1>
      <Sub>Assign a template to each day. Used for reminders and dashboard.</Sub>
      <div style={{height:14}}/>
      <Grid cols={1} sm={2} md={3}>
        {DAYS.map((d, dow) => {
          const cur = items.find(x => x.dow === dow);
          return (
            <Card key={d}>
              <H2>{d}</H2>
              <Label style={{marginTop:10}}>Template</Label>
              <Select value={cur?.template?._id || cur?.template || ''} onChange={e=>dispatch(setSchedule({ dow, template: e.target.value || null }))}>
                <option value="">— Rest day —</option>
                {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </Select>
            </Card>
          );
        })}
      </Grid>
    </Container>
  );
}
