# Reusable Prompt — fitBuddy MERN v2

Use the prompt below verbatim with a capable code-gen agent to regenerate this app.

---

You are a Senior Full-Stack Engineer. Build a production-ready MERN fitness tracker named **fitBuddy** with these strict requirements.

## Stack (JavaScript only — NO TypeScript)
- Backend: Node.js, Express, MongoDB/Mongoose, JWT auth, bcryptjs, Zod input validation, NodeMailer, node-cron, express-rate-limit.
- Frontend: React 18 + Vite, Redux Toolkit, react-router-dom v6, styled-components, Recharts, lucide-react icons, axios.

## Backend models
- `User` (email/passwordHash)
- `Profile` (name, age, gender, height_cm, weight_kg, daily_water_goal_ml, weekly_workout_goal)
- `Template` (name, color, exercises[{name, muscle_group, target_sets, target_reps, notes}])
- `Session` (template, name, date, completed, duration_min, logs[{exercise_name, muscle_group, order, sets[{weight_kg, reps, rpe, done}]}])
- `Schedule` (user, dow 0-6, template) unique per (user,dow)
- `Water` (user, date YYYY-MM-DD, ml) unique per (user,date)
- `Reminder` (email_enabled, workout_time, tz_offset_min, water_enabled, water_interval_hours, water_start_hour, water_end_hour, last_water_sent, last_workout_sent)

## REST API (`/api/...`)
- `auth`: POST register/login → JWT
- `profile`: GET/PUT
- `templates`: full CRUD
- `sessions`: paginated list with `?page,limit,from,to,template,status,q`; CRUD; auto-prefill logs from template
- `schedule`: GET list + PUT { dow, template }
- `water`: GET range + POST { date, ml } (increments)
- `stats/dashboard`: returns { streak{current,longest}, weekPct, monthPct, weekDone, weeklyGoal, monthDone, consistency, today{dow,template,done}, prs[], totalSessions }
- `stats/heatmap?days=119`: { since, map: { YYYY-MM-DD: intensity } }
- `analytics/exercises`: unique exercise list with muscle group + count
- `analytics/exercise?name=&from=&to=`: SESSION-INDEXED points (no calendar gaps) + totals + bestSet + pr
- `analytics/muscle?group=&from=&to=`: session-indexed by muscle group
- `analytics/template?template=&from=&to=`: session-indexed by template
- `reminders`: GET/PUT preferences + POST test

## Critical analytics rule
For exercise progression charts, X-axis MUST be the sequence of workout occurrences (or actual workout dates), never a calendar day axis with zero points for non-workout days. If bench press is trained on Push days only, the chart shows 4 points across 4 push sessions — not 28 points across 4 weeks.

## Smart reminder system
Implement a background scheduler with `node-cron` running every 5 minutes. For each user with reminders enabled:
- Workout email: fires once per day at the user's configured local time (using tz_offset_min) if today has a scheduled template; lists the template's exercises.
- Water email: fires every N hours inside [start_hour, end_hour] window when today's intake < daily goal.

Email content for workouts:
```
Good Morning {name},
Today is your {template.name}.
Planned Workout:
- Bench Press
- Incline Bench
- Tricep Pushdown
Stay consistent and have a great workout.
```

## Frontend UX
- Dark glassmorphism theme. Primary gradient #ff6a3d → #ff3d7f. Display font Space Grotesk, body Inter.
- Layout: sticky 260px sidebar on desktop; hamburger drawer on <960px; touch targets ≥44px; safe-area insets respected.
- Pages: Auth, Dashboard, Analytics, History, Templates, Schedule, Session, Reminders, Profile.
- Dashboard widgets: streak, consistency, sessions, water, weekly/monthly goal bars, today card, hydration quick-add, activity heatmap (horizontally scrollable on mobile), recent PRs grid.
- History: server-side pagination, filters (template, status, date range, search).
- Session logger: sticky header on mobile, big touch steppers for weight/reps, completion toggle.
- Analytics page: tabs (exercise/muscle/template) + dropdowns + date range; volume / top-weight / PR / reps charts; stats tiles; per-exercise history table (horizontally scrollable on mobile).
- Reminders page: email toggle + workout time picker + water interval/window + Save / Send test email.

## Code quality
- Modular Redux Toolkit slices per domain.
- Reusable styled-components (`Card`, `Grid`, `Btn`, `Input`, `Select`, `Label`, `Pill`, `H1`, `H2`).
- `React.lazy` per route; `React.memo` for chart wrappers and stat tiles; `useMemo`/`useCallback` for derived state.
- Axios interceptor injects JWT; 401 clears local storage.
- Zod validation on auth routes; rate limit on `/api`.

Deliver `backend/` and `frontend/` folders with `package.json`, `.env.example`, and a `README.md` documenting `npm install && npm run dev` for both, plus an explanation of the analytics + reminder design.
