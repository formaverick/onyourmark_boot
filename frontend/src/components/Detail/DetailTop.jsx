import React, { useState } from "react";
import "../reset.css";
import "./DetailTop.css";
import { useDispatch } from "react-redux";
import { addToCart } from '../Cart/cartSlice';
import { useNavigate } from "react-router-dom";
import { addToWish } from "../Wish/wishSlice";

function DetailTop({ product }) {
  const top = product?.detailTop?.[0];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCode, setSelectedCode] = useState("");

  
  const handleAddToCart = () => {
    if (!selectedSize || !selectedCode) {
      alert("사이즈와 코드를 선택해주세요.");
      return;
    }

    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      size: selectedSize,
      code: selectedCode,
      image: product.src,
      quantity: 1,
      tag_black: product.tag_black,
      tag_red: product.tag_red,
      tag_yellow: product.tag_yellow
    }));

    navigate("/cart");
  };

  const handleAddToWish = () => {
  if (!selectedSize || !selectedCode) {
    alert("사이즈와 코드를 선택해주세요.");
    return;
  }

  dispatch(addToWish({
    id: product.id,
    title: product.title,
    price: product.price,
    size: selectedSize,
    code: selectedCode,
    image: product.src,
    tag_black: product.tag_black,
    tag_red: product.tag_red,
    tag_yellow: product.tag_yellow
  }));

  navigate("/wish");
};

  return (
    <section className="detailTop">
      <div className="detailTopTab">
        <ul>
          <li><a href="/">홈 /</a></li>
          <li><a href="#">Brand /</a></li>
          <li><a href="#">{top?.brand} /</a></li>
          <li><a href="#">{product.category}</a></li>
        </ul>
      </div>

      <div className="detailTopInfo">
        {/* 왼쪽 이미지 영역 */}
        <div className="detailTopInfo_L">
          <img src={`/${top?.product_main}`} alt="메인 이미지" />
          <div className="bottomimgbox">
            {top?.product_small?.map((imgObj, idx) => (
              <img key={idx} src={`/${imgObj.img}`} alt={`서브-${idx}`} />
            ))}
          </div>
        </div>

        {/* 오른쪽 상품 정보 영역 */}
        <div className="detailTopInfo_R">
          <div className="productTitle">
            <div className="titleIcontag">
              {product.tag_black && (
                <img src={`/${product.tag_black}`} alt="블랙태그" />
              )}
              {product.tag_red && (
                <img src={`/${product.tag_red}`} alt="레드태그" />
              )}
              {product.tag_yellow && (
                <img src={`/${product.tag_yellow}`} alt="옐로태그" />
              )}
            </div>
            <h1>{product.title}</h1>
          </div>

          <div className="productDetail">
            <table>
              <tbody>
                <tr><th>판매가</th><td>{product.price}</td></tr>
                <tr><th>브랜드</th><td>{top?.brand}</td></tr>
                <tr><th>원산지</th><td>{top?.made}</td></tr>
                <tr><th>취급시 주의사항</th><td>{top?.warning}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="productSize">
            <table>
              <tbody>
                <tr>
                  <th className="tableTitle">사이즈</th>
                  <td>
                    <ul>
                      {top?.size?.map((s, i) => (
                        <li
                          key={i}
                          onClick={() => setSelectedSize(s.option)}
                          style={{
                            cursor: "pointer",
                            fontWeight: selectedSize === s.option ? "bold" : "normal",
                            border: selectedSize === s.option ? "1px solid #1a1a1a" : "1px solid #ddd"
                          }}
                        >
                          {s.option}
                        </li>
                      ))}
                    </ul>
                    <p className="optionTxt">[필수] 옵션을 선택해주세요</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="productCode">
            <table>
              <tbody>
                <tr>
                  <th className="tableTitle">코드</th>
                  <td>
                    <ul>
                      <li
                        onClick={() => setSelectedCode(top.code)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: selectedCode === top.code ? "#fff" : "rgba(0, 0, 0, 0.25)",
                          border: selectedCode === top.code ? "1px solid #1a1a1a" : "transparent"
                        }}
                      >
                        {top?.code}
                      </li>
                    </ul>
                    <p className="optionTxt">[필수] 옵션을 선택해주세요</p>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>(최소주문수량 1개 이상)</div>
          </div>

          <div className="productTotal">
            <span><strong>TOTAL</strong> (QUANTITY)</span>
            <span><strong>{selectedSize && selectedCode ? product.price : '0'}</strong>({selectedSize && selectedCode ? '1개' : '0개'})</span>
          </div>

          <div className="lastBtn">
            <a href="#" onClick={handleAddToCart}>BUY IT NOW</a>
            <button id="cart" onClick={handleAddToCart}>CART</button>
            <button id="wishList" onClick={handleAddToWish}>WISH LIST</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DetailTop;
