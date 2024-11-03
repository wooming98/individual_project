import { extendTheme } from "@chakra-ui/react";

export const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "'Pretendard-Regular', sans-serif",
        lineHeight: "1.6",
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: "Pretendard-Bold, sans-serif",
        fontWeight: 800,
        // 다크모드일 때 색깔
        // _dark: {
        //   color: "#0090F9",
        // },
      },
    },
  },
});
