import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import useAuth from "../../hooks/useAuth";
import "./Board.css";
import "../reset.css";

function BoardDetail({
  post,
  onListClick,
  onEditClick,
  onDeleteSuccess,
  onRepostClick,
}) {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = useAuth();
  const [repostData, setRepostData] = useState(null);

  // 게시글 상세 조회
  const fetchPostDetail = async (id, password = null) => {
    try {
      setLoading(true);
      const params = password ? { password } : {};
      const response = await api.get(`/api/board/${id}`, { params });
      const data = response.data;
      setPostData(data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("비밀번호가 일치하지 않습니다.");
      } else if (err.response?.status === 404) {
        setError("게시글을 찾을 수 없습니다.");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "게시글을 불러오는데 실패했습니다."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      let params = {};

      // 비회원 글이면 비번 먼저 입력
      if (post.writerType === "GUEST") {
        const input = window.prompt("삭제하려면 비밀번호를 입력하세요:");
        if (!input) return; // 취소 시 종료
        params = { password: input };
      }

      await api.delete(`/api/board/${post.id}`, { params });

      alert("게시글이 삭제되었습니다.");
      onDeleteSuccess();
    } catch (err) {
      alert(
        "삭제 중 오류가 발생했습니다: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // 수정 폼 진입
  const handleEdit = async () => {
    // GUEST 글은 폼 진입 전에 비번 확인
    if (post.writerType === "GUEST") {
      const input = window.prompt("수정을 위해 현재 비밀번호를 입력하세요:");
      if (!input) return;
      try {
        await api.get(`/api/board/${post.id}/edit`, {
          params: { password: input },
        });
        onEditClick({ ...post, password: input }); // 검증된 비번 전달
      } catch (e) {
        if (e.response?.status === 403) alert("비밀번호가 일치하지 않습니다.");
        else
          alert(
            e.response?.data?.message || e.message || "오류가 발생했습니다."
          );
      }
    } else {
      onEditClick(post);
    }
  };

  // 답변 조회
  const fetchRepost = async () => {
    try {
      const res = await api.get(`/api/reposts/${post.id}`);
      setRepostData(res.data);
    } catch (err) {
      setRepostData(null);
    }
  };

  useEffect(() => {
    if (post && post.id) {
      fetchPostDetail(post.id, post.password);
      fetchRepost();
    }
  }, [post]);

  const handleList = () => onListClick();

  const maskName = (name) => {
    if (!name || name.length <= 1) return name;
    return name[0] + "*".repeat(name.length - 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">오류: {error}</div>;
  if (!postData)
    return <div className="error">게시글 데이터를 찾을 수 없습니다.</div>;

  return (
    <section className="qaBoard">
      <div className="qaBoardTop">
        <h1>Q&A</h1>
      </div>

      <div className="boardDetailContainer">
        <div className="boardDetailHeader">
          <h2>
            {postData.title}
            {postData.isSecret && (
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 14,
                  color: "#666",
                  background: "#f8f9fa",
                  padding: "2px 8px",
                  borderRadius: 3,
                }}
              >
                🔒 비공개
              </span>
            )}
          </h2>

          <div className="boardDetailInfo">
            <div>
              <span>작성자: {maskName(postData.writerName)}</span>
              <span style={{ margin: "0 10px" }}>|</span>
              <span>작성일: {formatDate(postData.createdAt)}</span>
              {postData.updatedAt !== postData.createdAt && (
                <>
                  <span style={{ margin: "0 10px" }}>|</span>
                  <span>수정일: {formatDate(postData.updatedAt)}</span>
                </>
              )}
            </div>
            <div>
              <span>조회수: {postData.views || 0}</span>
            </div>
          </div>
        </div>

        <div className="boardDetailContent">
          <div
            style={{
              lineHeight: 1.8,
              fontSize: 14,
              color: "#333",
              whiteSpace: "pre-line",
            }}
          >
            {postData.content}
          </div>
        </div>

        <div className="boardDetailButtons">
          <button
            onClick={handleList}
            className="qaBtn"
            style={{
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6",
              color: "#495057",
            }}
          >
            목록으로
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleEdit}
              className="qaBtn"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #1a1a1a",
                color: "#fff",
              }}
            >
              수정
            </button>
            <button
              onClick={() => handleDelete()}
              className="qaBtn"
              style={{
                backgroundColor: "#fff",
                border: "1px solid #1a1a1a",
                color: "#1a1a1a",
              }}
            >
              삭제
            </button>
          </div>
        </div>

        <div className="boardReplySection">
          <h4
            style={{
              fontSize: 16,
              fontWeight: 500,
              marginBottom: 15,
              color: "#495057",
            }}
          >
            관리자 답변
          </h4>

          {repostData ? (
            <div
              style={{
                padding: "15px",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                backgroundColor: "#f8f9fa",
                marginBottom: "10px",
              }}
            >
              <div
                style={{ fontSize: 14, color: "#333", whiteSpace: "pre-line" }}
              >
                {repostData.content}
              </div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                작성일: {formatDate(repostData.createdAt)}
                {repostData.updatedAt !== repostData.createdAt && (
                  <> | 수정일: {formatDate(repostData.updatedAt)}</>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{ fontSize: 13, color: "#6c757d", fontStyle: "italic" }}
            >
              아직 답변이 등록되지 않았습니다.
            </div>
          )}

          {/* 관리자만 버튼 노출 */}
          {auth.role === "ADMIN" && (
            <button
              onClick={() =>
                onRepostClick(post, repostData ? "edit" : "create", repostData)
              }
              className="qaBtn"
              style={{
                marginTop: 10,
                backgroundColor: "#1a1a1a",
                border: "1px solid #1a1a1a",
                color: "#fff",
              }}
            >
              {repostData ? "답변 수정" : "답변 작성"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default BoardDetail;
