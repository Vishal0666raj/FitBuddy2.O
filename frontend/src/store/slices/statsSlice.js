import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
export const fetchDashboard = createAsyncThunk('stats/dash', async () => (await api.get('/stats/dashboard')).data);
export const fetchHeatmap = createAsyncThunk('stats/heat', async (days=119) => (await api.get('/stats/heatmap', { params: { days } })).data);
const s = createSlice({
  name: 'stats', initialState: { dashboard: null, heatmap: null }, reducers: {},
  extraReducers: b => {
    b.addCase(fetchDashboard.fulfilled, (s,a) => { s.dashboard = a.payload; })
     .addCase(fetchHeatmap.fulfilled, (s,a) => { s.heatmap = a.payload; });
  },
});
export default s.reducer;
