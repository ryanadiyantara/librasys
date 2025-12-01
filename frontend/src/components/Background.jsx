import React from "react";
import { Box, useColorMode } from "@chakra-ui/react";

import Backgrounds from "../assets/img/background.png";

const Background = () => {
  // Utils
  const { colorMode } = useColorMode();

  return (
    <>
      <Box
        minH="40vh"
        w="100%"
        position="fixed"
        bgImage={colorMode === "light" ? Backgrounds : "#1b254b"}
        bg={colorMode === "light" ? Backgrounds : "#0b1437"}
        bgSize="cover"
        top="0"
      />
      <Box
        minH="60vh"
        w="100%"
        position="fixed"
        bg={colorMode === "light" ? "gray.50" : "#1b254b"}
        bgSize="cover"
        top="40vh"
      />
    </>
  );
};

export default Background;
