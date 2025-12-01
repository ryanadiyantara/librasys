import React from "react";
import { Flex } from "@chakra-ui/react";

// IconBox component
export default function IconBox({ children, ...rest }) {
  return (
    <Flex alignItems="center" justifyContent="center" borderRadius="8px" {...rest}>
      {children}
    </Flex>
  );
}
