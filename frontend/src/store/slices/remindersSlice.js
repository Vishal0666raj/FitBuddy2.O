import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
export const fetchReminders = createAsyncThunk('rem/fetch', async () => (await api.get('/reminders')).data);
export const updateReminders = createAsyncThunk('rem/update', async (body) => (await api.put('/reminders', body)).data);
export const testReminder = createAsyncThunk('rem/test', async () => (await api.post('/reminders/test')).data);
const s = createSlice({
  name: 'reminders', initialState: { data: null }, reducers: {},
  extraReducers: b => {
    b.addCase(fetchReminders.fulfilled, (s,a) => { s.data = a.payload; })
     .addCase(updateReminders.fulfilled, (s,a) => { s.data = a.payload; });
  },
});
export default s.reducer;
