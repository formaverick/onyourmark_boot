import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import useAuth from "../../hooks/useAuth";
import "../reset.css";
import "./Review.css";

function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 작성자명 마스킹
  const maskName = (name) => {
    if (!name || name.length <= 1) return name;
    return name[0] + "*".repeat(name.length - 1);
  };

  // 상세조회
  const fetchReviewDetail = async () => {
    try {
      const response = await api.get(`/api/review/${id}`);
      setReview(response.data);
    } catch (err) {
      setError("리뷰 상세 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/review/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      alert("리뷰가 삭제되었습니다.");
      navigate("/review");
    } catch (err) {
      alert("삭제 실패: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchReviewDetail();
  }, [id]);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!review) return null;

  return (
    <section className="reviewDetail">
      <div className="detailHeader">
        <h2 className="reviewHeader">
          <Link to="/review">Review</Link>
        </h2>
        <div className="reviewDetailMeta">
          <span className="reviewAuthor">
            {maskName(review.member.username)}
          </span>
          <span className="reviewDate">
            {new Date(review.createdAt).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </div>

      <div className="detailContent">
        <p className="reviewContent">{review.content}</p>
        {review.images?.length > 0 && (
          <div className="detailImages">
            {review.images.map((img, idx) => (
              <img key={idx} src={img} alt="리뷰 이미지" />
            ))}
          </div>
        )}
      </div>

      {/* 유사 리뷰 추천 */}
      <div className="relatedReviews">
        <h3>다른 리뷰도 구경해보세요!</h3>
        <ul>
          {review.relatedReviews?.map((r) => (
            <li
              key={r.review_id}
              className="relatedReviewItem"
              onClick={() => navigate(`/review/${r.id}`)}
            >
              <p>{r.content}</p>

              <div className="reviewMeta">
                <span className="reviewAuthor">
                  {maskName(review.member?.username || "알수없음")}
                </span>
                <span className="reviewDate">
                  {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="boardDetailButtons">
        {/* 목록으로 */}
        <button
          className="qaBtn"
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            color: "#495057",
          }}
          onClick={() => navigate("/review")}
        >
          목록으로
        </button>

        {/* 작성자 본인만 삭제 버튼 노출 */}
        {auth?.memberId === review.member?.memberId && (
          <button
            className="qaBtn"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #1a1a1a",
              color: "#1a1a1a",
            }}
            onClick={handleDelete}
          >
            삭제
          </button>
        )}
      </div>
    </section>
  );
}

export default ReviewDetail;
