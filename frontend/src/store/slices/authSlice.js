import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
const t0 = localStorage.getItem('fitBuddy.token');
const u0 = JSON.parse(localStorage.getItem('fitBuddy.user') || 'null');
export const login = createAsyncThunk('auth/login', async (body) => (await api.post('/auth/login', body)).data);
export const register = createAsyncThunk('auth/register', async (body) => (await api.post('/auth/register', body)).data);
const s = createSlice({
  name: 'auth',
  initialState: { token: t0, user: u0, loading: false, error: null },
  reducers: {
    logout(s){ s.token = null; s.user = null; localStorage.removeItem('fitBuddy.token'); localStorage.removeItem('fitBuddy.user'); },
  },
  extraReducers: b => {
    const setAuth = (s,a) => { s.token = a.payload.token; s.user = a.payload.user; s.loading = false; s.error = null;
      localStorage.setItem('fitBuddy.token', s.token); localStorage.setItem('fitBuddy.user', JSON.stringify(s.user)); };
    b.addCase(login.pending, s => { s.loading = true; s.error = null; })
     .addCase(login.fulfilled, setAuth)
     .addCase(login.rejected, (s,a) => { s.loading = false; s.error = a.error.message; })
     .addCase(register.pending, s => { s.loading = true; s.error = null; })
     .addCase(register.fulfilled, setAuth)
     .addCase(register.rejected, (s,a) => { s.loading = false; s.error = a.error.message; });
  },
});
export const { logout } = s.actions;
export default s.reducer;
