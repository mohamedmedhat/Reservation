// src/redux/slices/loadingSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'Loading',
  initialState: false,
  reducers: {
    setLoading: (state, action) => {
      return action.payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
