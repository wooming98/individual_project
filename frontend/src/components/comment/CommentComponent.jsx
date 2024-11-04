import { Flex } from "@chakra-ui/react";
import { CommentWrite } from "./CommentWrite.jsx";
import { CommentList } from "./CommentList.jsx";
import { useState } from "react";

export function CommentComponent({ boardIndex, memberIndex }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Flex w="100%" maxW="840px" borderRadius={"1rem"} direction="column">
      <CommentWrite
        boardIndex={boardIndex}
        memberIndex={memberIndex}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
      <CommentList
        boardIndex={boardIndex}
        memberIndex={memberIndex}
        isProcessing={isProcessing}
      />
    </Flex>
  );
}
