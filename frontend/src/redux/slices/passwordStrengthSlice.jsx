// src/redux/slices/passwordStrengthSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const passwordStrengthSlice = createSlice({
  name: 'passwordStrength',
  initialState: null,
  reducers: {
    setPasswordStrength: (state, action) => {
      return action.payload;
    },
  },
});

export const { setPasswordStrength } = passwordStrengthSlice.actions;
export default passwordStrengthSlice.reducer;
