import { createSlice } from "@reduxjs/toolkit";

const collectionSlice = createSlice({
  name: "collection",
  initialState: {
    seoul: []
  },
  reducers: {
    setCollection: (state, action) => {
      state.seoul = action.payload;
    }
  }
});

export const { setCollection } = collectionSlice.actions;
export default collectionSlice.reducer;