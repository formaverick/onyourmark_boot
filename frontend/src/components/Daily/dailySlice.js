import { createSlice } from "@reduxjs/toolkit";

const dailySlice = createSlice({
  name: "daily",
  initialState: {
    products: [],
    weekly: []
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setWeekly: (state, action) => {
      state.weekly = action.payload;
    }
  }
});

export const { setProducts, setWeekly } = dailySlice.actions;
export default dailySlice.reducer;