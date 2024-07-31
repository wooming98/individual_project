import {
  Box,
  Button,
  Center,
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
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../components/LoginProvider.jsx";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);

  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get("/api/board/list").then((res) => setBoardList(res.data));
  }, []);

  return (
    <Box>
      <Box>
        <Heading>커뮤니티</Heading>
      </Box>
      <Box>
        {account.isLoggedIn() && (
          <Button onClick={() => navigate("/write")}>작성하기</Button>
        )}
      </Box>
      <Box>
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
                <Tr key={board.boardIndex}>
                  <Td>{board.boardIndex}</Td>
                  <Td>{board.title}</Td>
                  <Td>{board.nickName}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
}
