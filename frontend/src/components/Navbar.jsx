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
} from "@chakra-ui/react";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex
      px={{
        lg: 200,
        base: 0,
      }}
      height={20}
      bgColor="gray.100"
      align="center"
      width="100%"
      justify="space-between" // 버튼들을 양쪽 끝으로 배치
    >
      <Button
        onClick={() => navigate("/")}
        cursor={"pointer"}
        p={6}
        fontSize={20}
        fontWeight={600}
      >
        Home
      </Button>
      {account.accessToken === null ? (
        <Button
          onClick={() => navigate("/login")}
          cursor={"pointer"}
          p={6}
          fontSize={14}
          fontWeight={600}
          border="2px solid"
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
  );
}
