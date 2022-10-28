import { createSlice } from '@reduxjs/toolkit';

export const tempSlice = createSlice({
  name: 'temp',
  initialState: {
    number: 0,
  },
  reducers: {
    add: (state, action) => {
      state.number = state.number + +action.payload;
    },
    subtract: (state, action) => {
      state.number = state.number - +action.payload;
    },
    reset: (state) => {
      state = 0;
    },
  },
});

export const { add, subtract, reset } = tempSlice.actions;
export default tempSlice.reducer;
