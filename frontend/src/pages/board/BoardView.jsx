import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Center, Divider, Flex, Spinner, Text } from "@chakra-ui/react";
import { Viewer } from "@toast-ui/react-editor";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    axios.get(`/api/board/${id}`).then((res) => setBoard(res.data));
  }, []);

  // useEffect 훅이 데이터를 로드하기 전에 컴포넌트가 렌더링 될 수 있어 오류가 날 수 있으므로 필수 코드
  if (board === null || board === undefined) {
    return <Spinner />;
  }

  return (
    <Center>
      <Box>
        <Box
          w={{ base: "720px", sm: "640px", lg: "960px" }}
          p={"1rem"}
          mb={5}
          border={"1px solid gray "}
          borderRadius={"1rem"}
        >
          <Box>
            <Flex w={"100%"} p={"1rem"}>
              <Flex direction={"column"} w={"100%"}>
                <Flex>
                  <Text>{board.nickName}</Text>
                </Flex>
                <Flex w={"100%"} justify={"space-between"}>
                  <Flex>
                    <Text mr={1}>좋아요?</Text>
                    <Text mr={1}>조회수?</Text>
                  </Flex>
                  <Flex>
                    <Text>{board.inserted}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Box>
          <Box p={"1rem"}>{board.title}</Box>
          <Divider mb={5} borderColor="#949192" />
          <Viewer pl={"1rem"} initialValue={board.content} />
        </Box>
      </Box>
    </Center>
  );
}
