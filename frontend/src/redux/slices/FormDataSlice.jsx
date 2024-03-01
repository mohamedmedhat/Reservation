// src/redux/slices/formDataSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const formDataSlice = createSlice({
  name: 'formData',
  initialState: {
    name: "",
    lastname: "",
    phoneNumber:"",
    email: "",
    age: "",
    password: ""
  },
  reducers: {
    updateFormData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateFormData } = formDataSlice.actions;
export default formDataSlice.reducer;
