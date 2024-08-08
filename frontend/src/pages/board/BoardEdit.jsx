import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { Editor } from "@toast-ui/react-editor";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function BoardEdit() {
  const [board, setBoard] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  // Editor 변경 사항 감지
  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();

      const handleEditorChange = () => {
        if (board) {
          const updatedContent = editorInstance.getHTML();
          setBoard((prevBoard) => ({ ...prevBoard, content: updatedContent }));
        }
      };

      editorInstance.on("change", handleEditorChange);

      return () => {
        editorInstance.off("change", handleEditorChange);
      };
    }
  }, [board]);

  useEffect(() => {
    axios.get(`/api/board/${id}`).then((res) => setBoard(res.data));
  }, []);

  function handleUpdate() {
    axios
      .put("/api/board/edit", board, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        navigate("/");
      });
  }

  if (board === null) {
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
            <FormControl>
              <FormLabel>제목</FormLabel>
              <Input
                h={12}
                mb={8}
                defaultValue={board.title}
                onChange={(e) => setBoard({ ...board, title: e.target.value })}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>본문</FormLabel>
              <Editor
                ref={editorRef}
                height="600px"
                initialValue={board.content}
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                hideModeSwitch={true}
              />
            </FormControl>
          </Box>
        </Box>
        <Flex justifyContent="flex-end" mb={10}>
          <ButtonGroup>
            <Button
              onClick={() => {
                navigate(`/board/${id}`);
              }}
            >
              취소
            </Button>
            <Button onClick={handleUpdate}>등록</Button>
          </ButtonGroup>
        </Flex>
      </Box>
    </Center>
  );
}
