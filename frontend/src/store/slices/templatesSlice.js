import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
export const fetchTemplates = createAsyncThunk('tpl/fetch', async () => (await api.get('/templates')).data);
export const createTemplate = createAsyncThunk('tpl/create', async (body) => (await api.post('/templates', body)).data);
export const updateTemplate = createAsyncThunk('tpl/update', async ({id, body}) => (await api.put(`/templates/${id}`, body)).data);
export const deleteTemplate = createAsyncThunk('tpl/delete', async (id) => { await api.delete(`/templates/${id}`); return id; });
const s = createSlice({
  name: 'templates', initialState: { items: [], loading: false }, reducers: {},
  extraReducers: b => {
    b.addCase(fetchTemplates.fulfilled, (s,a) => { s.items = a.payload; })
     .addCase(createTemplate.fulfilled, (s,a) => { s.items.unshift(a.payload); })
     .addCase(updateTemplate.fulfilled, (s,a) => { s.items = s.items.map(t => t._id===a.payload._id ? a.payload : t); })
     .addCase(deleteTemplate.fulfilled, (s,a) => { s.items = s.items.filter(t => t._id !== a.payload); });
  },
});
export default s.reducer;
