import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import Loading from './components/Loading';
const Auth      = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const History   = lazy(() => import('./pages/History'));
const Templates = lazy(() => import('./pages/Templates'));
const Schedule  = lazy(() => import('./pages/Schedule'));
const Session   = lazy(() => import('./pages/Session'));
const Profile   = lazy(() => import('./pages/Profile'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Reminders = lazy(() => import('./pages/Reminders'));

function Private({ children }) {
  const token = useSelector(s => s.auth.token);
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<Private><Layout /></Private>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/session/:id" element={<Session />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
