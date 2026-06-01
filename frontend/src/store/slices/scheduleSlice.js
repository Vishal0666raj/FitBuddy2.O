import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
export const fetchSchedule = createAsyncThunk('sch/fetch', async () => (await api.get('/schedule')).data);
export const setSchedule = createAsyncThunk('sch/set', async (body) => (await api.put('/schedule', body)).data);
const s = createSlice({
  name: 'schedule', initialState: { items: [] }, reducers: {},
  extraReducers: b => {
    b.addCase(fetchSchedule.fulfilled, (s,a) => { s.items = a.payload; })
     .addCase(setSchedule.fulfilled, (s,a) => {
       const i = s.items.findIndex(x => x.dow === a.payload.dow);
       if (i>=0) s.items[i] = a.payload; else s.items.push(a.payload);
     });
  },
});
export default s.reducer;
