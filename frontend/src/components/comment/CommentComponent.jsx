import { Flex } from "@chakra-ui/react";
import { CommentWrite } from "./CommentWrite.jsx";

export function CommentComponent({ boardIndex, memberIndex }) {
  return (
    <Flex
      w="100%"
      maxW="840px"
      border={"1px solid gray "}
      borderRadius={"1rem"}
    >
      <CommentWrite
        boardIndex={boardIndex}
        memberIndex={memberIndex}
      ></CommentWrite>
    </Flex>
  );
}
