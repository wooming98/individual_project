import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../components/LoginProvider.jsx";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const editorRef = useRef(null);

  const { memberIndex } = useContext(LoginContext);

  // Editor 변경 사항 감지
  useEffect(() => {
    const editorInstance = editorRef.current.getInstance();

    const handleEditorChange = () => {
      setContent(editorInstance.getHTML()); // HTML 형식으로 변경
    };

    editorInstance.on("change", handleEditorChange);

    return () => {
      editorInstance.off("change", handleEditorChange);
    };
  }, []);

  function handleClickSave() {
    axios.post("/api/board/add", { title, content, memberIndex }).then(() => {
      toast({
        description: "글이 등록되었습니다.",
        status: "info",
        position: "bottom",
      });
      navigate("/");
    });
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
                placeholder="제목을 입력해주세요."
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>본문</FormLabel>
              <Editor
                placeholder="내용을 입력해주세요."
                ref={editorRef}
                height="600px"
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                hideModeSwitch={true}
              />
            </FormControl>
          </Box>
        </Box>
        <Flex justifyContent="flex-end" mb={10}>
          <ButtonGroup>
            <Button>취소</Button>
            <Button onClick={handleClickSave}>등록</Button>
          </ButtonGroup>
        </Flex>
      </Box>
    </Center>
  );
}
