import React, { useState } from "react";
import api from "../../api/axiosConfig";
import "../reset.css";
import "./Board.css";

export default function BoardRepostWrite({
  mode,
  post,
  repost,
  onSuccess,
  onCancel,
}) {
  const [content, setContent] = useState(repost?.content || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("답변 내용을 입력하세요.");
      return;
    }
    try {
      setLoading(true);
      if (mode === "create") {
        await api.post(`/api/reposts/${post.id}`, { content });
        alert("답변이 등록되었습니다.");
      } else {
        await api.put(`/api/reposts/${post.id}`, { content });
        alert("답변이 수정되었습니다.");
      }
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="qaBoard">
      <div className="qaBoardTop">
        <h1>관리자 답변 {mode === "create" ? "작성" : "수정"}</h1>
      </div>

      <div className="writeContainer">
        <textarea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          style={{ width: "100%", padding: 10 }}
        />
        <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
          <button onClick={handleSubmit} disabled={loading} className="qaBtn">
            {loading ? "저장 중..." : "저장"}
          </button>
          <button onClick={onCancel} disabled={loading} className="qaBtn">
            취소
          </button>
        </div>
      </div>
    </section>
  );
}
