import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReminders, updateReminders, testReminder } from '../store/slices/remindersSlice';
import { Container, Card, Grid, Row, Btn, Input, Select, Label, H1, H2, Sub } from '../styles/ui';

export default function Reminders(){
  const dispatch = useDispatch();
  const data = useSelector(s => s.reminders.data);
  const [form, setForm] = useState(null);
  useEffect(()=>{ dispatch(fetchReminders()); }, [dispatch]);
  useEffect(()=>{ if (data) setForm({ ...data, tz_offset_min: -new Date().getTimezoneOffset() }); }, [data]);
  if (!form) return <Container><Sub>Loading…</Sub></Container>;
  function set(p){ setForm({...form, ...p}); }
  async function save(){ await dispatch(updateReminders(form)); }
  return (
    <Container>
      <H1 className="display">Smart Reminders</H1>
      <Sub>Email alerts for workouts and hydration — works even when the app is closed.</Sub>
      <div style={{height:14}}/>
      <Grid cols={1} md={2}>
        <Card>
          <H2>Workout reminder</H2>
          <Sub>Sent on scheduled workout days.</Sub>
          <div style={{height:10}}/>
          <Row gap="8px"><input type="checkbox" id="we" checked={!!form.email_enabled} onChange={e=>set({email_enabled:e.target.checked})}/><label htmlFor="we">Enable email reminder</label></Row>
          <div style={{height:10}}/>
          <Label>Time (local)</Label>
          <Input type="time" value={form.workout_time} onChange={e=>set({workout_time:e.target.value})}/>
        </Card>
        <Card>
          <H2>Water reminder</H2>
          <Sub>Periodic hydration nudges.</Sub>
          <div style={{height:10}}/>
          <Row gap="8px"><input type="checkbox" id="wa" checked={!!form.water_enabled} onChange={e=>set({water_enabled:e.target.checked})}/><label htmlFor="wa">Enable water reminders</label></Row>
          <Grid cols={1} sm={3} style={{marginTop:10}}>
            <div><Label>Every (hrs)</Label>
              <Select value={form.water_interval_hours} onChange={e=>set({water_interval_hours:+e.target.value})}>
                {[1,2,3,4,5,6].map(h=><option key={h}>{h}</option>)}
              </Select>
            </div>
            <div><Label>Start hour</Label><Input type="number" min={0} max={23} value={form.water_start_hour} onChange={e=>set({water_start_hour:+e.target.value})}/></div>
            <div><Label>End hour</Label><Input type="number" min={0} max={23} value={form.water_end_hour} onChange={e=>set({water_end_hour:+e.target.value})}/></div>
          </Grid>
        </Card>
      </Grid>
      <Row gap="10px" style={{marginTop:14}}>
        <Btn variant="primary" onClick={save}>Save preferences</Btn>
        <Btn onClick={()=>dispatch(testReminder())}>Send test email</Btn>
      </Row>
    </Container>
  );
}
