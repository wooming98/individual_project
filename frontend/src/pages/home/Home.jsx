import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/Navbar.jsx";
import { Box } from "@chakra-ui/react";

export function Home() {
  return (
    <Box>
      <Navbar />
      <Box mt={16}>
        <Outlet />
      </Box>
    </Box>
  );
}
