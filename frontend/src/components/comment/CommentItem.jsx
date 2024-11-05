import {
  Box,
  Divider,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext } from "react";
import { LoginContext } from "../LoginProvider.jsx";
import axios from "axios";

export function CommentItem({
  boardIndex,
  comment,
  isProcessing,
  setIsProcessing,
}) {
  const account = useContext(LoginContext);

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
      });
  }

  return (
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
              <MenuItem onClick={() => {}}>
                <Text>
                  <FontAwesomeIcon icon={faPenToSquare} /> 수정하기
                </Text>
              </MenuItem>
              <MenuItem onClick={handleClickDelete}>
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
    </Box>
  );
}
