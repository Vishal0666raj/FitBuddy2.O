const Session = require('../models/Session');
const Profile = require('../models/Profile');
const Schedule = require('../models/Schedule');

function ymd(d){ return new Date(d).toISOString().slice(0,10); }
function sessionVolume(s){
  let v=0, sets=0, reps=0;
  for (const l of s.logs||[]) for (const st of l.sets||[]) { v += (st.weight_kg||0)*(st.reps||0); sets++; reps += st.reps||0; }
  return { v, sets, reps };
}

exports.dashboard = async (req, res) => {
  const sessions = await Session.find({ user: req.userId }).sort('-date').limit(500);
  const profile = await Profile.findOne({ user: req.userId });
  const schedule = await Schedule.find({ user: req.userId }).populate('template');

  // Streaks (consecutive days with a completed session)
  const completedDays = new Set(sessions.filter(s => s.completed).map(s => ymd(s.date)));
  let current = 0, longest = 0, run = 0;
  const today = new Date(); today.setHours(0,0,0,0);
  // longest
  const days = [...completedDays].sort();
  for (let i=0;i<days.length;i++) {
    if (i===0) run=1;
    else {
      const a = new Date(days[i-1]); const b = new Date(days[i]);
      run = ((b-a)/86400000===1) ? run+1 : 1;
    }
    longest = Math.max(longest, run);
  }
  // current streak going back from today
  for (let i=0;;i++){
    const d = new Date(today); d.setDate(d.getDate()-i);
    if (completedDays.has(ymd(d))) current++;
    else { if (i===0) continue; break; }
  }

  // Week / Month completion vs weekly goal
  const weeklyGoal = profile?.weekly_workout_goal || 4;
  const weekStart = new Date(today); weekStart.setDate(weekStart.getDate() - today.getDay());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const weekDone = sessions.filter(s => s.completed && new Date(s.date) >= weekStart).length;
  const monthDone = sessions.filter(s => s.completed && new Date(s.date) >= monthStart).length;
  const weekPct = Math.min(100, Math.round((weekDone / weeklyGoal) * 100));
  const monthPct = Math.min(100, Math.round((monthDone / (weeklyGoal*4)) * 100));

  // Consistency score: % of last 28 days that have a workout
  const last28 = new Set();
  for (let i=0;i<28;i++){ const d=new Date(today); d.setDate(d.getDate()-i); if (completedDays.has(ymd(d))) last28.add(ymd(d)); }
  const consistency = Math.round((last28.size/28)*100);

  // Upcoming workout (today's schedule)
  const dow = today.getDay();
  const todaySched = schedule.find(s => s.dow === dow);

  // Recent PRs (top weight per exercise overall vs last 14d)
  const exMax = {}; const exRecentMax = {};
  const cutoff = new Date(today); cutoff.setDate(cutoff.getDate()-14);
  for (const s of sessions) for (const l of s.logs||[]) for (const st of l.sets||[]) {
    const k = l.exercise_name; if (!k) continue;
    exMax[k] = Math.max(exMax[k]||0, st.weight_kg||0);
    if (new Date(s.date) >= cutoff) exRecentMax[k] = Math.max(exRecentMax[k]||0, st.weight_kg||0);
  }
  const prs = Object.keys(exRecentMax)
    .filter(k => exRecentMax[k] >= exMax[k] && exRecentMax[k] > 0)
    .map(k => ({ exercise: k, weight: exRecentMax[k] }))
    .slice(0, 5);

  res.json({
    streak: { current, longest },
    weekPct, monthPct, weekDone, weeklyGoal, monthDone,
    consistency,
    today: { dow, template: todaySched?.template || null, done: completedDays.has(ymd(today)) },
    prs,
    totalSessions: sessions.length,
  });
};

exports.heatmap = async (req, res) => {
  const days = +(req.query.days || 119);
  const since = new Date(); since.setHours(0,0,0,0); since.setDate(since.getDate()-days+1);
  const sessions = await Session.find({ user: req.userId, date: { $gte: since } });
  const map = {};
  for (const s of sessions) {
    const k = ymd(s.date);
    const { v } = sessionVolume(s);
    map[k] = (map[k]||0) + (s.completed ? 1 : 0.5) + Math.min(2, v/3000);
  }
  res.json({ since: ymd(since), map });
};
