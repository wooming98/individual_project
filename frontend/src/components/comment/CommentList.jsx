import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Divider, Flex, Spacer } from "@chakra-ui/react";

export function CommentList({ boardIndex, memberIndex, isProcessing }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/list/${boardIndex}`)
        .then((res) => setCommentList(res.data))
        .catch((err) => console.log(err));
    }
  }, [isProcessing]);

  return (
    <Box margin={8}>
      {commentList.map((comment) => (
        <Box key={comment.id} my={3}>
          <Flex>
            <Box>{comment.nickname}</Box>
            <Spacer />
            <Box>{comment.inserted}</Box>
          </Flex>
          <Box>{comment.comment}</Box>
          <Divider mt={5} mb={5} borderColor="#949192" />
        </Box>
      ))}
    </Box>
  );
}
