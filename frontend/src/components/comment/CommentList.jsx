import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import { CommentItem } from "./CommentItem.jsx";

export function CommentList({
  boardIndex,
  memberIndex,
  isProcessing,
  setIsProcessing,
}) {
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
        <CommentItem
          boardIndex={boardIndex}
          comment={comment}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      ))}
    </Box>
  );
}
