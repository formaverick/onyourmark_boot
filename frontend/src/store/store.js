import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../components/Cart/cartSlice';
import wishReducer from "../components/Wish/wishSlice";
import dailyReducer from "../components/Daily/dailySlice";
import collectionReducer from '../components/Collection/collectionSlice';

export default configureStore({
  reducer: {
    cart: cartReducer,
    wish: wishReducer,
    daily: dailyReducer,
    collection: collectionReducer
  }
});
