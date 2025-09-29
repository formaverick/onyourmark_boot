import React from 'react';

function CartTop() {
  return (
    <div className="wishTop">
      <div className="wishcategory">
        <ul>
          <li><a href="/">홈 /</a></li>
          <li>장바구니</li>
        </ul>
      </div>
      <div className="wishTitle">
        <h1>장바구니</h1>
      </div>
      <div className="wishStep">
        <ul>
          <li>1. 장바구니</li>
          <li>2. 주문서작성</li>
          <li>3. 주문완료</li>
        </ul>
      </div>
    </div>
  );
}

export default CartTop;