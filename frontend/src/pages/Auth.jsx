import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../store/slices/authSlice';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, Input, Label, Btn, H1, Sub } from '../styles/ui';
import { Dumbbell } from 'lucide-react';

const Wrap = styled.div` min-height:100vh; display:grid; place-items:center; padding:20px; `;
const Box = styled(Card)` width:100%; max-width: 420px; `;
const Tab = styled.button` background:transparent; border:0; color:${p=>p.$on?'#fff':p.theme.colors.muted};
  border-bottom:2px solid ${p=>p.$on?p.theme.colors.primary:'transparent'}; padding:10px 12px; font-weight:700; cursor:pointer; `;

export default function Auth(){
  const dispatch = useDispatch(); const nav = useNavigate();
  const { token, loading, error } = useSelector(s => s.auth);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  if (token) return <Navigate to="/" replace/>;
  async function submit(e){ e.preventDefault();
    const action = mode==='login' ? login(form) : register(form);
    const r = await dispatch(action);
    if (r.meta.requestStatus === 'fulfilled') nav('/');
  }
  return (
    <Wrap>
      <Box>
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
          <div style={{width:40,height:40,borderRadius:12,display:'grid',placeItems:'center',background:'linear-gradient(135deg,#ff6a3d,#ff3d7f)'}}><Dumbbell color="#fff"/></div>
          <H1 className="display">fitBuddy</H1>
        </div>
        <Sub>Train hard. Track everything.</Sub>
        <div style={{display:'flex', gap:8, marginTop:16}}>
          <Tab $on={mode==='login'} onClick={()=>setMode('login')}>Sign in</Tab>
          <Tab $on={mode==='register'} onClick={()=>setMode('register')}>Create account</Tab>
        </div>
        <form onSubmit={submit} style={{marginTop:16, display:'grid', gap:12}}>
          {mode==='register' && <div><Label>Name</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>}
          <div><Label>Email</Label><Input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div><Label>Password</Label><Input type="password" required minLength={6} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
          {error && <div style={{color:'#fca5a5', fontSize:14}}>{error}</div>}
          <Btn variant="primary" type="submit" disabled={loading}>{loading?'Please wait…':(mode==='login'?'Sign in':'Create account')}</Btn>
        </form>
      </Box>
    </Wrap>
  );
}
