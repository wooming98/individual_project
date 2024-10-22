import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faPen,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginContext } from "../../components/LoginProvider.jsx";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/board/list?${searchParams}`).then((res) => {
      setBoardList(res.data.boardList);
      setPageInfo(res.data.pageInfo);
    });
  }, [searchParams]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handleWrite() {
    if (account.accessToken) {
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
          <Button onClick={handleWrite}>
            <FontAwesomeIcon icon={faPen} />
            <Text ml={3}>작성하기</Text>
          </Button>
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
                    <Td>{board.nickname}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
          <Center mt={10}>
            <Flex gap={1}>
              {pageInfo.prevPageNumber && (
                <>
                  <Button onClick={() => navigate(`/?page=1`)}>
                    <FontAwesomeIcon icon={faAnglesLeft} />
                  </Button>
                  <Button
                    onClick={() =>
                      navigate(`/?page=${pageInfo.prevPageNumber}`)
                    }
                  >
                    <FontAwesomeIcon icon={faAngleLeft} />
                  </Button>
                </>
              )}
              {pageNumbers.map((pageNumber) => (
                <Button
                  onClick={() => navigate(`/?page=${pageNumber}`)}
                  key={pageNumber}
                  colorScheme={
                    pageNumber === pageInfo.currentPageNumber ? "blue" : "gray"
                  }
                >
                  {pageNumber}
                </Button>
              ))}
              {pageInfo.nextPageNumber && (
                <>
                  <Button
                    onClick={() =>
                      navigate(`/?page=${pageInfo.nextPageNumber}`)
                    }
                  >
                    <FontAwesomeIcon icon={faAngleRight} />
                  </Button>
                  <Button
                    onClick={() =>
                      navigate(`/?page=${pageInfo.lastPageNumber}`)
                    }
                  >
                    <FontAwesomeIcon icon={faAnglesRight} />
                  </Button>
                </>
              )}
            </Flex>
          </Center>
        </Box>
      </Box>
    </Center>
  );
}
