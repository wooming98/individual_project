import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberProfile() {
  const [member, setMember] = useState(null);
  const [oldNickname, setOldNickname] = useState("");
  const [isCheckedNickname, setIsCheckedNickname] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  // 화면이 렌더링 될 때 한 번 member 객체 가져오기
  useEffect(() => {
    axios.get(`api/member/profile`).then((res) => {
      const resMember = res.data;
      setMember({ ...resMember });
      setOldNickname(resMember.nickname);
    });
  }, []);

  useEffect(() => {
    if (member && member.nickname) {
      const timer = setTimeout(() => {
        axios
          .get(`/api/member/check?nickname=${member.nickname}`)
          .then(() => setIsCheckedNickname(true))
          .catch((err) => {
            if (err.response.status === 404) {
              setIsCheckedNickname(false);
            }
          });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [member]);

  // 회원 정보 수정 버튼 함수
  function handleClickSave() {
    axios
      .put(`api/member/modify`, { ...member })
      .then(() => {
        toast({
          status: "success",
          description: "정보가 수정되었습니다.",
          position: "bottom",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          status: "error",
          description: "오류가 발생했습니다.",
          position: "bottom",
        });
      });
  }

  // 조건에 맞지 않을 시 저장(수정) 버튼 비활성화
  let isDisabled = false;

  // member가 null 또는 undefined가 아닌지 확인 후 nickname 비교
  if (member && member.nickname === oldNickname) {
    isDisabled = true;
  }

  if (!isCheckedNickname) {
    isDisabled = true;
  }

  if (member === null) {
    return <Spinner />;
  }

  function handleClickPasswordChanges() {
    navigate("/password-changes");
  }

  return (
    <Center>
      <Box w={500}>
        <Heading size={"md"} mb={10}>
          회원정보
        </Heading>
        <Box mb={7}>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input h={12} value={member.username} readOnly />
          </FormControl>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>닉네임</FormLabel>
            <Input
              h={12}
              value={member.nickname}
              onChange={(e) => {
                const newNickname = e.target.value.trim();
                setMember({ ...member, nickname: newNickname });
              }}
            />
            {isCheckedNickname && (
              <FormHelperText color="dodgerblue">
                사용 가능한 닉네임입니다.
              </FormHelperText>
            )}
          </FormControl>
        </Box>
        <Flex justify={"flex-end"}>
          <Button
            onClick={handleClickSave}
            isDisabled={isDisabled}
            style={{ backgroundColor: "#0090F9", color: "#ffffff" }}
          >
            저장
          </Button>
        </Flex>
        <Divider mt={7} borderColor="#949192" />
        <Heading size={"md"} mt={7} mb={10}>
          비밀번호 변경
        </Heading>
        <Flex justify={"flex-end"}>
          <Button
            onClick={handleClickPasswordChanges}
            style={{ backgroundColor: "#EF4444", color: "#ffffff" }}
          >
            비밀번호 변경
          </Button>
        </Flex>
      </Box>
    </Center>
  );
}
