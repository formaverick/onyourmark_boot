import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import DetailTop from "./DetailTop";
import DetailTab from "./DetailTab";
import DetailInfo from "./DetailInfo";
import DetailReview from "./DetailReview";
import DetailQA from "./DetailQA";
import DetailPayment from "./DetailPayment";

function DetailPage() {
  const { id } = useParams();
  const products = useSelector(state => state.daily.products);
  const weekly = useSelector(state => state.daily.weekly);
  const seoul = useSelector(state => state.collection.seoul)
  const all = [...products, ...weekly, ...seoul];
  const product = all.find(item => item.id === id);

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <DetailTop product={product} />

      <section id="info">
        <DetailTab active="info" />
        <DetailInfo product={product} />
      </section>

      <section id="review">
        <DetailTab active="review" />
        <DetailReview product={product} />
      </section>

      <section id="qa">
        <DetailTab active="qa" />
        <DetailQA />
      </section>

      <section id="payment">
        <DetailTab active="payment" />
        <DetailPayment />
      </section>
    </>
  );
}

export default DetailPage;