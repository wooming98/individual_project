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
  Link,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showAndHide, setShowAndHide] = useState(false);

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
              <Input h={12} onChange={(e) => setId(e.target.value)} />
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
            <Button h={12} w={500}>
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
