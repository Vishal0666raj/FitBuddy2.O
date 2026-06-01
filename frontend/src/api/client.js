import axios from 'axios';
import { store } from '../store';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://fitbuddy2-o.onrender.com' });
api.interceptors.request.use(cfg => {
  const t = store.getState().auth?.token;
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
api.interceptors.response.use(r=>r, err => {
  if (err?.response?.status === 401) {
    localStorage.removeItem('fitBuddy.token'); localStorage.removeItem('fitBuddy.user');
  }
  return Promise.reject(err);
});
export default api;
