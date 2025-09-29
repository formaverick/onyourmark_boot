import React from "react";
import "./detailReview.css";

function DetailReview({ product }) {
  const photoReviews = product?.reviewPhoto || [];
  const textReviews = product?.reviewMainBody || [];

  return (
    <section id="review" className="detailReview">
      <div className="reviewTop">
        <h1>REVIEW</h1>
      </div>

      <div className="reviewBody">
        <div className="reviewPhoto">
          {[...Array(5)].map((_, idx) => {
            const review = photoReviews[idx];

            return (
              <div key={idx}>
                {review ? (
                  <>
                    <img src={`/${review.photo}`} alt={`리뷰사진-${idx}`} />
                    <div className="reviewText">
                      <p>{review.review_content}</p>
                      <span>{review.name}</span>
                      <span>{review.date}</span>
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>


        <div className="reviewMain">
          <div className="reviewMainTop">
            <h1>리뷰 {textReviews.length}</h1>
            <div>
              <ul>
                <li>추천순</li>
                <li>최신순</li>
                <li>별점 높은 순</li>
              </ul>
              <img src="/img/main_page/icon/search_icon.svg" alt="검색" />
            </div>
          </div>

          <div className="reviewMainBody">
            <table>
              <tbody>
                {textReviews.map((review, idx) => (
                  <tr key={idx}>
                    <th>
                      <div className="starBox">
                        {review.star.map((s, i) => (
                          <img key={i} src={`/${s.img}`} alt="별점" />
                        ))}
                      </div>
                      {review.name}
                      <p>{review.date}</p>
                    </th>
                    <td>
                      {review.monthTag && (
                        <span className="monthTag">{review.monthTag}</span>
                      )}
                      {review.newTag && (
                        <span className="newTag">{review.newTag}</span>
                      )}
                      {review.content}
                      <div className="reviewTags">
                        {review.reviewTag.map((tag, i) => (
                          <div className="reviewTag" key={i}>
                            <img src={`/${tag.img}`} alt="태그아이콘" />
                            {tag.tagname}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DetailReview;
