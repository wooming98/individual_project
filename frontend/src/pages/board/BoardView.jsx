import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Center,
  Divider,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../components/LoginProvider.jsx";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  // 해당 게시물 보기
  useEffect(() => {
    axios.get(`/api/board/${id}`).then((res) => setBoard(res.data));
  }, []);

  // 해당 게시물 삭제
  function handleDelete() {
    axios
      .delete(`/api/board/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        navigate("/");
      });
  }

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
                <Flex w={"100%"} justify={"space-between"}>
                  <Text>{board.nickName}</Text>
                  {/* 자기 자신만 수정이나 삭제 보이게 하기 */}
                  {account.hasAccess(board.memberIndex) && (
                    <Menu isLazy>
                      <MenuButton>
                        <FontAwesomeIcon icon={faEllipsis} />
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={() => {
                            navigate(`/board/edit/${board.boardIndex}`);
                          }}
                        >
                          <Text>
                            <FontAwesomeIcon icon={faPenToSquare} /> 수정하기
                          </Text>
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>
                          <Text>
                            <FontAwesomeIcon icon={faTrashCan} /> 삭제하기
                          </Text>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  )}
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
          <Box pl={"1rem"}>
            <Viewer initialValue={board.content} />
          </Box>
        </Box>
      </Box>
    </Center>
  );
}
