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
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const editorInstance = editorRef.current.getInstance();

    const handleEditorChange = () => {
      setContent(editorInstance.getMarkdown());
    };

    editorInstance.on("change", handleEditorChange);

    return () => {
      editorInstance.off("change", handleEditorChange);
    };
  }, []);

  function handleClickSave() {
    axios
      .post(
        "/api/board/add",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then(() => {
        toast({
          description: "글이 등록되었습니다.",
          status: "success",
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
              <Input h={12} mb={8} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>본문</FormLabel>
              <Editor
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
