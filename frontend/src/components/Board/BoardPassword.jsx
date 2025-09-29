import React, { useState } from "react";
import "../reset.css";
import "./Board.css";
import api from "../../api/axiosConfig";

function BoardPassword({ post, onPasswordSuccess, onCancel }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return setError("비밀번호를 입력해주세요.");
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/api/board/${post.id}`, {
        params: { password },
      });
      onPasswordSuccess({ ...res.data, password }); // 상세/수정 재호출에 사용
    } catch (err) {
      if (err.response?.status === 403)
        setError("비밀번호가 일치하지 않습니다.");
      else if (err.response?.status === 404)
        setError("게시글을 찾을 수 없습니다.");
      else
        setError(
          err.response?.data?.message || err.message || "오류가 발생했습니다."
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="qaBoard">
      <div className="qaBoardTop">
        <h1
          style={{
            fontSize: 30,
            fontWeight: 600,
            marginLeft: "690px",
          }}
        >
          Q&A
        </h1>
      </div>

      <div className="passwordContainer">
        <div className="passwordBox">
          <h3
            style={{
              fontSize: 18,
              fontWeight: 500,
              marginBottom: 10,
              color: "#1a1a1a",
            }}
          >
            비공개 게시글
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "#666",
              marginBottom: 30,
              lineHeight: 1.5,
            }}
          >
            이 글은 비밀글입니다. 비밀번호를 입력하여 주세요.
          </p>

          <div>
            <div style={{ marginBottom: 20 }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "1px solid #d6d6d6",
                  borderRadius: 4,
                  fontSize: 14,
                  textAlign: "center",
                }}
                autoFocus
              />
            </div>

            {error && (
              <div
                style={{
                  color: "#dc3545",
                  fontSize: 13,
                  marginBottom: 20,
                  padding: 10,
                  background: "#f8d7da",
                  border: "1px solid #f5c6cb",
                  borderRadius: 4,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={handlePasswordSubmit}
                disabled={loading}
                className="qaBtn"
                style={{
                  background: "#1a1a1a",
                  border: `1px solid #1a1a1a`,
                  color: "#fff",
                }}
              >
                {loading ? "확인 중..." : "확인"}
              </button>
              <button
                onClick={onCancel}
                disabled={loading}
                className="qaBtn"
                style={{
                  background: "#fff",
                  border: "1px solid #1a1a1a",
                  color: "#1a1a1a",
                }}
              >
                취소
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: 30,
              fontSize: 12,
              color: "#999",
              lineHeight: 1.4,
            }}
          >
            💡 비밀번호는 게시글 작성 시 설정한 비밀번호입니다.
            <br />
            비밀번호를 잊으셨다면 관리자에게 문의해주세요.
          </div>
        </div>
      </div>
    </section>
  );
}

export default BoardPassword;
