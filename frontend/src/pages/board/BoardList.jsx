import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useNavigate, useSearchParams} from "react-router-dom";
import { LoginContext } from "../../components/LoginProvider.jsx";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/board/list?${searchParams}`).then((res) => setBoardList(res.data));
  }, [searchParams]);

  function handleWrite() {
    if (account.isLoggedIn()) {
      navigate("/write");
    } else {
      navigate("/login");
    }
  }

  return (
    <Center>
      <Box w={{ base: "720px", sm: "640px", lg: "960px" }}>
        <Box
          border={"1px solid gray"}
          borderRadius={"1rem"}
          borderColor="#949192"
          p={"1rem"}
          mb={5}
        >
          <Heading size="lg">커뮤니티</Heading>
          <Box>다양한 사람을 만나고 생각의 폭을 넓혀보세요.</Box>
        </Box>
        <Box>
          <Button onClick={handleWrite}>작성하기</Button>
        </Box>
        <Divider mt={5} borderColor="#949192" />
        <Box mt={5}>
          {boardList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
          {boardList.length > 0 && (
            <Table>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>TITLE</Th>
                  <Th>
                    <FontAwesomeIcon icon={faUserPen} />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {boardList.map((board) => (
                  <Tr
                    _hover={{
                      bgColor: "gray.200",
                    }}
                    cursor={"pointer"}
                    onClick={() => navigate(`/board/${board.boardIndex}`)}
                    key={board.boardIndex}
                  >
                    <Td>{board.boardIndex}</Td>
                    <Td>{board.title}</Td>
                    <Td>{board.nickName}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
          <Box>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pageNumber) => (
                <Button
                    onClick={() => navigate(`/?page=${pageNumber}`)}
                    key={pageNumber}
                >
                  {pageNumber}
                </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Center>
  );
}
