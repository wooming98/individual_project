import { Flex } from "@chakra-ui/react";
import { CommentWrite } from "./CommentWrite.jsx";
import { CommentList } from "./CommentList.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

export function CommentComponent({ boardIndex, memberIndex }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  // 댓글 수 가져오기
  useEffect(() => {
    axios.get(`/api/comment/count/${boardIndex}`).then((res) => {
      setCommentCount(res.data);
    });
  }, [isProcessing]);

  return (
    <Flex w="100%" maxW="840px" borderRadius={"1rem"} direction="column">
      {/* 해당 게시물 댓글 수 가져오기 */}
      {commentCount !== 0 && <Flex margin={8}>{commentCount}개의 댓글</Flex>}
      {/* 해당 게시물에 댓글 작성 */}
      <CommentWrite
        boardIndex={boardIndex}
        memberIndex={memberIndex}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
      {/* 해당 게시물에 댓글 가져오기 */}
      <CommentList
        boardIndex={boardIndex}
        memberIndex={memberIndex}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </Flex>
  );
}
