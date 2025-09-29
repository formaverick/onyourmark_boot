import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [{
      id: "1",
      title: "패스트 알 나이트로 엘리트 3",
      price: "379,000원",
      size: "250",
      code: "31206001",
      image: "img/main_page/dailyHighlights/daily1.jpg",
      quantity: 1,
      tag_black: "img/main_page/icon/black_tag_icon.jpg"
    },
    {
      id: "2",
      title: "메타스피드 엣지 파리",
      price: "299,000원",
      size: "230",
      code: "1013A124400",
      image: "img/main_page/dailyHighlights/daily2.jpg",
      quantity: 1,
      tag_red: "img/main_page/icon/red_tag_icon.gif"
    }
    ]
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;

      const existingItem = state.items.find(
        item =>
          String(item.id) === String(newItem.id) &&
          String(item.size) === String(newItem.size) &&
          String(item.code) === String(newItem.code)
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    },

    removeFromCart: (state, action) => {
      const target = action.payload; // { id, size, code }
      state.items = state.items.filter(
        item =>
          !(
            item.id === target.id &&
            item.size === target.size &&
            item.code === target.code
          )
      );
    },

    updateQuantity: (state, action) => {
      const { id, size, code, amount } = action.payload;

      const item = state.items.find(
        i => i.id === id && i.size === size && i.code === code
      );

      if (item) {
        const newQuantity = item.quantity + amount;
        item.quantity = newQuantity > 0 ? newQuantity : 1; // 최소 수량 1
      }
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;