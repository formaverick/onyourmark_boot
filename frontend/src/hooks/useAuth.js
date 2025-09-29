import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const parseToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        token: null,
        memberId: null,
        userid: null,
        username: null,
        role: null,
      };
    }

    try {
      const decode = jwtDecode(token);

      if (decode?.exp && decode.exp * 1000 <= Date.now()) {
        localStorage.removeItem("token");
        return {
          token: null,
          memberId: null,
          userid: null,
          username: null,
          role: null,
        };
      }

      const memberId = decode?.memberId ?? null;
      const userid = decode?.sub ?? null;
      const username = decode?.username ?? null;
      const role = decode?.role ?? null;

      return { token, memberId, userid, username, role };
    } catch (e) {
      console.error("토큰 해독 실패 : ", e);
      localStorage.removeItem("token");
      return {
        token: null,
        memberId: null,
        userid: null,
        username: null,
        role: null,
      };
    }
  };

  const [auth, setAuth] = useState(parseToken());

  useEffect(() => {
    setAuth(parseToken());

    const onStorage = (e) => {
      if (e.key === "token") setAuth(parseToken());
    };

    const onAuthChanged = () => setAuth(parseToken());

    window.addEventListener("storage", onStorage);
    window.addEventListener("authChanged", onAuthChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", onAuthChanged);
    };
  }, []);

  return auth; // { token, userid, username, role }
}
