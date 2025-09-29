import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "../Board/Board.css";

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyPosts = async () => {
    try {
      const res = await api.get(
        "/api/board/me?page=0&size=20&sort=createdAt,desc"
      );
      setPosts(res.data.content || []);
    } catch (err) {
      alert("내 글을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <section className="qaBoard">
      <div className="qaBoardTop">
        <h1>내 문의 내역</h1>
      </div>

      <div className="qaBoardBody">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성일</th>
              <th>답변상태</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "30px" }}
                >
                  문의 내역이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post, idx) => (
                <tr
                  key={post.id}
                  onClick={() =>
                    navigate(`/board/${post.id}`, {
                      state: { from: "myposts", post },
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td>{posts.length - idx}</td>
                  <td>{post.title}</td>
                  <td className="date-cell">
                    {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td>{post.hasRepost ? "완료" : "대기"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
