const Session = require('../models/Session');

function ymd(d){ return new Date(d).toISOString().slice(0,10); }

function buildRangeFilter(userId, from, to) {
  const f = { user: userId };
  if (from || to) f.date = {};
  if (from) f.date.$gte = new Date(from);
  if (to) f.date.$lte = new Date(to);
  return f;
}

exports.exercises = async (req, res) => {
  const sessions = await Session.find({ user: req.userId }).select('logs');
  const map = new Map();
  for (const s of sessions) for (const l of s.logs||[]) {
    if (!l.exercise_name) continue;
    const k = l.exercise_name;
    if (!map.has(k)) map.set(k, { name: k, muscle_group: l.muscle_group || null, count: 0 });
    map.get(k).count++;
    if (!map.get(k).muscle_group && l.muscle_group) map.get(k).muscle_group = l.muscle_group;
  }
  res.json([...map.values()].sort((a,b)=>b.count-a.count));
};

// Exercise progression: SESSION-INDEXED (no calendar gaps)
exports.exerciseProgression = async (req, res) => {
  const { name, from, to } = req.query;
  if (!name) return res.status(400).json({ message: 'name required' });
  const sessions = await Session.find(buildRangeFilter(req.userId, from, to)).sort('date');
  const points = []; // one per session that contains the exercise
  let pr = 0, totalVol = 0, totalSets = 0, totalReps = 0, bestSet = null;
  for (const s of sessions) {
    const logs = (s.logs||[]).filter(l => l.exercise_name === name);
    if (!logs.length) continue;
    let vol=0, sets=0, reps=0, maxW=0, topSet=null;
    for (const l of logs) for (const st of l.sets||[]) {
      vol += (st.weight_kg||0)*(st.reps||0); sets++; reps += st.reps||0;
      if ((st.weight_kg||0) > maxW) { maxW = st.weight_kg; topSet = { weight_kg: st.weight_kg, reps: st.reps }; }
    }
    pr = Math.max(pr, maxW);
    totalVol += vol; totalSets += sets; totalReps += reps;
    if (!bestSet || (topSet && topSet.weight_kg > bestSet.weight_kg)) bestSet = topSet;
    points.push({
      session_id: s._id, date: ymd(s.date), label: ymd(s.date),
      volume: Math.round(vol), max_weight: maxW, sets, reps, pr_after: pr,
    });
  }
  res.json({
    exercise: name,
    totals: { volume: Math.round(totalVol), sets: totalSets, reps: totalReps, pr, bestSet, frequency: points.length },
    points,
  });
};

exports.muscleProgression = async (req, res) => {
  const { group, from, to } = req.query;
  if (!group) return res.status(400).json({ message: 'group required' });
  const sessions = await Session.find(buildRangeFilter(req.userId, from, to)).sort('date');
  const points = [];
  let totalVol = 0, totalSets = 0;
  for (const s of sessions) {
    let vol=0, sets=0;
    for (const l of s.logs||[]) if ((l.muscle_group||'').toLowerCase() === group.toLowerCase())
      for (const st of l.sets||[]) { vol += (st.weight_kg||0)*(st.reps||0); sets++; }
    if (vol === 0 && sets === 0) continue;
    totalVol += vol; totalSets += sets;
    points.push({ date: ymd(s.date), label: ymd(s.date), volume: Math.round(vol), sets });
  }
  res.json({ group, totals: { volume: Math.round(totalVol), sets: totalSets, frequency: points.length }, points });
};

exports.templateProgression = async (req, res) => {
  const { template, from, to } = req.query;
  const filter = buildRangeFilter(req.userId, from, to);
  if (template && template !== 'all') filter.template = template;
  const sessions = await Session.find(filter).sort('date');
  const points = sessions.map(s => {
    let vol=0, sets=0;
    for (const l of s.logs||[]) for (const st of l.sets||[]) { vol += (st.weight_kg||0)*(st.reps||0); sets++; }
    return { date: ymd(s.date), label: ymd(s.date), volume: Math.round(vol), sets, name: s.name };
  }).filter(p => p.volume > 0 || p.sets > 0);
  res.json({ points });
};
