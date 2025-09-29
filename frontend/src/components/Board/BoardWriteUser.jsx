import React, { useState, useEffect } from "react";
import "../reset.css";
import "./Board.css";
import api from "../../api/axiosConfig";
import useAuth from "../../hooks/useAuth";

function BoardWriteUser({ mode, post, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    writerName: "",
    isSecret: false,
  });

  const auth = useAuth();

  // 작성용 비밀번호
  const [createPassword, setCreatePassword] = useState("");

  // 수정용: 현재 비번 검증 + 새 비번
  const [verifyPassword, setVerifyPassword] = useState("");
  const [newPostPassword, setNewPostPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = mode === "edit";

  // 폼 초기화
  useEffect(() => {
    if (isEditMode && post) {
      setFormData({
        title: post.title || "",
        content: post.content || "",
        writerName: "",
        isSecret: !!post.isSecret,
      });
      setVerifyPassword("");
      setNewPostPassword("");
    } else {
      setFormData({
        title: "",
        content: "",
        writerName: "",
        isSecret: false,
      });
      setCreatePassword("");
    }
  }, [isEditMode, post]);

  // 입력 변경
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 유효성 검사
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("제목을 입력해주세요.");
      return false;
    }
    if (!formData.content.trim()) {
      setError("내용을 입력해주세요.");
      return false;
    }

    if (!isEditMode) {
      if (!auth.userid) {
        if (!formData.writerName.trim()) {
          setError("작성자명을 입력해주세요.");
          return false;
        }
      }
      if (!createPassword.trim()) {
        setError("게시글 비밀번호를 입력해주세요.");
        return false;
      }
    } else {
      // 수정 모드: 현재 비밀번호 필수
      if (!verifyPassword.trim()) {
        setError("수정을 위해 현재 비밀번호를 입력해주세요.");
        return false;
      }
    }
    return true;
  };

  // 작성
  const createPost = async () => {
    try {
      const body = {
        title: formData.title,
        content: formData.content,
        writerName: formData.writerName, // 항상 전송
        postPassword: createPassword,
        isSecret: formData.isSecret,
      };
      const res = await api.post("/api/board/new", body);
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "게시글 작성 중 오류가 발생했습니다."
      );
    }
  };

  // 수정
  const updatePost = async () => {
    try {
      const params = { password: verifyPassword }; // 검증 비번
      const body = {
        title: formData.title,
        content: formData.content,
        isSecret: formData.isSecret,
      };
      if (newPostPassword) body.postPassword = newPostPassword; // 새 비번 선택 입력 시
      const res = await api.patch(`/api/board/${post.id}`, body, { params });
      return res.data;
    } catch (err) {
      if (err.response?.status === 403) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "게시글 수정 중 오류가 발생했습니다."
      );
    }
  };

  // 저장
  const handleSubmit = async () => {
    setError("");
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (isEditMode) {
        await updatePost();
        alert("게시글이 수정되었습니다.");
      } else {
        await createPost();
        alert("게시글이 작성되었습니다.");
      }
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 취소
  const handleCancel = () => {
    if (
      window.confirm(
        isEditMode ? "수정을 취소하시겠습니까?" : "작성을 취소하시겠습니까?"
      )
    ) {
      onCancel();
    }
  };

  return (
    <section className="qaBoard">
      <div className="qaBoardTop">
        <h1>Q&A</h1>
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleCancel();
            }}
            className="qaBtn"
          >
            LIST
          </a>
        </div>
      </div>

      <div
        className="writeContainer"
        style={{ padding: "20px 0", borderTop: "1px solid #ddd" }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 500,
            marginBottom: 30,
            color: "#1a1a1a",
          }}
        >
          {isEditMode ? "게시글 수정" : "게시글 작성"}
        </h3>

        {error && (
          <div
            style={{
              color: "#dc3545",
              fontSize: 13,
              marginBottom: 20,
              padding: 15,
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: 4,
            }}
          >
            {error}
          </div>
        )}

        <div className="writeForm">
          {/* 제목 */}
          <div style={{ marginBottom: 15 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "#333",
              }}
            >
              제목 <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="제목을 입력하세요"
              disabled={loading}
            />
          </div>

          {/* 작성자 (작성 모드에서만 + 비회원만) */}
          {!isEditMode && !auth.userid && (
            <div style={{ marginBottom: 15 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#333",
                }}
              >
                작성자 <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="text"
                name="writerName"
                value={formData.writerName}
                onChange={handleInputChange}
                placeholder="작성자명을 입력하세요"
                disabled={loading}
              />
            </div>
          )}

          {/* 비밀번호 (작성 모드) */}
          {!isEditMode && (
            <div style={{ marginBottom: 15 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#333",
                }}
              >
                게시글 비밀번호 <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                placeholder="게시글 비밀번호를 입력하세요"
                disabled={loading}
              />
              <div style={{ fontSize: 12, color: "#666", marginTop: 5 }}>
                게시글 조회/수정/삭제 시 사용됩니다.
              </div>
            </div>
          )}

          {/* 수정 모드: 현재 비번 + (선택) 새 비번 */}
          {isEditMode && (
            <>
              <div style={{ marginBottom: 15 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#333",
                  }}
                >
                  현재 비밀번호 <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  type="password"
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)}
                  placeholder="수정을 위해 현재 비밀번호를 입력하세요"
                  disabled={loading}
                />
              </div>
              <div style={{ marginBottom: 15 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#333",
                  }}
                >
                  새 비밀번호 (선택)
                </label>
                <input
                  type="password"
                  value={newPostPassword}
                  onChange={(e) => setNewPostPassword(e.target.value)}
                  placeholder="비밀번호를 변경하려면 입력하세요"
                  disabled={loading}
                />
                <div style={{ fontSize: 12, color: "#666", marginTop: 5 }}>
                  비밀번호를 바꾸지 않으려면 비워두세요.
                </div>
              </div>
            </>
          )}

          {/* 비공개 설정 */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 14,
                color: "#333",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="isSecret"
                checked={formData.isSecret}
                onChange={handleInputChange}
                disabled={loading}
                style={{ marginRight: 8 }}
              />
              <span>비공개 게시글로 설정</span>
            </label>
            <div
              style={{
                fontSize: 12,
                color: "#666",
                marginTop: 5,
                marginLeft: 24,
              }}
            >
              비공개로 설정하면 비밀번호를 입력해야만 게시글을 볼 수 있습니다.
            </div>
          </div>

          {/* 내용 */}
          <div style={{ marginBottom: 30 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "#333",
              }}
            >
              내용 <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="문의 내용을 입력하세요"
              disabled={loading}
              rows={12}
            />
          </div>

          {/* 버튼 */}
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              paddingTop: 20,
              borderTop: "1px solid #e5e5e5",
            }}
          >
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="qaBtn"
              style={{
                backgroundColor: "#fff",
                border: `1px solid #1a1a1a`,
                color: "#1a1a1a",
                width: 120,
              }}
            >
              {loading
                ? isEditMode
                  ? "수정 중..."
                  : "작성 중..."
                : isEditMode
                ? "수정하기"
                : "작성하기"}
            </button>

            <button
              onClick={handleCancel}
              disabled={loading}
              className="qaBtn"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #1a1a1a",
                color: "#fff",
                width: 120,
              }}
            >
              취소
            </button>
          </div>
        </div>

        {/* 안내 */}
        <div
          style={{
            marginTop: 40,
            padding: 20,
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: 4,
          }}
        >
          <h4
            style={{
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 10,
              color: "#495057",
            }}
          >
            📋 작성 시 유의사항
          </h4>
          <ul
            style={{
              fontSize: 12,
              color: "#6c757d",
              lineHeight: 1.6,
              paddingLeft: 20,
              margin: 0,
            }}
          >
            <li>
              게시글 작성 후 수정/삭제를 위해서는 설정한 비밀번호가 필요합니다.
            </li>
            <li>비공개 게시글은 비밀번호를 입력해야만 조회할 수 있습니다.</li>
            <li>문의사항은 영업일 기준 1-2일 내 답변드립니다.</li>
            <li>욕설, 비방, 광고성 내용은 관리자에 의해 삭제될 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default BoardWriteUser;
