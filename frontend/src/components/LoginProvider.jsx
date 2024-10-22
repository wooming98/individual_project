import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => {
    const token = localStorage.getItem("access");
    return token ? token : null;
  });

  const [memberIndex, setMemberIndex] = useState("");
  const [nickname, setNickname] = useState("");

  // 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access", accessToken);
      login(accessToken);
    } else {
      localStorage.removeItem("access");
    }
  }, [accessToken]);

  const login = (token) => {
    const payload = jwtDecode(token);
    setMemberIndex(payload.memberIndex);
    setNickname(payload.nickname);
    setAccessToken(token);
  };

  const logout = async () => {
    try {
      const formData = new FormData();
      formData.append("memberIndex", memberIndex);
      const response = await axios.post("/api/member/logout", formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setAccessToken(null);
        setMemberIndex("");
      }
    } catch (error) {
      console.error("Logout failed : ", error);
    }
  };

  return (
    <LoginContext.Provider
      value={{
        memberIndex,
        nickname,
        accessToken,
        login,
        logout,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
