import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box w="100%" border="1px solid gray">
      <Flex>
        <Flex
          w="100%"
          maxW="1280px"
          h="64px"
          align="center"
          justify="space-between" // 버튼들을 양쪽 끝으로 배치
          margin="auto"
        >
          <Button onClick={() => navigate("/")}>로고자리</Button>
          {/* 다크모드 */}
          <Flex>
            <Button onClick={toggleColorMode} mr={5}>
              {" "}
              {colorMode === "light" ? (
                <FontAwesomeIcon icon={faMoon} style={{ color: "#8b92a2" }} />
              ) : (
                <FontAwesomeIcon icon={faSun} style={{ color: "#FFD43B" }} />
              )}
            </Button>
            {account.accessToken === null ? (
              <Button
                onClick={() => navigate("/login")}
                colorScheme="gray"
                border="1px solid gray"
                borderColor="gray.300"
              >
                로그인/회원가입
              </Button>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  colorScheme="gray"
                  border="1px solid gray"
                  borderColor="gray.300"
                >
                  <Flex>
                    <Box>{account.nickname}</Box>
                    <Box ml={5}>
                      <FontAwesomeIcon icon={faBars} />
                    </Box>
                  </Flex>
                </MenuButton>
                <MenuList>
                  <MenuGroup title="내 계정">
                    <MenuItem
                      onClick={() => {
                        navigate("/profile");
                      }}
                    >
                      프로필
                    </MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuItem
                    onClick={() => {
                      account.logout();
                      navigate("/");
                    }}
                  >
                    로그아웃
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
