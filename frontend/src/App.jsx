import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/home/Home.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { MemberLogin } from "./pages/member/MemberLogin.jsx";
import { BoardList } from "./pages/board/BoardList.jsx";
import { MemberSignup } from "./pages/member/MemberSignup.jsx";

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
    ],
  },
]);

function App() {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
