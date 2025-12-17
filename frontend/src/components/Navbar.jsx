import { useState, useEffect } from "react";
import {
  Box,
  useColorModeValue,
  Text,
  Flex,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  Button,
  useColorMode,
  useToast,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { SettingsIcon } from "./Icons/Icons";
import { HSeparator } from "./Separator";

import { useMemberStore } from "../store/member";
import Logo1 from "../assets/img/logo1.png";

function Navbar() {
  // Utils
  const { currentMembers, fetchCurrentMember, logoutMember } = useMemberStore();
  const [isOpen, setIsOpen] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const [isMemberLoaded, setIsMemberLoaded] = useState(false);
  const [isMemberSession, setIsMemberSession] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const handleOpenDrawer = () => setIsOpen(true);
  const handleCloseDrawer = () => setIsOpen(false);

  // Services
  useEffect(() => {
    const checkAccess = async () => {
      await fetchCurrentMember();
      setIsMemberLoaded(true);
    };

    checkAccess();
  }, [fetchCurrentMember]);

  useEffect(() => {
    if (isMemberLoaded && currentMembers) {
      setIsMemberSession(true);
    } else {
      setIsMemberSession(false);
    }
  }, [isMemberLoaded, currentMembers]);

  const handleLogout = async () => {
    const { success, message } = await logoutMember();

    if (success) {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
      navigate("/login");
    } else {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      position="absolute"
      boxShadow="none"
      bg="none"
      borderColor="transparent"
      filter="none"
      backdropFilter="none"
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: "center" }}
      borderRadius="16px"
      display="flex"
      minH="75px"
      justifyContent={{ xl: "center" }}
      lineHeight="25.6px"
      pb="8px"
      px={{
        sm: "15px",
        md: "40px",
      }}
      top="20px"
      w="100%"
    >
      <Flex w="100%" alignItems="center" justifyContent="space-between">
        <Box zIndex="2" pt={"25px"} mb="12px" w={{ base: "200px" }}>
          <Stack direction="row" spacing="12px" align="center" justify="center">
            <img src={Logo1} alt="Logo" />
          </Stack>
        </Box>
        <Flex
          w={{ sm: "100%", md: "auto" }}
          alignItems="center"
          justifyContent="flex-end"
          gap="30px"
        >
          {!isMemberSession ? (
            <Button
              bg="blue.400"
              fontSize="14px"
              color="white"
              fontWeight="bold"
              h="45"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          ) : (
            <Text fontSize="xl" fontWeight="bold" color="white" cursor="default">
              Hi, {currentMembers?.name}
            </Text>
          )}
          <SettingsIcon
            cursor="pointer"
            color={"white"}
            onClick={handleOpenDrawer}
            w="18px"
            h="18px"
          />
        </Flex>
        <Drawer isOpen={isOpen} onClose={handleCloseDrawer}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerCloseButton />
              <Text fontSize="xl" fontWeight="bold" mt="16px">
                Libra Sys Options
              </Text>
              <HSeparator />
            </DrawerHeader>
            <DrawerBody>
              <Flex flexDirection="column">
                <Flex justifyContent="space-between" alignItems="center" mb="24px">
                  <Text fontSize="md" fontWeight="600" mb="4px">
                    Dark/Light
                  </Text>
                  <Button
                    onClick={toggleColorMode}
                    color={colorMode === "light" ? "Dark" : "Light"}
                  >
                    Toggle {colorMode === "light" ? "Dark" : "Light"}
                  </Button>
                </Flex>
                {isMemberSession && (
                  <>
                    <Flex justifyContent="space-between" alignItems="center" mb="24px">
                      <Text fontSize="md" fontWeight="600" mb="4px">
                        Profile
                      </Text>
                      <Button
                        onClick={() => navigate("/profile")}
                        color={colorMode === "light" ? "Dark" : "Light"}
                      >
                        View Profile
                      </Button>
                    </Flex>
                    <HSeparator />
                    <Box mt="24px">
                      <Button
                        w="100%"
                        bg={useColorModeValue("white", "transparent")}
                        border="1px solid"
                        borderColor={useColorModeValue("gray.700", "white")}
                        color={useColorModeValue("gray.700", "white")}
                        fontSize="xs"
                        variant="no-effects"
                        px="20px"
                        mb="16px"
                        onClick={handleLogout}
                      >
                        <Text textDecoration="none">Log Out</Text>
                      </Button>
                    </Box>
                  </>
                )}
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Flex>
  );
}

export default Navbar;
