import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../store/slices/profileSlice';
import { Container, Card, Grid, Row, Btn, Input, Select, Label, H1, H2, Sub, Pill } from '../styles/ui';

function bmi(w,h){ if(!w||!h) return null; const m=h/100; return +(w/(m*m)).toFixed(1); }
function bmiCat(v){ if(v==null)return '—'; if(v<18.5)return 'Underweight'; if(v<25)return 'Normal'; if(v<30)return 'Overweight'; return 'Obese';}

export default function Profile(){
  const dispatch = useDispatch();
  const data = useSelector(s => s.profile.data);
  const user = useSelector(s => s.auth.user);
  const [form, setForm] = useState({ name:'', age:'', gender:'', height_cm:'', weight_kg:'', daily_water_goal_ml: 2500, weekly_workout_goal: 4 });
  useEffect(()=>{ dispatch(fetchProfile()); }, [dispatch]);
  useEffect(()=>{ if (data) setForm({
    name: data.name||'', age: data.age||'', gender: data.gender||'',
    height_cm: data.height_cm||'', weight_kg: data.weight_kg||'',
    daily_water_goal_ml: data.daily_water_goal_ml || 2500,
    weekly_workout_goal: data.weekly_workout_goal || 4,
  }); }, [data]);
  const b = bmi(+form.weight_kg, +form.height_cm);
  async function save(){ await dispatch(updateProfile({
    ...form,
    age: form.age?+form.age:null, height_cm: form.height_cm?+form.height_cm:null, weight_kg: form.weight_kg?+form.weight_kg:null,
    daily_water_goal_ml: +form.daily_water_goal_ml, weekly_workout_goal: +form.weekly_workout_goal,
  })); }
  return (
    <Container>
      <H1 className="display">Profile</H1><Sub>{user?.email}</Sub>
      <div style={{height:14}}/>
      <Card>
        <Grid cols={1} sm={2}>
          <div><Label>Name</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div><Label>Gender</Label>
            <Select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
              <option value="">—</option><option>Male</option><option>Female</option><option>Other</option>
            </Select>
          </div>
          <div><Label>Age</Label><Input type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/></div>
          <div><Label>Height (cm)</Label><Input type="number" value={form.height_cm} onChange={e=>setForm({...form,height_cm:e.target.value})}/></div>
          <div><Label>Weight (kg)</Label><Input type="number" step="0.1" value={form.weight_kg} onChange={e=>setForm({...form,weight_kg:e.target.value})}/></div>
          <div><Label>Daily water goal (ml)</Label><Input type="number" value={form.daily_water_goal_ml} onChange={e=>setForm({...form,daily_water_goal_ml:e.target.value})}/></div>
          <div><Label>Weekly workout goal</Label><Input type="number" value={form.weekly_workout_goal} onChange={e=>setForm({...form,weekly_workout_goal:e.target.value})}/></div>
        </Grid>
        {b != null && (
          <Row justify="space-between" style={{marginTop:14, padding:'10px 14px', background:'rgba(255,255,255,.04)', borderRadius:12}}>
            <div><div style={{color:'#9aa1ad', fontSize:12}}>BMI</div><div className="display" style={{fontSize:26}}>{b}</div></div>
            <Pill>{bmiCat(b)}</Pill>
          </Row>
        )}
        <Row style={{marginTop:14}}><Btn variant="primary" onClick={save}>Save</Btn></Row>
      </Card>
    </Container>
  );
}
