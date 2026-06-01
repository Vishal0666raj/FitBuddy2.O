import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
export const fetchProfile = createAsyncThunk('profile/fetch', async () => (await api.get('/profile')).data);
export const updateProfile = createAsyncThunk('profile/update', async (body) => (await api.put('/profile', body)).data);
const s = createSlice({
  name: 'profile', initialState: { data: null, loading: false, error: null }, reducers: {},
  extraReducers: b => {
    b.addCase(fetchProfile.fulfilled, (s,a) => { s.data = a.payload; })
     .addCase(updateProfile.fulfilled, (s,a) => { s.data = a.payload; });
  },
});
export default s.reducer;
