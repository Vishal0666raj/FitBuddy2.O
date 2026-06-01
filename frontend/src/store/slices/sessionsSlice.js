import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
export const fetchSessions = createAsyncThunk('s/fetch', async (params={}) => (await api.get('/sessions', { params })).data);
export const fetchSession  = createAsyncThunk('s/fetchOne', async (id) => (await api.get(`/sessions/${id}`)).data);
export const createSession = createAsyncThunk('s/create', async (body) => (await api.post('/sessions', body)).data);
export const updateSession = createAsyncThunk('s/update', async ({id, body}) => (await api.put(`/sessions/${id}`, body)).data);
export const deleteSession = createAsyncThunk('s/delete', async (id) => { await api.delete(`/sessions/${id}`); return id; });
const s = createSlice({
  name: 'sessions',
  initialState: { items: [], total: 0, page: 1, pages: 1, current: null, loading: false },
  reducers: { setCurrent(s, a){ s.current = a.payload; } },
  extraReducers: b => {
    b.addCase(fetchSessions.pending, s => { s.loading = true; })
     .addCase(fetchSessions.fulfilled, (s,a) => { Object.assign(s, a.payload); s.loading = false; })
     .addCase(fetchSession.fulfilled, (s,a) => { s.current = a.payload; })
     .addCase(updateSession.fulfilled, (s,a) => { s.current = a.payload; s.items = s.items.map(x => x._id===a.payload._id?a.payload:x); })
     .addCase(deleteSession.fulfilled, (s,a) => { s.items = s.items.filter(x => x._id !== a.payload); });
  },
});
export const { setCurrent } = s.actions;
export default s.reducer;
