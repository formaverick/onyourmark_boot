import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import useAuth from "../../hooks/useAuth";
import "./Notice.css";

export default function NoticeMain() {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();
  const { role } = useAuth();

  const fetchNotices = async (p = 0) => {
    const res = await api.get(`/api/notices?page=${p}`);
    setNotices(res.data.content || []);
    setTotalPages(res.data.totalPages);
    setPage(p);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePageChange = (p) => {
    if (p >= 0 && p < totalPages) {
      fetchNotices(p);
    }
  };

  return (
    <section className="notice-main">
      <div className="notice-detail-top">
        <div className="notice-header">
          <h1 className="notice-title">Launching Calendar</h1>
          <p className="notice-sub">신제품을 미리 만나보세요.</p>
          <div className="notice-detail-bottom">
            {role === "ADMIN" && (
              <button
                className="notice-create-btn"
                onClick={() => navigate("/notice/create")}
              >
                등록하기
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="notice-grid">
        {notices.map((n) => (
          <div
            key={n.id}
            className="notice-card"
            onClick={() => navigate(`/notice/${n.id}`)}
          >
            <div className="notice-main-img">
              <img src={n.mainImgUrl} alt={n.title} />
            </div>
            <div className="notice-card-text">
              <h3>{n.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {/* 이전 버튼 */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="paBtn"
          >
            &lt;
          </button>

          {(() => {
            const pages = [];
            const blockSize = 10;
            const currentBlock = Math.floor(page / blockSize);
            const start = currentBlock * blockSize;
            const end = Math.min(start + blockSize, totalPages);

            for (let i = start; i < end; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className="paBtn"
                  style={{
                    fontWeight: page === i ? "bold" : "normal",
                    border: page === i ? "1px solid #1a1a1a" : "1px solid #ccc",
                    backgroundColor: page === i ? "#fff" : "#f9f9f9",
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
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
            className="paBtn"
          >
            &gt;
          </button>
        </div>
      )}
    </section>
  );
}
