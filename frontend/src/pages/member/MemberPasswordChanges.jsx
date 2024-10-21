import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../components/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

export function MemberPasswordChanges() {
  const [member, setMember] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPssswordCheck] = useState("");
  const [ButtonCatch, setButtonCatch] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const account = useContext(LoginContext);

  // 화면이 렌더링 될 때 한 번 member 객체 가져오기
  useEffect(() => {
    axios.get(`api/member/profile`).then((res) => {
      const resMember = res.data;
      setMember({ ...resMember });
    });
  }, []);

  function handleClickPasswordSave() {
    axios
      .put(`api/member/modify-password`, {
        ...member,
        oldPassword,
        password,
      })
      .then(() => {
        account.logout();
        navigate("/");
        toast({
          status: "success",
          description: "비밀번호가 변경되었습니다. 다시 로그인 해주세요.",
          position: "bottom",
        });
      })
      .catch(() => setButtonCatch(true));
  }

  // 비밀번호 변경 버튼 공백 등이면 비활성화
  let isDisabled = true;

  // 패스워드를 동일하게 입력했는지?
  if (password === passwordCheck) {
    isDisabled = false;
  }

  // 하나라도 공백이면 버튼 비활성화
  if (
    !(
      oldPassword.trim().length > 0 &&
      password.trim().length > 0 &&
      passwordCheck.trim().length > 0
    )
  ) {
    isDisabled = true;
  }

  if (member === null) {
    return <Spinner />;
  }

  return (
    <Center>
      <Box w={500}>
        <Heading size={"lg"} mb={10} mt={50}>
          변경하실 비밀번호를 입력해주세요.
        </Heading>
        <Box mb={7}>
          <FormControl>
            <FormLabel>현재 비밀번호</FormLabel>
            <Input h={12} onChange={(e) => setOldPassword(e.target.value)} />
          </FormControl>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>신규 비밀번호</FormLabel>
            <Input h={12} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>신규 비밀번호 확인</FormLabel>
            <Input h={12} onChange={(e) => setPssswordCheck(e.target.value)} />
            {password === passwordCheck || (
              <FormHelperText color="tomato">
                암호가 일치하지 않습니다.
              </FormHelperText>
            )}
          </FormControl>
        </Box>
        <Button
          w={"full"}
          color={"white"}
          bg={"#0090F9"}
          _hover={{ bg: "#0090F9" }}
          mb={7}
          isDisabled={isDisabled}
          onClick={handleClickPasswordSave}
        >
          비밀번호 변경
        </Button>
        {ButtonCatch && (
          <Box w={"full"} p={4} bg={"#EF4444"} rounded="md">
            <Flex color={"white"}>
              <Box mr={5}>
                <FontAwesomeIcon icon={faMicrophone} />
              </Box>
              <Box>
                <Text>비밀번호 변경 실패</Text>
                <Text>현재 비밀번호가 일치하지 않습니다.</Text>
              </Box>
            </Flex>
          </Box>
        )}
      </Box>
    </Center>
  );
}
