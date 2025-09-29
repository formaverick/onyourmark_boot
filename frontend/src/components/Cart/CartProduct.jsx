import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { updateQuantity, removeFromCart } from "./cartSlice";

const CartProduct = ({ checkedItems, setCheckedItems }) => {
    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();

    const parsePrice = (priceString) => {
        if (!priceString) return 0;
        return Number(priceString.toString().replace(/[^0-9]/g, ""));
    };

    const getItemKey = (item) => `${item.id}_${item.size}_${item.code}`;

    const handleCheck = (key, checked) => {
        if (checked) {
            setCheckedItems(prev => [...prev, key]);
        } else {
            setCheckedItems(prev => prev.filter(k => k !== key));
        }
    };


    return (
        <>
            {cartItems.map((item, i) => {
                const key = getItemKey(item);
                const isChecked = checkedItems.includes(key);

                return (
                    <div key={key} className="cartProductBox">
                        <div className="cartProductMain">
                            <input
                                type="checkbox"
                                className="check"
                                checked={isChecked}
                                onChange={(e) => handleCheck(key, e.target.checked)}
                            />
                            <img src={`/${item.image}`} alt={item.title} />
                            <ul>
                                <li>
                                    <Link to={`/daily/${item.id}`}>{item.title}</Link>
                                    {item.tag_black && <img src={`/${item.tag_black}`} alt="black tag" />}
                                    {item.tag_red && <img src={`/${item.tag_red}`} alt="red tag" />}
                                    {item.tag_yellow && <img src={`/${item.tag_yellow}`} alt="yellow tag" />}
                                </li>
                                <li>{item.price}</li>
                                <li><span>-0</span>원</li>
                                <li className="colorGray">배송:[무료] / 기본배송</li>
                            </ul>
                        </div>
                        <div className="cartProductOption">
                            <span>[옵션: {item.size} / {item.code}]</span>
                        </div>
                        <div className="cartProductCount">
                            <span>수량</span>
                            <div className="cartCountBtnBox">
                                <div>
                                    <a onClick={() =>
                                        dispatch(updateQuantity({ id: item.id, size: item.size, code: item.code, amount: -1 }))
                                    }
                                        className="countUpDown">-</a>
                                    <input type="text" value={item.quantity} readOnly />
                                    <a onClick={() =>
                                        dispatch(updateQuantity({ id: item.id, size: item.size, code: item.code, amount: 1 }))
                                    }
                                        className="countUpDown">+</a>
                                </div>
                                <div className="productDelete" onClick={() =>
                                    dispatch(removeFromCart({ id: item.id, size: item.size, code: item.code }))
                                }
                                >삭제</div>
                            </div>
                        </div>
                        <div className="cartProductPrice">
                            <span>주문금액</span>
                            <span><strong>{(parsePrice(item.price) * item.quantity).toLocaleString()}</strong>원</span>
                        </div>
                        <div className="cartProductBtn">
                            <div>관심상품</div>
                            <div>주문하기</div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default CartProduct;