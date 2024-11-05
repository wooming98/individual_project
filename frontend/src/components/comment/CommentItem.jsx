import {
  Box,
  Button,
  Divider,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faPenToSquare,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState } from "react";
import { LoginContext } from "../LoginProvider.jsx";
import axios from "axios";
import { CommentEdit } from "./CommentEdit.jsx";

export function CommentItem({
  boardIndex,
  comment,
  isProcessing,
  setIsProcessing,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const account = useContext(LoginContext);
  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleClickDelete() {
    setIsProcessing(true);
    axios
      .delete(`/api/comment/delete`, {
        data: { commentIndex: comment.commentIndex },
      })
      .then()
      .catch()
      .finally(() => {
        setIsProcessing(false);
        onClose();
      });
  }

  return (
    <Box>
      {isEditing || (
        <Box key={comment.commentIndex} my={3}>
          <Flex justify="space-between">
            <Box>{comment.nickname}</Box>
            <Box>{comment.inserted}</Box>
          </Flex>
          <Flex justify="end">
            {/* 자기 자신만 수정이나 삭제 보이게 하기 */}
            {comment.memberIndex === account.memberIndex && (
              <Menu isLazy>
                <MenuButton>
                  <FontAwesomeIcon icon={faEllipsis} />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    <Text>
                      <FontAwesomeIcon icon={faPenToSquare} /> 수정하기
                    </Text>
                  </MenuItem>
                  <MenuItem onClick={onOpen}>
                    <Text>
                      <FontAwesomeIcon icon={faTrashCan} /> 삭제하기
                    </Text>
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
          <Box>{comment.comment}</Box>
          <Divider mt={5} mb={5} borderColor="#949192" />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text>댓글 삭제</Text>
                  <Button
                    style={{ backgroundColor: "white" }}
                    onClick={onClose}
                  >
                    <FontAwesomeIcon icon={faXmark} size="lg" />
                  </Button>
                </Flex>
              </ModalHeader>
              <ModalBody>댓글을 삭제하시겠습니까?</ModalBody>
              <ModalFooter gap={3}>
                <Button onClick={onClose}>취소</Button>
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
      )}
      {isEditing && (
        <CommentEdit
          comment={comment}
          setIsEditing={setIsEditing}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      )}
    </Box>
  );
}
