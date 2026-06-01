import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import profile from './slices/profileSlice';
import templates from './slices/templatesSlice';
import sessions from './slices/sessionsSlice';
import schedule from './slices/scheduleSlice';
import water from './slices/waterSlice';
import stats from './slices/statsSlice';
import analytics from './slices/analyticsSlice';
import reminders from './slices/remindersSlice';
export const store = configureStore({
  reducer: { auth, profile, templates, sessions, schedule, water, stats, analytics, reminders },
});
