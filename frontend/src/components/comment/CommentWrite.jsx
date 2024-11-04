import { Avatar, Box, Button, Flex, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function CommentWrite({ boardIndex, memberIndex }) {
  const [comment, setComment] = useState("");

  function handleSubmitComment() {
    axios.post("/api/comment/add", { boardIndex, memberIndex, comment });
  }

  return (
    <Box w="100%" margin={8}>
      <Flex w="100%">
        <Avatar w={37} h={37} />
        <Textarea
          ml={5}
          placeholder="댓글을 입력하세요."
          minHeight="100px"
          onChange={(e) => setComment(e.target.value)}
        />
      </Flex>
      <Flex justifyContent="flex-end" mt={3}>
        <Button onClick={handleSubmitComment}>댓글 쓰기</Button>
      </Flex>
    </Box>
  );
}
