import React from "react";
import "./detailTab.css";

function DetailTab({ active, onTabClick }) {
  return (
    <section className="detailTab">
      <ul>
        <li className={active === "info" ? "active" : ""}>
          <a href="#info">상세정보</a>
        </li>
        <li className={active === "review" ? "active" : ""}>
          <a href="#review">상품후기</a>
        </li>
        <li className={active === "qa" ? "active" : ""}>
          <a href="#qa">상품문의</a>
        </li>
        <li className={active === "payment" ? "active" : ""}>
          <a href="#payment">배송/교환/환불</a>
        </li>
      </ul>
    </section>
  );
}

export default DetailTab;
