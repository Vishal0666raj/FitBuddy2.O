const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const Profile = require('../models/Profile');
const Schedule = require('../models/Schedule');
const Session = require('../models/Session');
const User = require('../models/User');
const Water = require('../models/Water');
const { sendMail } = require('./mailer');

function ymd(d){
  const dt = new Date(d);

  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2,'0');
  const day = String(dt.getDate()).padStart(2,'0');

  return `${y}-${m}-${day}`;
}

async function tick() {
  console.log(
  `Checking reminders at ${new Date().toLocaleString()}`
);
  const now = new Date();
  const utcMin = now.getUTCHours()*60 + now.getUTCMinutes();
  const reminders = await Reminder.find({ $or: [{ email_enabled: true }, { water_enabled: true }] });

  for (const r of reminders) {
    const user = await User.findById(r.user);
    if (!user) continue;

    // Local time for this user
    const localMin = ((utcMin + (r.tz_offset_min || 0)) + 24*60) % (24*60);
    const localHour = Math.floor(localMin / 60);
    const localMm = localMin % 60;
    const todayKey = ymd(now);

    // Workout reminder
    if (r.email_enabled && r.workout_time) {
      const [hh, mm] = r.workout_time.split(':').map(Number);
      if (localHour === hh && Math.abs(localMm - mm) <= 2) {
        const lastSent = r.last_workout_sent ? ymd(r.last_workout_sent) : null;
        if (lastSent !== todayKey) {
          const profile = await Profile.findOne({ user: r.user });
          const dow = new Date(now.getTime() + (r.tz_offset_min||0)*60000).getUTCDay();
          const sch = await Schedule.findOne({ user: r.user, dow }).populate('template');
          if (sch?.template) {
            const tpl = sch.template;
            const list = (tpl.exercises||[]).map(e => `<li>${e.name}</li>`).join('');
            await sendMail({
              to: user.email,
              subject: `Workout Reminder — ${tpl.name}`,
              html: `<p>Good morning ${profile?.name || ''},</p>
                     <p>Today is your <b>${tpl.name}</b>.</p>
                     <p>Planned workout:</p><ul>${list}</ul>
                     <p>Stay consistent and have a great workout. 💪</p>`,
            });
            r.last_workout_sent = now; await r.save();
          }
        }
      }
    }

    // Water reminder
    if (r.water_enabled) {
      const inWindow = localHour >= (r.water_start_hour||8) && localHour <= (r.water_end_hour||22);
      if (inWindow) {
        const interval = (r.water_interval_hours||2) * 60 * 60 * 1000;
        const since = r.last_water_sent ? (Date.now() - new Date(r.last_water_sent).getTime()) : interval+1;
        if (since >= interval) {
          const profile = await Profile.findOne({ user: r.user });
          const today = await Water.findOne({ user: r.user, date: todayKey });
          const goal = profile?.daily_water_goal_ml || 2500;
          const cur = today?.ml || 0;
          if (cur < goal) {
            await sendMail({
              to: user.email,
              subject: 'Hydration Reminder 💧',
              html: `<p>Hey ${profile?.name || ''},</p>
                     <p>You're at <b>${(cur/1000).toFixed(1)}L</b> of your <b>${(goal/1000).toFixed(1)}L</b> daily goal.</p>
                     <p>Time for a glass of water!</p>`,
            });
            r.last_water_sent = now; await r.save();
          }
        }
      }
    }
  }
}

exports.startScheduler = () => {
  // Every 5 minutes — coarse but sufficient
  cron.schedule('* * * * *', () => {
  tick().catch(e => console.error('scheduler', e));
});
};
