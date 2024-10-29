import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../components/LoginProvider.jsx";

export function MemberLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAndHide, setShowAndHide] = useState(false);

  const { login } = useContext(LoginContext);

  const navigate = useNavigate();
  const toast = useToast();

  async function handleLogin() {
    try {
      // JSON 형식의 데이터 객체 생성
      const data = {
        username: username,
        password: password,
      };

      // POST 요청을 JSON으로 전송
      const response = await axios.post("/api/member/login", data, {
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
      });

      if (response.status === 200) {
        const accessToken = response.headers["access"];
        login(accessToken);

        toast({
          status: "info",
          description: "로그인 되었습니다.",
          position: "bottom",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        status: "error",
        description: "이메일과 패스워드를 확인해주세요.",
        position: "bottom",
      });
    }
  }

  function handleSubmitKeyDown(e) {
    if (e.key === "Enter") {
      handleLogin();
    }
  }

  return (
    <Center>
      <Box w={500}>
        <Center mb={10}>
          <Heading variant={"large"}>로그인</Heading>
        </Center>
        <Box>
          <Box>
            <FormControl>
              <FormLabel>아이디</FormLabel>
              <Input
                h={12}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleSubmitKeyDown}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel mt={6}>비밀번호</FormLabel>
              <InputGroup>
                <Input
                  h={12}
                  type={showAndHide ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleSubmitKeyDown}
                />
                <InputRightElement
                  height="100%" // InputGroup의 높이에 맞게 설정
                  alignItems="center" // 수직 중앙 정렬
                  cursor="pointer"
                  onClick={() => setShowAndHide(!showAndHide)}
                >
                  <FontAwesomeIcon icon={showAndHide ? faEyeSlash : faEye} />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
          <Box mb={6} mt={6} style={{ textAlign: "right" }}>
            <Link
              to="/findPassword"
              style={{ textDecoration: "underline", color: "dodgerblue" }}
            >
              비밀번호 찾기
            </Link>
          </Box>
          <Box mb={6}>
            <Button h={12} w={500} onClick={handleLogin}>
              로그인
            </Button>
          </Box>
          <Center>
            아직 회원이 아니신가요? &nbsp;
            <Link
              to="/signup"
              style={{ textDecoration: "underline", color: "dodgerblue" }}
            >
              회원가입
            </Link>
          </Center>
        </Box>
      </Box>
    </Center>
  );
}
