import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import useAuth from "../../hooks/useAuth";
import { FaExclamationTriangle } from "react-icons/fa";
import "./Review.css";

export default function ReviewForm() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [content, setContent] = useState("");
  const [imgs, setImgs] = useState([]);

  // 리뷰 등록 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);

      for (let i = 0; i < imgs.length; i++) {
        formData.append("imgs", imgs[i]);
      }

      const res = await api.post("/api/review", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      // 응답에서 review.id 가져오기
      const newReviewId = res.data.id;

      // 알림창 띄우고 확인 누르면 상세페이지로 이동
      alert("리뷰가 등록되었습니다.");
      navigate(`/review/${newReviewId}`);
    } catch (err) {
      console.error("리뷰 등록 실패:", err);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  // 로그인 안 된 상태 접근 차단
  if (!auth.token) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <section className="review-create">
      <h1 className="review-create-title">리뷰 작성</h1>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="리뷰 내용을 입력하세요"
            rows={8}
          />
        </div>

        <div className="form-group">
          <label>이미지 (여러 장 선택 가능)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImgs(Array.from(e.target.files))}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            등록하기
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>

        <div className="warning-box">
          <p className="review-warning">
            <FaExclamationTriangle className="warning-icon" />
            작성 후 수정은 불가하며, 삭제 후 재작성해야 합니다.
          </p>
        </div>
      </form>
    </section>
  );
}
