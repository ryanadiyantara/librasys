import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Stack,
  useColorMode,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { DocumentIcon, PersonIcon, RocketIcon } from "./Icons/Icons";
import IconBox from "./Icons/IconBox";
import { HSeparator } from "./Separator";

import Logo1 from "../assets/img/logo1.png";
import Logo2 from "../assets/img/logo2.png";

import { useMemberStore } from "../store/member";

function Sidebar() {
  // Utils
  const { currentMembers, fetchCurrentMember } = useMemberStore();

  const routes = [
    {
      name: "Admin",
      views: [
        { path: "/admin/loan", name: "List of Loans", icon: <RocketIcon /> },
        { path: "/admin/member", name: "List of Members", icon: <PersonIcon /> },
        { path: "/admin/book", name: "List of Books", icon: <DocumentIcon /> },
      ],
    },
  ];

  const { colorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [isMemberLoaded, setIsMemberLoaded] = useState(false);
  const activeBg = useColorModeValue("white", "gray.700");
  const inactiveBg = useColorModeValue("white", "navy.800");
  const activeColor = useColorModeValue("gray.700", "white");
  const inactiveColor = useColorModeValue("gray.400", "gray.400");
  const hoverBg = useColorModeValue("gray.200", "gray.700");
  const sidebarBg = useColorModeValue("white", "navy.800");
  const activeBoxShadow = useColorModeValue("0px 7px 11px rgba(0, 0, 0, 0.04)", "none");

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
      const activeRoute = routes.find((route) =>
        route.views.some((view) => view.path === location.pathname)
      );

      if (activeRoute && activeRoute.name == "Admin" && currentMembers?.role !== activeRoute.name) {
        navigate("/dashboard");
        toast({
          title: "Error",
          description: "You are not allowed to access admin page",
          status: "error",
          isClosable: true,
        });
      }
    }
  }, [isMemberLoaded, currentMembers, location, navigate]);

  return (
    <Box display={{ sm: "none", xl: "block" }} position="fixed">
      <Box
        bg={sidebarBg}
        transition="0.2s linear"
        w="260px"
        maxW="260px"
        ms={{
          sm: "16px",
        }}
        my={{
          sm: "16px",
        }}
        height="calc(100vh - 32px)"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
        overflowY="auto"
        ps="20px"
        pe="20px"
        m="0px"
        filter="drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.05))"
        borderRadius="20px"
      >
        <Box pt={"25px"} mb="12px">
          <Stack direction="row" spacing="12px" align="center" justify="center">
            {colorMode === "light" ? (
              <img src={Logo1} alt="Logo" />
            ) : (
              <img src={Logo2} alt="Logo" />
            )}
          </Stack>
          <HSeparator my="26px" />
        </Box>
        <VStack align="start" spacing={4} w="100%">
          {routes.map((route, index) => (
            <Box key={index} w="full">
              <Text fontWeight="bold" mb={2} pl={3}>
                {route.name}
              </Text>
              <VStack align="start" spacing={2} w="100%">
                {route.views.map((view, viewIndex) => {
                  const isActive = location.pathname === view.path;
                  return (
                    <NavLink to={view.path} key={viewIndex} style={{ width: "100%" }}>
                      <Button
                        boxSize="initial"
                        justifyContent="flex-start"
                        alignItems="center"
                        bg={isActive ? activeBg : inactiveBg}
                        transition="0.2s linear"
                        mb={{ xl: "6px" }}
                        mx={{ xl: "auto" }}
                        ps={{ sm: "10px", xl: "16px" }}
                        py="12px"
                        borderRadius="15px"
                        boxShadow={isActive ? activeBoxShadow : "none"}
                        w="100%"
                        _hover={{ bg: isActive ? activeBg : hoverBg }}
                        _active={{
                          bg: isActive ? activeBg : "inherit",
                          transform: "none",
                          borderColor: "transparent",
                        }}
                        _focus={{
                          boxShadow: isActive ? "0px 7px 11px rgba(0, 0, 0, 0.04)" : "none",
                        }}
                      >
                        <Flex>
                          <IconBox
                            bg={isActive ? "blue.400" : { inactiveBg }}
                            color={isActive ? "white" : "blue.400"}
                            h="30px"
                            w="30px"
                            me="12px"
                          >
                            {view.icon}
                          </IconBox>

                          <Text
                            color={isActive ? activeColor : inactiveColor}
                            my="auto"
                            fontSize="sm"
                          >
                            {view.name}
                          </Text>
                        </Flex>
                      </Button>
                    </NavLink>
                  );
                })}
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}

export default Sidebar;

export function SidebarResponsive({}) {
  // Utils
  const routes = [
    {
      name: "Admin",
      views: [
        { path: "/admin/loan", name: "List of Loans", icon: <RocketIcon /> },
        { path: "/admin/member", name: "List of Members", icon: <PersonIcon /> },
        { path: "/admin/book", name: "List of Books", icon: <DocumentIcon /> },
      ],
    },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const location = useLocation();
  const activeBg = useColorModeValue("white", "gray.700");
  const inactiveBg = useColorModeValue("white", "navy.800");
  const activeColor = useColorModeValue("gray.700", "white");
  const inactiveColor = useColorModeValue("gray.400", "gray.400");
  const hoverBg = useColorModeValue("gray.200", "gray.700");
  const sidebarBg = useColorModeValue("white", "navy.800");
  const activeBoxShadow = useColorModeValue("0px 7px 11px rgba(0, 0, 0, 0.04)", "none");

  return (
    <>
      <Flex display={{ sm: "flex", xl: "none" }} alignItems="center" mr="10px">
        <HamburgerIcon color={"white"} w="18px" h="18px" onClick={onOpen} />
        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          <DrawerOverlay />
          <DrawerContent
            w="260px"
            maxW="260px"
            ms={{
              sm: "16px",
            }}
            my={{
              sm: "16px",
            }}
            overflowY="auto"
            borderRadius="20px"
            bg={sidebarBg}
          >
            <DrawerCloseButton _focus={{ boxShadow: "none" }} _hover={{ boxShadow: "none" }} />
            <DrawerBody
              maxW="250px"
              px="1rem"
              sx={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
              }}
            >
              <Box maxW="100%" h="100vh">
                <Box pt={"25px"} mb="12px">
                  <Stack direction="row" spacing="12px" align="center" justify="center">
                    {colorMode === "light" ? (
                      <img src={Logo1} alt="Logo" />
                    ) : (
                      <img src={Logo2} alt="Logo" />
                    )}
                  </Stack>
                  <HSeparator my="26px" />
                </Box>
                <VStack align="start" spacing={4} w="100%">
                  {routes.map((route, index) => (
                    <Box key={index} w="full">
                      <Text fontWeight="bold" mb={2} pl={3}>
                        {route.name}
                      </Text>
                      <VStack align="start" spacing={2} w="100%">
                        {route.views.map((view, viewIndex) => {
                          const isActive = location.pathname === view.path;
                          return (
                            <NavLink to={view.path} key={viewIndex} style={{ width: "100%" }}>
                              <Button
                                boxSize="initial"
                                justifyContent="flex-start"
                                alignItems="center"
                                bg={isActive ? activeBg : inactiveBg}
                                transition="0.2s linear"
                                mb={{ xl: "6px" }}
                                mx={{ xl: "auto" }}
                                ps={{ sm: "10px", xl: "16px" }}
                                py="12px"
                                borderRadius="15px"
                                boxShadow={isActive ? activeBoxShadow : "none"}
                                w="100%"
                                _hover={{ bg: isActive ? activeBg : hoverBg }}
                                _active={{
                                  bg: isActive ? activeBg : "inherit",
                                  transform: "none",
                                  borderColor: "transparent",
                                }}
                                _focus={{
                                  boxShadow: isActive ? "0px 7px 11px rgba(0, 0, 0, 0.04)" : "none",
                                }}
                              >
                                <Flex>
                                  <IconBox
                                    bg={isActive ? "blue.400" : { inactiveBg }}
                                    color={isActive ? "white" : "blue.400"}
                                    h="30px"
                                    w="30px"
                                    me="12px"
                                  >
                                    {view.icon}
                                  </IconBox>
                                  <Text
                                    color={isActive ? activeColor : inactiveColor}
                                    my="auto"
                                    fontSize="sm"
                                  >
                                    {view.name}
                                  </Text>
                                </Flex>
                              </Button>
                            </NavLink>
                          );
                        })}
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </>
  );
}
