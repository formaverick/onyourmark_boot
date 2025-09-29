import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Date.now() / 1000;
        if (payload.exp < now) {
          localStorage.removeItem("token");
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/login";
          break;
        case 403:
          alert("이 작업을 할 권한이 없습니다.");
          break;
        default:
          console.error("API 에러:", error);
      }
    } else if (error.message.includes("로그인")) {
      alert(error.message);
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
