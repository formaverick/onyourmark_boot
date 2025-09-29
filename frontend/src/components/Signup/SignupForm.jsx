import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../reset.css";
import "./SignupForm.css";

const onlyDigits = (s) => s.replace(/\D/g, "");

const SignupForm = () => {
  const [form, setForm] = useState({
    userid: "",
    password: "",
    password2: "",
    username: "",
    tel1: "010",
    tel2: "",
    tel3: "",
    email: "",
  });
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "tel2" || name === "tel3") {
      setForm((p) => ({ ...p, [name]: onlyDigits(value).slice(0, 4) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 확인
    if (form.password !== form.password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 휴대전화 합치기
    const phone = `${form.tel1}${onlyDigits(form.tel2)}${onlyDigits(
      form.tel3
    )}`;

    try {
      await api.post("/api/auth/signup", {
        userid: form.userid.trim().toLowerCase(),
        password: form.password,
        username: form.username.trim(),
        phone,
        email: form.email.trim().toLowerCase(),
      });

      const info = {
        userid: form.userid.trim().toLowerCase(),
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
      };

      navigate("/signup/complete", { state: info });
    } catch (err) {
      const msg = err?.response?.data || err?.message || "회원가입 실패";
      alert(msg);
    }
  };

  return (
    <div className="signupBox">
      <div className="signupCategory">
        <ul>
          <li>
            <Link to="/">홈 /</Link>
          </li>
          <li>회원가입</li>
        </ul>
      </div>

      <div className="signupTitle">회원 가입</div>

      <form className="signupForm" onSubmit={onSubmit}>
        {/* 아이디 */}
        <div className="row">
          <div className="label">아이디</div>
          <div className="control">
            <label className="field">
              <input
                type="text"
                name="userid"
                value={form.userid}
                onChange={onChange}
                placeholder="영문/숫자, 4~16자"
                required
              />
            </label>
            <p className="help">(영문소문자/숫자, 4~16자)</p>
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="row">
          <div className="label">비밀번호</div>
          <div className="control">
            <label className="field">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </label>
            <p className="help">
              (영문 대/소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자)
            </p>
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="row">
          <div className="label">비밀번호 확인</div>
          <div className="control">
            <label className="field">
              <input
                type="password"
                name="password2"
                value={form.password2}
                onChange={onChange}
                placeholder="비밀번호 재입력"
                required
              />
            </label>
          </div>
        </div>

        {/* 이름 */}
        <div className="row">
          <div className="label">이름</div>
          <div className="control">
            <label className="field">
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="이름을 입력하세요"
                required
              />
            </label>
          </div>
        </div>

        {/* 휴대전화 */}
        <div className="row">
          <div className="label">휴대전화</div>
          <div className="control">
            <div className="phoneGroup">
              <select
                name="tel1"
                value={form.tel1}
                onChange={onChange}
                className="phoneSel"
              >
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span className="dash">-</span>
              <input
                className="phoneInput"
                name="tel2"
                value={form.tel2}
                onChange={onChange}
                placeholder="1234"
                maxLength={4}
                required
              />
              <span className="dash">-</span>
              <input
                className="phoneInput"
                name="tel3"
                value={form.tel3}
                onChange={onChange}
                placeholder="5678"
                maxLength={4}
                required
              />
            </div>
          </div>
        </div>

        {/* 이메일 */}
        <div className="row">
          <div className="label">이메일</div>
          <div className="control">
            <label className="field">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="example@email.com"
                required
              />
            </label>
          </div>
        </div>

        {/* 버튼 */}
        <div className="actions">
          <Link to="/" className="btnLine">
            취소
          </Link>
          <button className="submitBtn" type="submit">
            가입하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
