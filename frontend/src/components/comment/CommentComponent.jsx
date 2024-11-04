import { Flex } from "@chakra-ui/react";
import { CommentWrite } from "./CommentWrite.jsx";

export function CommentComponent({ id }) {
  return (
    <Flex
      w="100%"
      maxW="840px"
      border={"1px solid gray "}
      borderRadius={"1rem"}
    >
      <CommentWrite id={id}></CommentWrite>
    </Flex>
  );
}
