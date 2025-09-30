import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import useAuth from "../../hooks/useAuth";
import "./Notice.css";

export default function NoticeUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mainImg, setMainImg] = useState(null); // 새 업로드용
  const [subImgs, setSubImgs] = useState([]); // 새 업로드용
  const [existingMainImg, setExistingMainImg] = useState(null); // 기존 메인
  const [existingSubImgs, setExistingSubImgs] = useState([]); // 기존 서브

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await api.get(`/api/notices/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);

        // 기존 이미지 분리
        const main = res.data.images.find((img) => img.type === "MAIN");
        const subs = res.data.images.filter((img) => img.type === "SUB");

        setExistingMainImg(main || null);
        setExistingSubImgs(subs || []);
      } catch (err) {
        console.error("공지 불러오기 실패:", err);
      }
    };
    fetchNotice();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      // 새 메인 이미지를 올렸을 때만 교체
      if (mainImg) {
        formData.append("mainImg", mainImg);
      }

      // 새 서브 이미지 있으면 추가
      for (let i = 0; i < subImgs.length; i++) {
        formData.append("subImgs", subImgs[i]);
      }

      await api.put(`/api/notices/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/notice/${id}`);
    } catch (err) {
      console.error("공지 수정 실패:", err);
      alert("공지 수정에 실패했습니다.");
    }
  };

  if (role !== "ADMIN") {
    return <div>권한이 없습니다.</div>;
  }

  return (
    <section className="notice-create">
      <h1 className="notice-create-title">Launching Calendar 수정</h1>

      <form onSubmit={handleSubmit} className="notice-form">
        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
          />
        </div>

        <div className="form-group">
          <label>현재 메인 이미지</label>
          {existingMainImg && (
            <img
              src={existingMainImg.imgUrl}
              alt="현재 메인"
              style={{
                maxWidth: "200px",
                display: "block",
                marginBottom: "10px",
              }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImg(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label>현재 서브 이미지</label>
          {existingSubImgs.length > 0 ? (
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "10px",
              }}
            >
              {existingSubImgs.map((img) => (
                <img
                  key={img.id}
                  src={img.imgUrl}
                  alt="현재 서브"
                  style={{ maxWidth: "120px" }}
                />
              ))}
            </div>
          ) : (
            <p>등록된 서브 이미지가 없습니다.</p>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setSubImgs(Array.from(e.target.files))}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            수정하기
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
