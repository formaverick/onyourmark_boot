import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./SignupComplete.css";

export default function SignupComplete() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const info = useMemo(() => {
    if (state?.userid) return state;
    try {
      const cached = JSON.parse(localStorage.getItem("signupInfo") || "{}");
      return cached.userid ? cached : null;
    } catch {
      return null;
    }
  }, [state]);

  useEffect(() => {
    if (!info) navigate("/");
  }, [info, navigate]);

  if (!info) return null;

  return (
    <div className="complete-wrap">
      <h2 className="title">회원 가입 완료</h2>

      <section className="card">
        <div className="avatar">
          <img src="..\img\main_page\icon\person.png"></img>
        </div>
        <h2 className="headline">회원가입이 완료되었습니다.</h2>
        <p className="sub">{info.username} 님, 환영합니다!</p>

        <dl className="list">
          <div>
            <dt>아이디</dt>
            <dd>{info.userid}</dd>
          </div>
          <div>
            <dt>이름</dt>
            <dd>{info.username}</dd>
          </div>
          <div>
            <dt>이메일</dt>
            <dd>{info.email}</dd>
          </div>
        </dl>

        <div className="btnRow">
          <Link to="/login" className="primary-btn">
            로그인하러 가기
          </Link>
          <Link to="/" className="secondary-btn">
            메인으로 가기
          </Link>
        </div>
      </section>
    </div>
  );
}
