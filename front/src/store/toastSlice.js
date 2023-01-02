import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      if (state.toasts.length > 8) {
        state.toasts = state.toasts.splice(0, 8);
      }
      state.toasts.unshift(action.payload);
    },

    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => {
        return toast.id !== action.payload;
      });
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;
