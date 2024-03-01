// src/redux/slices/errorSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const errorSlice = createSlice({
  name: 'error',
  initialState: "",
  reducers: {
    setError: (state, action) => {
      return action.payload;
    },
  },
});

export const { setError } = errorSlice.actions;
export default errorSlice.reducer;
