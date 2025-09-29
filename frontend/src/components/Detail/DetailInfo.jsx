import React from "react";
import "./detailInfo.css";

function DetailInfo({ product }) {
  return (
    <section id="info" className="detailInfo">
      {product?.detailInfo && (
        <img src={`/${product.detailInfo}`} alt="상세정보" />
      )}
    </section>
  );
}

export default DetailInfo;
