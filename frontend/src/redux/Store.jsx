import { configureStore } from '@reduxjs/toolkit';
import formDataReducer from './slices/FormDataSlice';
import loadingReducer from './slices/LoadingSlice';
import errorReducer from './slices/errorSlice';
import passwordStrengthReducer from './slices/passwordStrengthSlice';

const store = configureStore({
    reducer: {
        formData: formDataReducer,
        isLoading: loadingReducer,
        error: errorReducer,
        passwordStrength: passwordStrengthReducer,
    },
});

export default store;