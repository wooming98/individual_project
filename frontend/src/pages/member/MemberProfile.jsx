import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faUserMinus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../components/LoginProvider.jsx";

export function MemberProfile() {
  const [member, setMember] = useState({});
  const [memberIndex, setMemberIndex] = useState("");
  const [oldNickname, setOldNickname] = useState("");
  const [isCheckedNickname, setIsCheckedNickname] = useState(true);
  const [frontProfileImage, setFrontProfileImage] = useState(null);
  const [backProfileImage, setBackProfileImage] = useState(null);
  const [oldProfile, setOldProfile] = useState(null);
  const [checkBox, setCheckBox] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const account = useContext(LoginContext);

  // 화면이 렌더링 될 때 한 번 member 객체 가져오기
  useEffect(() => {
    axios.get(`api/member/profile`).then((res) => {
      const resMember = res.data.member;
      setMember({ ...resMember });
      setOldNickname(resMember.nickname);
      setMemberIndex(resMember.memberIndex);

      const resProfile = res.data.profile;
      setFrontProfileImage(resProfile.src);
      setOldProfile(resProfile.src);
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
    // 닉네임과 프로필 둘 다 전과 변경사항이 없거나, 닉네임 중복이면 수정 불가능
    if (
      ((member && member.nickname !== oldNickname) ||
        frontProfileImage !== oldProfile) &&
      isCheckedNickname === true
    ) {
      axios
        .putForm(`api/member/modify`, { ...member, backProfileImage })
        .then((res) => {
          toast({
            status: "info",
            description: "정보가 수정되었습니다.",
            position: "bottom",
          });
          account.login(res.headers["access"]);
          navigate("/");
        })
        .catch(() => {
          toast({
            status: "error",
            description: "오류가 발생했습니다.",
            position: "bottom",
          });
        });
    } else if (isCheckedNickname === false) {
      toast({
        status: "error",
        description: "닉네임을 확인해주세요.",
        position: "bottom",
      });
    } else {
      toast({
        status: "error",
        description: "정보가 이전과 동일합니다. 변경 후 저장해 주세요.",
        position: "bottom",
      });
    }
  }

  function handleClickDelete() {
    axios.delete(`/api/member/${memberIndex}`).then(() => {
      toast({
        status: "info",
        description: "탈퇴하였습니다.",
        position: "bottom",
      });
      account.logout();
      navigate("/");
    });
  }

  // 파일 업로드
  function handleFileChange(e) {
    // 사용자가 업로드한 파일 가져오기
    const file = e.target.files[0];
    // 파일이 있는지 확인
    if (file) {
      // backend로 넘기기 위해 상태에 저장
      setBackProfileImage(file);
      // new FileReader()은 브라우저에서 파일을 읽이 위해 사용하는 객체
      const reader = new FileReader();
      // 파일 읽기가 끝났을 때 실행할 이벤트 핸들러 정의
      reader.onloadend = () => {
        // 파일 내용을 Data URL(Base64) 형식으로 변환하여 setProfileImage 함수로 상태에 저장
        setFrontProfileImage(reader.result);
      };
      // 파일을 Data URL 형식으로 읽기
      reader.readAsDataURL(file);
    } else {
      setFrontProfileImage(oldProfile.src);
    }
  }

  // 비밀번호 변경 페이지로 이동
  function handleClickPasswordChanges() {
    navigate("/password-changes");
  }

  if (member === null) {
    return <Spinner />;
  }

  return (
    <Center>
      <Box w="100%" maxW="720px">
        <Heading size={"md"} mb={10}>
          회원정보
        </Heading>
        <Flex alignItems="center" justify="space-between">
          <Flex flexDirection="column" w={400}>
            <Flex mb={7}>
              <FormControl>
                <FormLabel>이메일</FormLabel>
                <Input h={12} value={member.username} readOnly />
              </FormControl>
            </Flex>
            <Flex>
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
                {isCheckedNickname ? (
                  <FormHelperText color="dodgerblue">
                    사용 가능한 닉네임입니다.
                  </FormHelperText>
                ) : (
                  <FormHelperText color="tomato">
                    다른 닉네임을 사용해주세요.
                  </FormHelperText>
                )}
              </FormControl>
            </Flex>
          </Flex>
          <FormLabel>
            <Avatar
              cursor="pointer"
              _hover={{ filter: "brightness(0.7)" }}
              w="180px"
              h="180px"
              borderRadius="xl"
              shadow="2xl"
              src={frontProfileImage}
            />
            <Input
              onChange={handleFileChange}
              display="none"
              type="file"
              accept="image/*"
            />
          </FormLabel>
        </Flex>
        <Flex justify={"flex-end"}>
          <Button
            onClick={handleClickSave}
            style={{ backgroundColor: "#0090F9", color: "#ffffff" }}
            mt={16}
            isDisabled={!isCheckedNickname}
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
            w={180}
          >
            <FontAwesomeIcon icon={faLock} />
            <Text ml={5}>비밀번호 변경</Text>
          </Button>
        </Flex>
        <Divider mt={7} borderColor="#949192" />
        <Heading size={"md"} mt={7} mb={5}>
          계정삭제
        </Heading>
        <Box>
          <Box
            rounded="md"
            border="1px"
            borderColor="#949192"
            color={"#555555"}
            p={4}
          >
            <Text>
              회원 탈퇴 시, 계정 정보와 닉네임을 포함한 모든 개인 정보가 완전히
              삭제되며,
            </Text>
            <Text>삭제된 데이터는 복구할 수 없습니다.</Text>
          </Box>
          <Flex justifyContent="space-between" mt={10}>
            <Checkbox
              isChecked={checkBox}
              onChange={(e) => setCheckBox(e.target.checked)}
            >
              계정 삭제에 관한 정책을 읽고 이에 동의합니다.
            </Checkbox>
            <Button
              onClick={onOpen}
              isDisabled={!checkBox}
              style={{ backgroundColor: "#EF4444", color: "#ffffff" }}
              w={180}
            >
              <FontAwesomeIcon icon={faUserMinus} />
              <Text ml={5}>회원 탈퇴</Text>
            </Button>
          </Flex>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex justifyContent="space-between" alignItems="center">
                <Text>회원 탈퇴</Text>
                <Button style={{ backgroundColor: "white" }} onClick={onClose}>
                  <FontAwesomeIcon icon={faXmark} size="lg" />
                </Button>
              </Flex>
            </ModalHeader>
            <ModalBody>정말로 탈퇴하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button
                onClick={handleClickDelete}
                style={{ backgroundColor: "#0090F9", color: "#ffffff" }}
              >
                확인
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Center>
  );
}
