import { Avatar, Box, Button, Flex, Textarea } from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "../LoginProvider.jsx";

export function CommentWrite({
  boardIndex,
  memberIndex,
  isProcessing,
  setIsProcessing,
}) {
  const [comment, setComment] = useState("");
  const account = useContext(LoginContext);

  function handleSubmitComment() {
    setIsProcessing(true);
    axios
      .post("/api/comment/add", { boardIndex, memberIndex, comment })
      .then(() => setComment(""))
      .catch(() => {})
      .finally(() => {
        setIsProcessing(false);
      });
  }

  return (
    <Box margin={8}>
      {account.accessToken === null ? (
        <Flex w="100%">
          <Avatar w={43} h={43} />
          <Textarea
            ml={5}
            placeholder="댓글을 쓰려면 로그인이 필요합니다."
            minHeight="100px"
            isDisabled={true}
          />
        </Flex>
      ) : (
        <Flex w="100%">
          <Avatar w={43} h={43} />
          <Textarea
            ml={5}
            placeholder="댓글을 입력하세요."
            minHeight="100px"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Flex>
      )}

      <Flex justifyContent="flex-end" mt={3}>
        <Button
          isLoading={isProcessing}
          isDisabled={comment.trim().length === 0}
          onClick={handleSubmitComment}
        >
          댓글 쓰기
        </Button>
      </Flex>
    </Box>
  );
}
