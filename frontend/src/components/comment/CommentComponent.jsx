import { Flex } from "@chakra-ui/react";
import { CommentWrite } from "./CommentWrite.jsx";
import { CommentList } from "./CommentList.jsx";

export function CommentComponent({ boardIndex, memberIndex }) {
  return (
    <Flex w="100%" maxW="840px" borderRadius={"1rem"} direction="column">
      <CommentWrite boardIndex={boardIndex} memberIndex={memberIndex} />
      <CommentList boardIndex={boardIndex} memberIndex={memberIndex} />
    </Flex>
  );
}
