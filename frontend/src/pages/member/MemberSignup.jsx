import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  function handleClick() {
    axios
      .post("/api/member/signup", { id, password, email, nickName })
      .then(() => {
        toast({
          status: "success",
          description: "회원 가입이 완료되었습니다.",
          position: "bottom",
        });
        navigate("/login");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: "입력값을 확인해 주세요.",
            position: "bottom",
          });
        } else {
          toast({
            status: "error",
            description: "회원 가입 중 문제가 발생하였습니다.",
            position: "bottom",
          });
        }
      });
  }

  // 조건에 맞지 않을 시 회원가입 버튼 비활성화
  let isDisabled = false;

  // 비밀번호가 같은지
  const isCheckedPassword = password === passwordCheck;
  if (!isCheckedPassword) {
    isDisabled = true;
  }

  // 하나라도 공백이면 버튼 비활성화
  if (
    !(
      id.trim().length > 0 &&
      password.trim().length > 0 &&
      email.trim().length > 0 &&
      nickName.trim().length > 0
    )
  ) {
    isDisabled = true;
  }

  return (
    <Center>
      <Box w={500}>
        <Center mb={10}>
          <Heading variant={"large"}>회원가입</Heading>
        </Center>
        <Box mb={7}>
          <FormControl>
            <FormLabel>아이디</FormLabel>
            <Input h={12} onChange={(e) => setId(e.target.value)} />
          </FormControl>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>비밀번호</FormLabel>
            <Input
              h={12}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>비밀번호 확인</FormLabel>
            <Input
              h={12}
              type="password"
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
            {isCheckedPassword || (
              <FormHelperText>암호가 일치하지 않습니다.</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input h={12} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
        </Box>
        <Box mb={10}>
          <FormControl>
            <FormLabel>닉네임</FormLabel>
            <Input h={12} onChange={(e) => setNickName(e.target.value)} />
          </FormControl>
        </Box>
        <Box mb={7}>
          <Button h={12} w={500} onClick={handleClick} isDisabled={isDisabled}>
            회원가입
          </Button>
        </Box>
        <Center mb={20}>
          이미 회원이신가요? &nbsp;
          <Link
            to="/login"
            style={{ textDecoration: "underline", color: "dodgerblue" }}
          >
            로그인
          </Link>
        </Center>
      </Box>
    </Center>
  );
}
