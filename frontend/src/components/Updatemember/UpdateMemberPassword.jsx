import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axiosConfig";
import "../reset.css";
import "../Signup/SignupForm.css";
import "./UpdateMember.css";

export default function UpdateMemberPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");
  const payload = token ? jwtDecode(token) : {};
  const userid = payload?.sub || "";
  const username = payload?.username || "";

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/members/verify", { password });
      sessionStorage.setItem("pwd_ok", "1");
      navigate("/account/edit");
    } catch (err) {
      alert(err?.response?.data || "비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="signupBox">
      <div className="signupTitle">회원 정보 수정</div>

      <form className="signupForm verifyForm" onSubmit={onSubmit}>
        <div className="intro">
          <h4 style={{ margin: "0 0 10px" }}>비밀번호 확인</h4>
          <p>
            <b>{userid || username}</b> 님의 회원정보를 안전하게 보호하기 위해
            <br /> 비밀번호를 한 번 더 확인해 주세요.
          </p>
        </div>

        <div
          className="row"
          style={{ borderTop: "0", justifyContent: "center" }}
        >
          <div
            className="control"
            style={{ textAlign: "center", marginLeft: "208px" }}
          >
            <label className="field sm">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="현재 비밀번호"
                required
              />
            </label>
          </div>
        </div>

        <div className="actions single">
          <button type="submit" className="submitBtn sm">
            확인
          </button>
        </div>
      </form>
    </div>
  );
}
