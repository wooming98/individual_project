import { useNavigate } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex
      px={{
        lg: 200,
        base: 0,
      }}
      height={20}
      bgColor="gray.100"
      align="center"
      width="100%"
      justify="space-between" // 버튼들을 양쪽 끝으로 배치
    >
      <Button
        onClick={() => navigate("/")}
        cursor={"pointer"}
        p={6}
        fontSize={20}
        fontWeight={600}
      >
        Home
      </Button>
      {account.accessToken === null ? (
        <Button
          onClick={() => navigate("/login")}
          cursor={"pointer"}
          p={6}
          fontSize={14}
          fontWeight={600}
          border="2px solid"
          borderColor="gray.300"
        >
          로그인/회원가입
        </Button>
      ) : (
        <Button
          onClick={() => {
            account.logout();
            navigate("/");
          }}
          cursor={"pointer"}
          p={6}
          fontSize={14}
          fontWeight={600}
          border="2px solid"
          borderColor="gray.300"
        >
          로그아웃
        </Button>
      )}
      {account.accessToken && (
        <Button
          onClick={() => {
            navigate("/profile");
          }}
        >
          프로필
        </Button>
      )}
    </Flex>
  );
}
