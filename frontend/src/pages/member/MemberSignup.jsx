import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export function MemberSignup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [isCheckedUsername, setIsCheckedUsername] = useState(false);
  const [isCheckedNickname, setIsCheckedNickname] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  function handleClick() {
    axios
      .post("/api/member/signup", { username, password, nickname })
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

  function handleNicknameCheck() {
    axios
      .get(`/api/member/check?nickname=${nickname}`)
      .then(() => {
        toast({
          status: "info",
          description: "사용할 수 있는 닉네임입니다.",
          position: "bottom",
        });
        setIsCheckedNickname(true);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "warning",
            description: "사용할 수 없는 닉네임입니다.",
            position: "bottom",
          });
        }
      });
  }

  function handleUsernameCheck() {
    axios
      .get(`/api/member/check?username=${username}`)
      .then(() => {
        toast({
          status: "info",
          description: "사용할 수 있는 이메일입니다.",
          position: "bottom",
        });
        setIsCheckedUsername(true);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "warning",
            description: "사용할 수 없는 이메일입니다.",
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
      username.trim().length > 0 &&
      password.trim().length > 0 &&
      nickname.trim().length > 0
    )
  ) {
    isDisabled = true;
  }

  // 이메일이 중복일 시 비활성화
  if (!isCheckedUsername) {
    isDisabled = true;
  }

  // 닉네임이 중복일 시 비활성화
  if (!isCheckedNickname) {
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
            <FormLabel>이메일</FormLabel>
            <InputGroup>
              <Input
                h={12}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.trim());
                  setIsCheckedUsername(false);
                }}
              />
              <InputRightElement
                w={75}
                mr={1}
                height="100%" // InputGroup의 높이에 맞게 설정
                alignItems="center" // 수직 중앙 정렬
              >
                <Button
                  isDisabled={username.trim().length === 0 || isCheckedUsername}
                  size={"sm"}
                  onClick={handleUsernameCheck}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            {isCheckedUsername ? (
              <FormHelperText color="dodgerblue">
                사용 가능한 이메일입니다.
              </FormHelperText>
            ) : (
              <FormHelperText color="tomato">
                이메일 중복확인을 눌러주세요.
              </FormHelperText>
            )}
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
              onChange={(e) => setPasswordCheck(e.target.value.trim())}
            />
            {isCheckedPassword || (
              <FormHelperText color="tomato">
                암호가 일치하지 않습니다.
              </FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box mb={10}>
          <FormControl>
            <FormLabel>닉네임</FormLabel>
            <InputGroup>
              <Input
                h={12}
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsCheckedNickname(false);
                }}
              />
              <InputRightElement
                w={75}
                mr={1}
                height="100%" // InputGroup의 높이에 맞게 설정
                alignItems="center" // 수직 중앙 정렬
              >
                <Button
                  isDisabled={nickname.trim().length === 0 || isCheckedNickname}
                  size={"sm"}
                  onClick={handleNicknameCheck}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            {isCheckedNickname ? (
              <FormHelperText color="dodgerblue">
                사용 가능한 닉네임입니다.
              </FormHelperText>
            ) : (
              <FormHelperText color="tomato">
                닉네임 중복확인을 눌러주세요.
              </FormHelperText>
            )}
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
