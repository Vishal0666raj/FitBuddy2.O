import React, { useEffect, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard, fetchHeatmap } from '../store/slices/statsSlice';
import { fetchProfile } from '../store/slices/profileSlice';
import { fetchWater, addWater } from '../store/slices/waterSlice';
import { Container, Grid, Card, H1, H2, Sub, Btn, Pill, Row } from '../styles/ui';
import ChartCard from '../components/charts/ChartCard';
import ActivityHeatmap from '../components/charts/ActivityHeatmap';
import { Flame, Target, Droplets, Trophy, Calendar } from 'lucide-react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StatCard = memo(function StatCard({ icon:Icon, label, value, hint, color='#ff6a3d' }){
  return (
    
    <Card>
      <Row gap="10px">
        <div style={{width:40,height:40,borderRadius:12,display:'grid',placeItems:'center',background:`${color}22`,color}}>
          <Icon size={20}/>
        </div>
        <div>
          <div style={{fontSize:12, color:'#9aa1ad', textTransform:'uppercase', letterSpacing:'.08em'}}>{label}</div>
          <div className="display" style={{fontSize:24, fontWeight:700}}>{value}</div>
          {hint && <div style={{fontSize:12, color:'#9aa1ad'}}>{hint}</div>}
        </div>
      </Row>
    </Card>
  );
});

const Bar = styled.div`
  height:10px; background:rgba(255,255,255,.08); border-radius:999px; overflow:hidden;
  > div{ height:100%; background:linear-gradient(90deg,#ff6a3d,#ff3d7f); }
`;

export default function Dashboard(){
  const dispatch = useDispatch();
  const dash = useSelector(s => s.stats.dashboard);
  const heat = useSelector(s => s.stats.heatmap);
  const profile = useSelector(s => s.profile.data);
  const water = useSelector(s => s.water.items);

  useEffect(() => {
    dispatch(fetchDashboard()); dispatch(fetchHeatmap(119));
    dispatch(fetchProfile());
    const today = new Date().toISOString().slice(0,10);
    dispatch(fetchWater({ from: today, to: today }));
  }, [dispatch]);

  const todayMl = useMemo(() => {
    const today = new Date().toISOString().slice(0,10);
    return water.find(w => w.date === today)?.ml || 0;
  }, [water]);
  const goal = profile?.daily_water_goal_ml || 2500;

  return (
    <Container>
      <H1 className="display">Welcome back{profile?.name?`, ${profile.name}`:''} 👋</H1>
      <Sub>Here's your training pulse.</Sub>

      <div style={{height:18}}/>
      <Grid cols={1} sm={2} md={4}>
        <StatCard icon={Flame} label="Current streak" value={`${dash?.streak?.current||0}d`} hint={`Longest ${dash?.streak?.longest||0}d`} />
        <StatCard icon={Target} label="Consistency (28d)" value={`${dash?.consistency||0}%`} color="#22c55e"/>
        <StatCard icon={Trophy} label="Sessions" value={dash?.totalSessions||0} color="#f59e0b"/>
        <StatCard icon={Droplets} label="Water today" value={`${(todayMl/1000).toFixed(1)}L`} hint={`Goal ${(goal/1000).toFixed(1)}L`} color="#38bdf8"/>
      </Grid>

      <div style={{height:18}}/>
      <Grid cols={1} sm={1} md={2} lg={2}>
        <Card>
          <H2>Weekly goal</H2>
          <Sub>{dash?.weekDone||0} of {dash?.weeklyGoal||4} workouts</Sub>
          <div style={{height:12}}/><Bar><div style={{width: `${dash?.weekPct||0}%`}}/></Bar>
          <Row justify="space-between" style={{marginTop:6}}><Pill>{dash?.weekPct||0}%</Pill><Pill>This week</Pill></Row>
        </Card>
        <Card>
          <H2>Monthly goal</H2>
          <Sub>{dash?.monthDone||0} workouts this month</Sub>
          <div style={{height:12}}/><Bar><div style={{width: `${dash?.monthPct||0}%`}}/></Bar>
          <Row justify="space-between" style={{marginTop:6}}><Pill>{dash?.monthPct||0}%</Pill><Pill>This month</Pill></Row>
        </Card>
      </Grid>

      <div style={{height:18}}/>
      <Grid cols={1} sm={1} md={2}>
        <Card>
          <H2>Today</H2>
          <Sub>{dash?.today?.template ? `Scheduled: ${dash.today.template.name}` : 'No workout scheduled'}</Sub>
          <div style={{height:12}}/>
          <Row gap="10px">
            <Btn as={Link} to="/schedule" variant="ghost">Edit schedule</Btn>
            <Btn as={Link} to="/templates" variant="primary">Start a workout</Btn>
          </Row>
        </Card>
        <Card>
          <H2>Hydration</H2>
          <Sub>+250ml taps</Sub>
          <Row gap="10px" style={{marginTop:10}}>
            {[250, 500, 750].map(ml => (
              <Btn key={ml} size="sm" onClick={()=>dispatch(addWater({ date: new Date().toISOString().slice(0,10), ml }))}>+{ml}ml</Btn>
            ))}
          </Row>
        </Card>
      </Grid>

      <div style={{height:18}}/>
      <ChartCard title="Activity heatmap" subtitle="Last 17 weeks of training (scroll horizontally on mobile)">
        <ActivityHeatmap since={heat?.since} map={heat?.map} />
      </ChartCard>

      <div style={{height:18}}/>
      <Card>
        <H2>Recent PRs</H2>
        <Sub>Personal records in the last 14 days</Sub>
        <Grid cols={1} sm={2} md={3} style={{marginTop:12}}>
          {(dash?.prs||[]).length === 0 && <Sub>No recent PRs — keep grinding.</Sub>}
          {(dash?.prs||[]).map(p => (
            <Card key={p.exercise}>
              <Pill><Trophy size={14}/> PR</Pill>
              <div className="display" style={{fontSize:20, marginTop:8}}>{p.exercise}</div>
              <Sub>{p.weight} kg</Sub>
            </Card>
          ))}
        </Grid>
      </Card>
    </Container>
  );
}
