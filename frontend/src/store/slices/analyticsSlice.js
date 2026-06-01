import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
export const fetchExerciseList = createAsyncThunk('an/list', async () => (await api.get('/analytics/exercises')).data);
export const fetchExerciseProgression = createAsyncThunk('an/ex', async (params) => (await api.get('/analytics/exercise', { params })).data);
export const fetchMuscleProgression = createAsyncThunk('an/mu', async (params) => (await api.get('/analytics/muscle', { params })).data);
export const fetchTemplateProgression = createAsyncThunk('an/tp', async (params) => (await api.get('/analytics/template', { params })).data);
const s = createSlice({
  name: 'analytics', initialState: { exercises: [], exercise: null, muscle: null, template: null, loading: false }, reducers: {},
  extraReducers: b => {
    b.addCase(fetchExerciseList.fulfilled, (s,a) => { s.exercises = a.payload; })
     .addCase(fetchExerciseProgression.pending, s => { s.loading = true; })
     .addCase(fetchExerciseProgression.fulfilled, (s,a) => { s.exercise = a.payload; s.loading = false; })
     .addCase(fetchMuscleProgression.fulfilled, (s,a) => { s.muscle = a.payload; })
     .addCase(fetchTemplateProgression.fulfilled, (s,a) => { s.template = a.payload; });
  },
});
export default s.reducer;
