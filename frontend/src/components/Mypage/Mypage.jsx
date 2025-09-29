import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { jwtDecode } from "jwt-decode";
import "./MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = token ? jwtDecode(token).username : null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.dispatchEvent(new Event("authChanged"));
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  // const money = (n) => n.toLocaleString();

  return (
    <div className="mypage-wrap">
      <h1 className="mypage-title">마이 쇼핑</h1>

      {/* 상단: 인사 + 요약(빅 카드) */}
      <section className="hello-cards big">
        <div className="hello">
          <div className="avatar">
            <img src="/img/main_page/icon/person.png" alt="프로필" />
          </div>
          <div className="hello-right">
            <p className="hello-line">
              안녕하세요, <b>{username} 님!</b>
            </p>
            <p className="hello-sub">
              고객님의 회원등급은 <b>일반회원</b> 입니다.
            </p>
          </div>
        </div>

        <div className="stat">
          <span className="stat-ico ic-point" />
          <p className="stat-num">3,000원</p>
          <p className="stat-label">적립금</p>
        </div>

        <div className="stat">
          <span className="stat-ico ic-coupon" />
          <p className="stat-num">1 개</p>
          <p className="stat-label">쿠폰</p>
        </div>

        <div className="stat">
          <span className="stat-ico ic-total" />
          <p className="stat-num">0 원</p>
          <p className="stat-label">총주문</p>
        </div>
      </section>

      <div className="mypage-body">
        {/* 좌측 메뉴 */}
        <aside className="mypage-side">
          <nav>
            <h3 className="mypage-side-title">나의 쇼핑 정보</h3>
            <ul>
              <li>
                <Link to="/cart">주문내역 조회</Link>
              </li>
            </ul>

            <h3 className="mypage-side-title">활동 정보</h3>
            <ul>
              <li>
                <Link to="/wish">나의 위시리스트</Link>
              </li>
              <li>
                <Link to="/posts/me">문의 내역</Link>
              </li>
            </ul>

            <h3 className="mypage-side-title">나의 정보</h3>
            <ul>
              <li>
                <Link to="/account/verify">회원 정보 수정</Link>
              </li>
              <li>
                <button className="link-btn" onClick={handleLogout}>
                  로그아웃
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* 우측: 주문 처리 현황 + 주문내역 요약 */}
        <main className="mypage-main">
          {/* 주문 처리 현황 */}
          <section className="order-steps">
            <h3>
              나의 주문처리 현황{" "}
              <span className="muted">(최근 3개월 기준)</span>
            </h3>
            <div className="steps-row">
              <div className="step">
                <p className="step-num">0</p>
                <p className="step-label">입금전</p>
              </div>
              <div className="arrow">›</div>
              <div className="step">
                <p className="step-num">0</p>
                <p className="step-label">배송준비중</p>
              </div>
              <div className="arrow">›</div>
              <div className="step">
                <p className="step-num">0</p>
                <p className="step-label">배송중</p>
              </div>
              <div className="arrow">›</div>
              <div className="step">
                <p className="step-num">0</p>
                <p className="step-label">배송완료</p>
              </div>
            </div>

            <div className="after-row">
              <div className="after">
                <span>취소 : </span>
                <b>0</b>
              </div>
              <div className="after">
                <span>교환 : </span>
                <b>0</b>
              </div>
              <div className="after">
                <span>반품 : </span>
                <b>0</b>
              </div>
            </div>
          </section>

          {/* 주문내역 요약 리스트 */}
          <section className="orders-section">
            <h3>주문내역 조회</h3>
            <div className="empty">
              <div className="empty-ico">!</div>
              <p>주문 내역이 없습니다.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
