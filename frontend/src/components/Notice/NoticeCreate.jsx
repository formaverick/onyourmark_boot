import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import useAuth from "../../hooks/useAuth";
import "./Notice.css";

export default function NoticeCreate() {
  const navigate = useNavigate();
  const { role } = useAuth();

  // 입력 값 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mainImg, setMainImg] = useState(null);
  const [subImgs, setSubImgs] = useState([]);

  // 등록 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !mainImg) {
      alert("제목, 내용, 대표이미지는 필수입니다.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("mainImg", mainImg);

      for (let i = 0; i < subImgs.length; i++) {
        formData.append("subImgs", subImgs[i]);
      }

      const res = await api.post("/api/notices", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Location 헤더에서 새로 생성된 공지 id 추출
      const location = res.headers["location"];
      if (location) {
        const id = location.split("/").pop();
        navigate(`/notice/${id}`); // 등록 후 상세 페이지 이동
      } else {
        navigate("/notice");
      }
    } catch (err) {
      console.error("공지 등록 실패:", err);
      alert("공지 등록에 실패했습니다.");
    }
  };

  // 관리자만 접근 가능
  if (role !== "ADMIN") {
    return <div>접근 권한이 없습니다.</div>;
  }

  return (
    <section className="notice-create">
      <h1 className="notice-create-title">Launching Calendar 등록</h1>
      <form onSubmit={handleSubmit} className="notice-form">
        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={8}
          />
        </div>

        <div className="form-group">
          <label>대표 이미지</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImg(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label>서브 이미지 (여러 개 선택 가능)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setSubImgs(Array.from(e.target.files))}
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
      </form>
    </section>
  );
}
