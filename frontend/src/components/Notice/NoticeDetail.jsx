import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import useAuth from "../../hooks/useAuth";
import "./Notice.css";

export default function NoticeDetail() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();
  const { role } = useAuth();

  const fetchNotice = async () => {
    const res = await api.get(`/api/notices/${id}`);
    setNotice(res.data);
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 공지를 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/notices/${id}`);
      alert("삭제되었습니다.");
      navigate("/notice"); // 목록 페이지로 이동
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchNotice();
  }, [id]);

  if (!notice) return <div>로딩 중...</div>;

  return (
    <section className="notice-detail">
      <div className="notice-detail-top">
        <div className="notice-header">
          <button
            className="back-button"
            onClick={() => navigate(`/notice`)} // 이전 페이지로 이동
          >
            &lt;
          </button>
          <div className="title-box">
            <h1 className="notice-title">Launching Calendar</h1>
            <p className="notice-sub">신제품을 미리 만나보세요.</p>
          </div>
        </div>
      </div>

      <div className="notice-detail-title-box">
        <h1 className="notice-detail-title">{notice.title}</h1>
        <p className="notice-date">
          {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
        </p>
      </div>

      {/* 메인 이미지 */}
      {notice.images
        .filter((img) => img.type === "MAIN")
        .map((img) => (
          <img key={img.id} src={img.imgUrl} alt={notice.title} />
        ))}

      {/* 본문 */}
      <div className="notice-content">{notice.content}</div>

      {/* 서브 이미지 */}
      {notice.images
        .filter((img) => img.type === "SUB")
        .map((img) => (
          <img key={img.id} src={img.imgUrl} alt={notice.title} />
        ))}

      <div className="notice-detail-bottom">
        <div className="action-buttons">
          <button
            className="back-button-bottom"
            onClick={() => navigate(`/notice`)}
          >
            목록
          </button>

          {role === "ADMIN" && (
            <>
              <button
                className="edit-button"
                onClick={() => navigate(`/notice/update/${id}`)}
              >
                수정
              </button>
              <button className="delete-button" onClick={handleDelete}>
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
