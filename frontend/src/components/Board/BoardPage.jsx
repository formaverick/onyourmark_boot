import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BoardMain from "./BoardMain";
import BoardPassword from "./BoardPassword";
import BoardDetail from "./BoardDetail";
import BoardWriteUser from "./BoardWriteUser";
import BoardRepostWrite from "./BoardRepostWrite";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";

export default function BoardPage() {
  const { id } = useParams();
  const [mode, setMode] = useState("list");
  const [selectedPost, setSelectedPost] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const auth = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "board"; // 기본값은 Q&A 목록

  // 마이페이지 내 문의 내역
  useEffect(() => {
    if (id) {
      const post = { id: Number(id), isSecret: true };
      setSelectedPost(post);

      // 관리자가 아니고 비공개일때
      if (post.isSecret && auth.role !== "ADMIN") {
        setMode("password");
      } else {
        setMode("detail");
      }
    }
  }, [id]);

  const goList = () => {
    if (from === "myposts") {
      navigate("/posts/me"); // 내 문의 내역으로 이동
    } else {
      setMode("list"); // Q&A 목록 모드
      setSelectedPost(null);
      setReloadKey((n) => n + 1);
    }
  };

  const handlePostSelect = (post) => {
    setSelectedPost(post);
    if (post.isSecret && auth.role != "ADMIN") {
      setMode("password");
    } else {
      setMode("detail");
    }
  };

  const handlePasswordSuccess = (postWithData) => {
    setSelectedPost(postWithData);
    setMode("detail");
  };

  const handleWriteClick = () => {
    setSelectedPost(null);
    setMode("write");
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setMode("edit");
  };

  const handleRepostClick = (post, mode, repostData) => {
    setSelectedPost({ ...post, repostData });
    setMode(mode === "edit" ? "repostEdit" : "repostWrite");
  };

  const handleDeleteSuccess = () => goList();

  return (
    <>
      {mode === "list" && (
        <BoardMain
          key={reloadKey}
          onPostSelect={handlePostSelect}
          onWriteClick={handleWriteClick}
        />
      )}

      {mode === "password" && selectedPost && (
        <BoardPassword
          post={selectedPost}
          onPasswordSuccess={handlePasswordSuccess}
          onCancel={goList}
        />
      )}

      {mode === "detail" && selectedPost && (
        <BoardDetail
          post={selectedPost}
          onListClick={goList}
          onEditClick={handleEditClick}
          onDeleteSuccess={handleDeleteSuccess}
          onRepostClick={handleRepostClick}
        />
      )}

      {mode === "write" && (
        <BoardWriteUser
          mode="write"
          post={null}
          onSuccess={goList}
          onCancel={goList}
        />
      )}

      {mode === "edit" && selectedPost && (
        <BoardWriteUser
          mode="edit"
          post={selectedPost}
          onSuccess={goList}
          onCancel={() => setMode("detail")}
        />
      )}

      {mode === "repostWrite" && selectedPost && (
        <BoardRepostWrite
          mode="create"
          post={selectedPost}
          onSuccess={() => {
            setMode("detail");
            setReloadKey((n) => n + 1);
          }}
          onCancel={() => setMode("detail")}
        />
      )}

      {mode === "repostEdit" && selectedPost && (
        <BoardRepostWrite
          mode="edit"
          post={selectedPost}
          repost={selectedPost.repostData}
          onSuccess={() => {
            setMode("detail");
            setReloadKey((n) => n + 1);
          }}
          onCancel={() => setMode("detail")}
        />
      )}
    </>
  );
}
