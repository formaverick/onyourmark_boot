import React, { useState } from 'react';
import "../reset.css";
import "./Wish.css";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWish, clearWish } from "./wishSlice";
import { addToCart } from "../Cart/cartSlice";

const Wish = () => {
    const wishItems = useSelector(state => state.wish.items);
    const dispatch = useDispatch();
    const [checked, setChecked] = useState([]);
    const navigate = useNavigate();

    const handleCheck = (key, isChecked) => {
        if (isChecked) {
            setChecked(prev => [...prev, key]);
        } else {
            setChecked(prev => prev.filter(k => k !== key));
        }
    };

    const getItemKey = (item) => `${item.id}_${item.size}_${item.code}`;


    return (
        <div className="WishListBox">
            <div className="WishListCategory">
                <ul>
                    <li><a href="/">홈 /</a></li>
                    <li>나의 위시리스트</li>
                </ul>
            </div>
            <div className="WishListTitle">나의 위시리스트</div>

            {wishItems.map((item, i) => (

                <div key={i} className="WishListMainBox">
                    <input
                        type="checkbox"
                        checked={checked.includes(getItemKey(item))}
                        onChange={(e) => handleCheck(getItemKey(item), e.target.checked)}
                    />
                    <div className="WishListMain">
                        <img src={`/${item.image}`} alt={item.title} />
                        <ul>
                            <li>
                                <Link to={`/daily/${item.id}`}>{item.title} ({item.code})</Link>
                            </li>
                            <li>{item.price}</li>
                            <li class="optionCheck">옵션변경</li>
                        </ul>
                        <div className="WishListBtns">
                            <div className="WishListCart"
                                onClick={() => dispatch(removeFromWish({ id: item.id, size: item.size, code: item.code }))}>
                                삭제하기</div>
                            <div className="WishListCart" onClick={() => {
                                dispatch(addToCart({ ...item, quantity: 1 }));
                                dispatch(removeFromWish({ id: item.id, size: item.size, code: item.code }));
                                navigate("/cart");
                            }}>장바구니</div>
                            <div className="WishListOrder">주문하기</div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="deleteBtn">
                <div className="deleteAll" onClick={() => {
                    dispatch(clearWish());
                    setChecked([]);
                }}>전체삭제</div>
                <div className="deleteCheck" onClick={() => {
                    checked.forEach(key => {
                        const [id, size, code] = key.split("_");
                        dispatch(removeFromWish({ id, size, code }));
                    });
                    setChecked([]);
                }}>선택삭제</div>
            </div>

            <div className="allBtn">
                <div className="allCart" onClick={() => {
                    wishItems.forEach(item => {
                        dispatch(addToCart({ ...item, quantity: 1 }));
                        dispatch(removeFromWish({ id: item.id, size: item.size, code: item.code }));
                    });
                    navigate("/cart");
                }}>전체상품주문</div>
            </div>
        </div>
    );
};

export default Wish;