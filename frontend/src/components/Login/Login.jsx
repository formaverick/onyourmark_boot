import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axiosConfig";
import "../reset.css";
import "./Login.css";

const Login = () => {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fromLocation = location.state?.from;
  const from =
    (fromLocation &&
      `${fromLocation.pathname || ""}${fromLocation.search || ""}${
        fromLocation.hash || ""
      }`) ||
    "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    const cleanUserid = userid.trim().toLowerCase();

    try {
      const res = await api.post("/api/auth/login", {
        userid: cleanUserid,
        password,
      });

      const token = res.data.token;
      if (!token) throw new Error("토큰이 없습니다.");

      localStorage.setItem("token", token);
      const payload = jwtDecode(token);

      localStorage.setItem("userid", payload.sub);
      localStorage.setItem("username", payload.username ?? payload.sub);

      window.dispatchEvent(new Event("authChanged"));

      alert("로그인 성공");
      const destination = from === "/login" ? "/" : from;
      navigate(destination, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data ||
        err?.message ||
        "로그인 실패. 아이디/비밀번호를 확인해주세요.";
      alert(msg);
    }
  };

  return (
    <div className="loginBox">
      <div className="loginCategory">
        <ul>
          <li>
            <Link to="/">홈 /</Link>
          </li>
          <li>로그인</li>
        </ul>
      </div>
      <div className="loginTitle">로그인</div>
      <form className="loginInput" onSubmit={onSubmit}>
        <label className="loginInputMain">
          <input
            type="text"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            placeholder="아이디를 입력하세요"
            autoComplete="username"
            required
          />
        </label>

        <label className="loginInputMain">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            required
          />
        </label>

        <div className="loginCheck">
          <input
            id="secure"
            type="checkbox"
            checked={secure}
            onChange={(e) => setSecure(e.target.checked)}
          />
          <label htmlFor="secure">보안접속</label>
        </div>

        <button className="loginSubmit" type="submit">
          로그인
        </button>

        <div className="loginSelect">
          <ul>
            <li>
              <Link to="/find-id">아이디 찾기</Link>
            </li>
            <li>|</li>
            <li>
              <Link to="/find-password">비밀번호 찾기</Link>
            </li>
          </ul>
        </div>
      </form>
      <div className="loginUtil">
        <p>아직 회원이 아니신가요?</p>
        <p>
          지금 회원가입을 하시면 <br></br> 다양하고 특별한 혜택이 준비되어
          있습니다.
        </p>
        <Link className="signupBtn" to="/signup">
          회원가입
        </Link>
      </div>
      <div className="loginSns">
        <div className="logTitle">SNS 로그인</div>
        <div className="snsBox">
          <a href="#">
            <img
              src="/img/main_page/icon/icon_sns_kakao.svg"
              alt="카카오"
            ></img>
            카카오 로그인
          </a>
          <a href="#">
            <img
              src="/img/main_page/icon/icon_sns_naver.svg"
              alt="네이버"
            ></img>
            네이버 로그인
          </a>
          <a href="#">
            <img
              src="/img/main_page/icon/icon_sns_facebook.svg"
              alt="페이스북"
            ></img>
            페이스북 로그인
          </a>
          <a href="#">
            <img src="/img/main_page/icon/icon_sns_google.svg" alt="구글"></img>
            구글 로그인
          </a>
        </div>
      </div>
      <div className="noLogin">
        <div className="logTitle">비회원 주문조회</div>
        <p>비회원의 경우, 주문시의 주문번호로 주문조회가 가능합니다.</p>
        <div className="loginInputMain">주문자명</div>
        <div className="loginInputMain">주문번호(하이픈(-) 포함)</div>
        <div className="loginInputMain">비회원주문 비밀번호</div>

        <div className="loginSubmit margin">확인</div>
      </div>
    </div>
  );
};

export default Login;
