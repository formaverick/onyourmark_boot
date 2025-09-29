import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CartProduct from './CartProduct';

const CartBody = () => {
    const cartItems = useSelector(state => state.cart.items);
    const [checkedItems, setCheckedItems] = useState([]);

    const parsePrice = (priceString) => {
        if (!priceString) return 0;
        return Number(priceString.toString().replace(/[^0-9]/g, ""));
    };

    const getItemKey = (item) => `${item.id}_${item.size}_${item.code}`;

    const totalPrice = cartItems.reduce((sum, item) => {
        const key = getItemKey(item);
        const isSelected = checkedItems.length === 0 || checkedItems.includes(key);

        if (isSelected) {
            return sum + parsePrice(item.price) * item.quantity;
        }
        return sum;
    }, 0);


    return (
        <div class="wishBody">
            <div class="deliveryTap">
                <ul>
                    <li>국내배송상품 ({cartItems.length})</li>
                    <li>해외배송상품 (0)</li>
                </ul>

                <p>장바구니에 담긴 상품은 3일 동안 보관됩니다.</p>
            </div>
            <div class="cartContainer">
                <div class="cartProduct">
                    <h1>장바구니 상품</h1>
                    <div class="productCount">
                        <span>일반상품 ({cartItems.length})</span>
                    </div>

                    <div class="cartProductWrap">
                        <CartProduct
                            checkedItems={checkedItems}
                            setCheckedItems={setCheckedItems}
                        />
                    </div>
                </div>
                <div class="cartTotal">
                    <div>
                        <div class="totalSum">
                            <div class="totalSumPrice">
                                <h4 class="totalTitle">총 상품금액</h4>
                                <div><span><strong>{totalPrice.toLocaleString()}</strong>원</span></div>
                            </div>
                            <div class="totalSumDerivery">
                                <h4 class="totalTitle">총 배송비</h4>
                                <div><span><strong>0</strong>원</span></div>
                            </div>
                            <div class="totalSumRecipt">
                                <h4>결제예정금액</h4>
                                <div><strong>{totalPrice.toLocaleString()}<span>원</span></strong></div>
                            </div>
                        </div>
                        <div class="totalOrder">전체상품주문</div>
                        <div class="checkOrder">선택상품주문</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartBody;