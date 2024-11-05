import { Avatar, Box, Button, Flex, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function CommentEdit({
  comment,
  setIsEditing,
  isProcessing,
  setIsProcessing,
}) {
  const [oldComment, setOldComment] = useState(comment.comment);

  function handleClickModify() {
    setIsProcessing(true);
    axios
      .put("/api/comment/edit", {
        comment: oldComment,
        commentIndex: comment.commentIndex,
      })
      .then(() => {
        setIsEditing(false);
      })
      .catch()
      .finally(() => {
        setIsProcessing(false);
      });
  }

  return (
    <Box>
      <Flex w="100%">
        <Avatar w={43} h={43} />
        <Textarea
          ml={5}
          value={oldComment}
          onChange={(e) => {
            setOldComment(e.target.value);
          }}
          placeholder="댓글을 입력하세요."
          minHeight="100px"
        />
      </Flex>
      <Flex justifyContent="flex-end" mt={3} gap={3}>
        <Button onClick={() => setIsEditing(false)}>취소</Button>
        <Button isLoading={isProcessing} onClick={handleClickModify}>
          댓글 쓰기
        </Button>
      </Flex>
    </Box>
  );
}
