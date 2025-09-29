import { createSlice } from "@reduxjs/toolkit";

const wishSlice = createSlice({
  name: "wish",
  initialState: {
    items: [{
      id: "11",
      title: "클라우드 몬스터 2 M",
      price: "219,000원",
      size: "265",
      code: "3ME10121043",
      image: "img/main_page/dailyHighlights/daily11.jpg",
      quantity: 1
    },
    {
      id: "16",
      title: "아디제로 Evo SL M",
      price: "209,000원",
      size: "275",
      code: "JR3420",
      image: "img/main_page/dailyHighlights/daily16.jpg ",
      quantity: 1
    }
  ]
  },
  reducers: {
    addToWish: (state, action) => {
      const newItem = action.payload;
      const exists = state.items.find(
        item => item.id === newItem.id && item.size === newItem.size && item.code === newItem.code
      );
      if (!exists) {
        state.items.push(newItem);
      }
    },
    removeFromWish: (state, action) => {
      const { id, size, code } = action.payload;
      state.items = state.items.filter(
        item => !(item.id === id && item.size === size && item.code === code)
      );
    },
    clearWish: (state) => {
      state.items = [];
    }
  }
});

export const { addToWish, removeFromWish, clearWish } = wishSlice.actions;
export default wishSlice.reducer;
