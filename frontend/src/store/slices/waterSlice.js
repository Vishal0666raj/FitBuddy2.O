import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
export const fetchWater = createAsyncThunk('w/fetch', async (params={}) => (await api.get('/water', { params })).data);
export const addWater = createAsyncThunk('w/add', async (body) => (await api.post('/water', body)).data);
const s = createSlice({
  name: 'water', initialState: { items: [] }, reducers: {},
  extraReducers: b => {
    b.addCase(fetchWater.fulfilled, (s,a) => { s.items = a.payload; })
     .addCase(addWater.fulfilled, (s,a) => {
       const i = s.items.findIndex(x => x.date === a.payload.date);
       if (i>=0) s.items[i] = a.payload; else s.items.push(a.payload);
     });
  },
});
export default s.reducer;
