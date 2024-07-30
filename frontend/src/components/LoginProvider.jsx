import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [memberIndex, setMemberIndex] = useState("");
  const [id, setId] = useState("");
  const [expired, setExpired] = useState(0);
  const [authType, setAuthType] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      return;
    }
    login(token);
  }, []);

  // 로그인
  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    setExpired(payload.exp);
    setMemberIndex(payload.sub);
    setId(payload.id);
    setAuthType(payload.scope.split(" "));
  }

  // 로그아웃
  function logout() {
    localStorage.removeItem("token");
    setExpired(0);
    setMemberIndex("");
    setId("");
    setAuthType([]);
  }

  // 로그인 되어있는지
  function isLoggedIn() {
    return Date.now() < expired * 1000;
  }

  return (
    <LoginContext.Provider
      value={{
        memberIndex: memberIndex,
        id: id,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
