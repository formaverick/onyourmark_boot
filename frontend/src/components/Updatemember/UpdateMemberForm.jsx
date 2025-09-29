import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../reset.css";
import "../Signup/SignupForm.css";
import "./UpdateMember.css";

const onlyDigits = (s) => s.replace(/\D/g, "");

export default function UpdateMemberForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userid: "",
    username: "",
    tel1: "010",
    tel2: "",
    tel3: "",
    email: "",
  });

  useEffect(() => {
    if (sessionStorage.getItem("pwd_ok") !== "1") {
      alert("비밀번호 확인 후 이용해 주세요.");
      navigate("/account/verify");
      return;
    }
    (async () => {
      try {
        const { data } = await api.get("/api/members/member");
        const phone = data.phone || "";
        setForm({
          userid: data.userid || "",
          username: data.username || "",
          tel1: phone.slice(0, 3) || "010",
          tel2: phone.slice(3, 7),
          tel3: phone.slice(7, 11),
          email: data.email || "",
        });
      } catch {
        alert("회원 정보를 불러오지 못했습니다.");
        navigate("/mypage");
      }
    })();
  }, [navigate]);

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
    const phone = `${form.tel1}${onlyDigits(form.tel2)}${onlyDigits(
      form.tel3
    )}`;
    try {
      await api.put("/api/members/update", {
        phone,
        email: form.email.trim().toLowerCase(),
      });
      alert("회원 정보가 수정되었습니다.");
      sessionStorage.removeItem("pwd_ok");
      navigate("/mypage");
    } catch (err) {
      alert(err?.response?.data || "수정에 실패했습니다.");
    }
  };

  return (
    <div className="signupBox">
      <div className="signupCategory">
        <ul>
          <li>
            <Link to="/">홈 /</Link>
          </li>
          <li>회원 정보 수정</li>
        </ul>
      </div>

      <div className="signupTitle">회원 정보 수정</div>

      <form className="signupForm" onSubmit={onSubmit}>
        {/* 아이디 (readonly) */}
        <div className="row">
          <div className="label">아이디</div>
          <div className="control">
            <label className="field readonly">
              <input type="text" name="userid" value={form.userid} readOnly />
            </label>
          </div>
        </div>

        {/* 이름 (readonly) */}
        <div className="row">
          <div className="label">이름</div>
          <div className="control">
            <label className="field readonly">
              <input
                type="text"
                name="username"
                value={form.username}
                readOnly
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
                inputMode="numeric"
                pattern="\d*"
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
                inputMode="numeric"
                pattern="\d*"
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

        <div className="actions">
          <Link to="/mypage" className="btnLine">
            취소
          </Link>
          <button type="submit" className="submitBtn">
            회원정보수정
          </button>
        </div>
      </form>
    </div>
  );
}
