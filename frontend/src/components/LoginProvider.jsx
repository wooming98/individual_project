import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => {
    const token = localStorage.getItem("access");
    return token ? token : null;
  });

  const [memberIndex, setMemberIndex] = useState("");

  // 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access", accessToken);
    } else {
      localStorage.removeItem("access");
    }
  }, [accessToken]);

  const login = (token) => {
    const payload = jwtDecode(token);
    setMemberIndex(payload.memberIndex);
    setAccessToken(token);
  };

  const logout = () => {
    setAccessToken(null);
  };

  return (
    <LoginContext.Provider
      value={{
        memberIndex,
        accessToken,
        login,
        logout,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
