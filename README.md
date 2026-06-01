# fitBuddy — MERN Fitness Tracker (v2)

Production-ready MERN fitness tracker with deep exercise analytics, smart email reminders, and a fully responsive dark glassmorphism UI.

## Stack
- **Backend**: Node.js, Express, MongoDB/Mongoose, JWT, NodeMailer + node-cron, Zod
- **Frontend**: React 18, Vite, Redux Toolkit, styled-components, Recharts, react-router-dom

## Quickstart

### 1. Backend
```bash
cd backend
cp .env.example .env  # fill MONGO_URI, JWT_SECRET, SMTP_*
npm install
npm run dev           # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env  # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev           # http://localhost:5173
```

## Highlights

### Responsive everywhere
- Mobile-first layout. Sidebar collapses into hamburger drawer at <960px.
- Cards stack, charts resize via Recharts `ResponsiveContainer`.
- Activity heatmap is horizontally scrollable on small screens.
- Touch targets ≥44px. No horizontal page scroll.

### Exercise-based analytics (the big one)
The chart X-axis represents **actual workout occurrences**, not calendar days.
If you bench on Mon/Fri, the chart shows two points — not Mon/Tue/Wed/Thu/Fri with zeros.

- Filter by **Exercise**, **Muscle Group**, or **Template**, plus date range.
- Tracks volume (Weight × Reps × Sets), top weight, PR trajectory, reps, frequency.
- Stat cards: Total Volume / Sets / Reps / Best Set / PR.
- Per-exercise historical workout log table.

Endpoints:
- `GET /api/analytics/exercises` → unique exercise list
- `GET /api/analytics/exercise?name=Bench%20Press&from=&to=`
- `GET /api/analytics/muscle?group=chest`
- `GET /api/analytics/template?template=<id>`

### Smart reminders
- Per-user preferences in MongoDB (`Reminder` model): email enabled, workout time, water interval/window.
- Background `node-cron` job runs every 5 minutes server-side — fires whether or not the user has the app open.
- Workout email pulls today's scheduled template and lists the planned exercises.
- Water email checks today's intake vs daily goal before sending.

### Dashboard
Current streak, longest streak, consistency (28d), weekly/monthly goal completion %, today's scheduled workout, recent PRs (last 14d), water progress, activity heatmap (LeetCode-style).

### Performance
- Lazy-loaded routes (React.lazy + Suspense).
- `React.memo` on chart wrappers and stat cards.
- `useMemo`/`useCallback` for derived params and handlers.
- Paginated history (`?page=&limit=`).

## Project layout
```
backend/
  src/
    config/db.js
    middleware/{auth,validate}.js
    models/{User,Profile,Template,Session,Schedule,Water,Reminder}.js
    routes/*.routes.js
    controllers/*.controller.js
    services/{mailer,scheduler}.js
    server.js
frontend/
  src/
    api/client.js
    components/{Layout,Loading,charts/*}.jsx
    pages/{Auth,Dashboard,History,Templates,Schedule,Session,Analytics,Profile,Reminders}.jsx
    store/{index,slices/*}.js
    styles/{theme,ui}.js
    App.jsx  main.jsx
```

See `PROMPT.md` for the reusable prompt that generates this exact app.
