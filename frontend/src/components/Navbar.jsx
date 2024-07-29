import { useNavigate } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";

export function Navbar() {
  const navigate = useNavigate();

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
    </Flex>
  );
}
