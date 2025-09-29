import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import useAuth from "../../hooks/useAuth";
import "../reset.css";
import "./Review.css";

function ReviewMain() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const auth = useAuth();
  const navigate = useNavigate();

  // 작성자명 마스킹
  const maskName = (name) => {
    if (!name || name.length <= 1) return name;
    return name[0] + "*".repeat(name.length - 1);
  };

  // 리뷰 목록 불러오기
  const fetchReviews = async (page = 0) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/review?page=${page}&size=10&sort=createdAt,desc`
      );
      const data = response.data;
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "리뷰 목록 조회 실패"
      );
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      fetchReviews(page);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">오류: {error}</div>;

  return (
    <section className="reviewBoard">
      <div className="reviewBoardTop">
        <h1 className="reviewHeader">Review</h1>

        <div>
          <button
            className="qaBtn"
            onClick={() => {
              if (!auth.token) {
                alert("로그인이 필요합니다.");
                navigate("/login"); // 로그인 페이지로 이동
              } else {
                navigate("/review/form"); // 리뷰 작성 폼으로 이동
              }
            }}
          >
            WRITE
          </button>
        </div>
      </div>

      <div className="reviewBoardBody">
        {reviews.length === 0 ? (
          <div className="noReview">등록된 리뷰가 없습니다.</div>
        ) : (
          <ul className="reviewList">
            {reviews.map((review, idx) => (
              <li
                key={review.id}
                className="reviewItem"
                onClick={() => navigate(`/review/${review.id}`)}
              >
                <p className="reviewContent">{review.content}</p>
                <div className="reviewMeta">
                  <span className="reviewAuthor">
                    {maskName(review.member.username)}
                  </span>
                  <span className="reviewDate">
                    {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                {review.images?.length > 0 && (
                  <div className="reviewThumbnails">
                    {review.images.map((img, idx2) => (
                      <img key={idx2} src={img} alt="리뷰 썸네일" />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div
          className="pagination"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
            gap: "5px",
          }}
        >
          {/* 이전 버튼 */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="paBtn"
          >
            &lt;
          </button>

          {(() => {
            const pages = [];
            const blockSize = 10; // 블록 크기
            const currentBlock = Math.floor(currentPage / blockSize); // 현재 블록 번호
            const start = currentBlock * blockSize;
            const end = Math.min(start + blockSize, totalPages);

            for (let i = start; i < end; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className="paBtn"
                  style={{
                    fontWeight: currentPage === i ? "bold" : "normal",
                    border:
                      currentPage === i
                        ? "1px solid #1a1a1a"
                        : "1px solid #ccc",
                    backgroundColor: currentPage === i ? "#fff" : "#f9f9f9",
                    padding: "5px 10px",
                  }}
                >
                  {i + 1}
                </button>
              );
            }

            return pages;
          })()}

          {/* 다음 버튼 */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="paBtn"
          >
            &gt;
          </button>
        </div>
      )}
    </section>
  );
}

export default ReviewMain;
