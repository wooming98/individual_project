import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/home/Home.jsx";
import { MemberLogin } from "./pages/member/MemberLogin.jsx";
import { BoardList } from "./pages/board/BoardList.jsx";
import { MemberSignup } from "./pages/member/MemberSignup.jsx";
import { LoginProvider } from "./components/LoginProvider.jsx";
import { BoardWrite } from "./pages/board/BoardWrite.jsx";
import { BoardView } from "./pages/board/BoardView.jsx";
import { BoardEdit } from "./pages/board/BoardEdit.jsx";
import axios from "axios";
import { MemberProfile } from "./pages/member/MemberProfile.jsx";
import { MemberPasswordChanges } from "./pages/member/MemberPasswordChanges.jsx";
// 폰트 적용
import "./styles/fonts/font.css";

// axios interceptor 설정
axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access");
  if (accessToken) {
    config.headers["access"] = accessToken; // 'Authorization' 대신 'access' 헤더에 토큰 추가
  }
  return config;
});

axios.interceptors.response.use(
  (response) => {
    // 요청이 성공적이면 그냥 response 반환
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // access token이 만료된 경우(401)
    if (error.response.status === 401 && !originalRequest._retry) {
      // 무한 반복 방지 (무한 루프에 빠지는 것을 방지함)
      originalRequest._retry = true;

      localStorage.removeItem("access");

      try {
        // 리프레시 토큰을 통해 새로운 access 토큰 발급 요청
        const res = await axios.post("/api/member/reissue");

        const access = res.headers["access"];

        if (access) {
          // 새로운 access token 저장
          localStorage.setItem("access", access);
          // 헤더에 새로운 access token 추가 후 재요청
          originalRequest.headers["access"] = `Bearer ${access}`;
          return axios(originalRequest);
        }
      } catch (tokenRefreshError) {
        console.error("리프레시 토큰 만료", tokenRefreshError);
      }
    }

    return Promise.reject(error);
  },
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Nav 와 Outlet 구성
    children: [
      {
        index: true,
        element: <BoardList />, // 메인 페이지
      },
      // 페이지
      { path: "login", element: <MemberLogin /> },
      { path: "signup", element: <MemberSignup /> },
      { path: "profile", element: <MemberProfile /> },
      { path: "password-changes", element: <MemberPasswordChanges /> },

      { path: "write", element: <BoardWrite /> },
      { path: "board/:id", element: <BoardView /> },
      { path: "board/edit/:id", element: <BoardEdit /> },
    ],
  },
]);

function App() {
  return (
    <LoginProvider>
      <RouterProvider router={router} />
    </LoginProvider>
  );
}

export default App;
