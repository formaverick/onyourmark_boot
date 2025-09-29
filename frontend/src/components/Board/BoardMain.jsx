import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import "../reset.css";
import "./Board.css";

function BoardMain({ onPostSelect, onWriteClick }) {
  const [boardList, setBoardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 게시글 목록 조회
  const fetchBoardList = async (page = 0) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/board?page=${page}&size=20&sort=createdAt,desc`
      );

      const data = response.data;
      setBoardList(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "게시글 목록을 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      fetchBoardList(page);
    }
  };

  // 게시글 클릭 처리
  const handlePostClick = (post) => {
    onPostSelect(post);
  };

  // 글쓰기 버튼 클릭 처리
  const handleWriteClick = () => {
    onWriteClick();
  };

  // 작성자명 마스킹
  const maskName = (name) => {
    if (!name || name.length <= 1) return name;
    return name[0] + "*".repeat(name.length - 1);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  useEffect(() => {
    fetchBoardList();
  }, []);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">오류: {error}</div>;

  return (
    <section className="qaBoard">
      <div className="qaBoardTop">
        <h1>Q&A</h1>
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleWriteClick();
            }}
            className="qaBtn"
          >
            WRITE
          </a>
        </div>
      </div>

      <div className="qaBoardBody">
        <table>
          <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "48%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>구분</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회</th>
              <th>답변상태</th>
            </tr>
          </thead>
          <tbody>
            {boardList.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "50px" }}
                >
                  등록된 게시글이 없습니다.
                </td>
              </tr>
            ) : (
              boardList.map((post, idx) => {
                const no = totalElements - currentPage * 20 - idx;
                return (
                  <tr
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{no}</td>
                    <td>
                      {post.isSecret ? (
                        <span title="비공개 글">🔒</span>
                      ) : (
                        <span title="공개 글">📄</span>
                      )}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {post.title}
                      {post.isSecret && (
                        <span style={{ color: "#999", fontSize: "12px" }}>
                          {" "}
                          [비공개]
                        </span>
                      )}
                    </td>
                    <td>{maskName(post.writerName)}</td>
                    <td>{formatDate(post.createdAt)}</td>
                    <td>{post.views || 0}</td>
                    <td>
                      <span
                        style={{
                          padding: "2px 8px",
                          fontSize: "11px",
                          borderRadius: "3px",
                          color: "#fff",
                          backgroundColor: "#a4a4a4",
                        }}
                      >
                        {post.hasRepost ? "완료" : "대기"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

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
      </div>
    </section>
  );
}

export default BoardMain;
