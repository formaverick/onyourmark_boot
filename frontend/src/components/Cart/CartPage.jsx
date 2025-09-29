import React from 'react';
import CartTop from './CartTop';
import CartBody from './CartBody';
import CartBottom from './CartBottom';
import "../reset.css";
import './Cart.css';

function CartPage() {
  return (
    <>
      <CartTop />
      <CartBody />
      <CartBottom />
    </>
  );
}

export default CartPage;
