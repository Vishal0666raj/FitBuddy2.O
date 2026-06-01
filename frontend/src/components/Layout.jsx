import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Dumbbell, LayoutDashboard, History, ListChecks, Calendar, User, LogOut, Menu, X, BarChart3, Bell } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Shell = styled.div`
  min-height:100vh; display:grid; grid-template-columns: 1fr;
  @media (min-width:960px){ grid-template-columns: 260px 1fr; }
`;
const Side = styled.aside`
  position: sticky; top:0; height:100vh; padding:20px 16px;
  border-right:1px solid ${p=>p.theme.colors.border};
  background:${p=>p.theme.colors.surface}; backdrop-filter:blur(14px);
  display:flex; flex-direction:column;
  @media (max-width:959px){
    position:fixed; inset:0 auto 0 0; width:78%; max-width:300px; z-index:60;
    transform: translateX(${p=>p.$open?'0':'-100%'}); transition: transform .25s ease;
    box-shadow: ${p=>p.$open?'0 20px 60px rgba(0,0,0,.5)':'none'};
  }
`;
const Brand = styled(NavLink)` display:flex; align-items:center; gap:10px; margin-bottom:18px; font-weight:800; font-size:20px;
  font-family:'Space Grotesk'; letter-spacing:.02em;
  span.b{ background: linear-gradient(135deg,#ff6a3d,#ff3d7f); -webkit-background-clip:text; color:transparent; }
`;
const Logo = styled.div` width:36px; height:36px; border-radius:10px; display:grid; place-items:center;
  background:linear-gradient(135deg,${p=>p.theme.colors.primary},${p=>p.theme.colors.primary2}); color:#fff; `;
const Nav = styled.nav` display:flex; flex-direction:column; gap:4px; flex:1; `;
const Item = styled(NavLink)` display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:12px;
  color:${p=>p.theme.colors.muted}; font-weight:600; min-height:44px;
  &.active{ color:#fff; background:rgba(255,106,61,.14); }
  &:hover{ color:#fff; background:rgba(255,255,255,.06); }
`;
const Logout = styled.button` display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:12px;
  background:transparent; border:0; color:${p=>p.theme.colors.muted}; font-weight:600; cursor:pointer; min-height:44px;
  &:hover{ color:#fecaca; background:rgba(239,68,68,.1); }
`;
const Topbar = styled.div`
  display:none; position:sticky; top:0; z-index:50;
  background:${p=>p.theme.colors.surface}; backdrop-filter:blur(14px);
  border-bottom:1px solid ${p=>p.theme.colors.border};
  padding: 10px 14px; align-items:center; gap:12px;
  @media (max-width:959px){ display:flex; }
`;
const Burger = styled.button` background:transparent; border:0; color:#fff; padding:6px; min-width:44px; min-height:44px; `;
const Backdrop = styled.div` position:fixed; inset:0; background:rgba(0,0,0,.55); z-index:55;
  display:${p=>p.$show?'block':'none'}; @media (min-width:960px){ display:none; }
`;
const Main = styled.main` min-height:100vh; padding-bottom: env(safe-area-inset-bottom); `;

const links = [
  { to:'/', label:'Dashboard', icon:LayoutDashboard, end:true },
  { to:'/analytics', label:'Analytics', icon:BarChart3 },
  { to:'/history', label:'History', icon:History },
  { to:'/templates', label:'Templates', icon:ListChecks },
  { to:'/schedule', label:'Schedule', icon:Calendar },
  { to:'/reminders', label:'Reminders', icon:Bell },
  { to:'/profile', label:'Profile', icon:User },
];

export default function Layout(){
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();
  const dispatch = useDispatch();
  useEffect(()=>{ setOpen(false); }, [loc.pathname]);
  return (
    <Shell>
      <Side $open={open}>
        <Brand to="/"><Logo><Dumbbell size={20}/></Logo><span className="b">fitBuddy</span></Brand>
        <Nav>
          {links.map(l => (
            <Item key={l.to} to={l.to} end={l.end}>
              <l.icon size={18}/> {l.label}
            </Item>
          ))}
        </Nav>
        <Logout onClick={()=>{ dispatch(logout()); nav('/auth'); }}>
          <LogOut size={18}/> Sign out
        </Logout>
      </Side>
      <Backdrop $show={open} onClick={()=>setOpen(false)} />
      <div>
        <Topbar>
          <Burger aria-label="Menu" onClick={()=>setOpen(true)}><Menu/></Burger>
          <Brand to="/" style={{margin:0}}><Logo><Dumbbell size={18}/></Logo><span className="b">fitBuddy</span></Brand>
        </Topbar>
        <Main><Outlet/></Main>
      </div>
    </Shell>
  );
}
