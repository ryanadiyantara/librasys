import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  useToast,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";

import { useNavigate, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logInImage from "../assets/img/logInImage.jpg";

import { useMemberStore } from "../store/member";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Profile = () => {
  // Utils
  const { currentMembers, fetchCurrentMember, changePassword } = useMemberStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newMember, setNewMember] = useState({
    old_password: "",
    new_password: "",
  });
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const openApprovalModal = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Services
  useEffect(() => {
    fetchCurrentMember();
  }, [fetchCurrentMember]);

  const handleChangePassword = async () => {
    const currentErrors = {
      old_password: !newMember.old_password,
      new_password: !newMember.new_password,
    };
    setErrors(currentErrors);

    const { success, message } = await changePassword(
      currentMembers._id,
      currentMembers.email,
      newMember
    );

    if (success) {
      toast({
        title: "Success",
        description: "Your password changed successfully",
        status: "success",
        isClosable: true,
      });
      setNewMember({
        old_password: "",
        new_password: "",
      });
      setIsOpen(false);
    } else {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Background */}
      <Flex position="relative" mb="40px">
        <Flex
          minH={{ md: "1000px" }}
          h={{ md: "75vh", lg: "85vh" }}
          w="100%"
          mx="auto"
          justifyContent="space-between"
          mb="30px"
          pt={{ md: "0px" }}
        >
          <Box
            overflowX="hidden"
            h="100%"
            w="100%"
            left="0px"
            position="absolute"
            bgImage={logInImage}
          >
            <Box w="100%" h="100%" bgSize="cover" bg="#000000ff" opacity="0.8"></Box>
          </Box>

          <Navbar />

          {/* Content */}
          <Box
            position="absolute"
            top="120px"
            left="50%"
            transform="translateX(-50%)"
            w="90%"
            maxW="1500px"
            maxH="90vh"
            zIndex="10"
            overflowY={{ sm: "scroll", xl: "hidden" }}
          >
            <Flex direction={{ sm: "column", xl: "row" }} justifyContent="space-between">
              {/* Profile */}
              <Box
                bg="transparent"
                borderRadius="12px"
                p="20px"
                maxW="1100px"
                w={{ sm: "auto", xl: "100%" }}
                overflowY="auto"
                boxShadow="lg"
                mx="auto"
                sx={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                align="center"
              >
                <Box
                  bg={bgForm}
                  borderRadius="12px"
                  boxShadow="md"
                  overflow="hidden"
                  transition="0.2s"
                  _hover={{ transform: "scale(1.03)" }}
                >
                  <Flex direction="column" w="325px" borderRadius="15px" p="40px" bg={bgForm}>
                    <Text fontSize="xl" color={textColor} fontWeight="bold" mb="22px">
                      Profile Info
                    </Text>
                    <FormControl>
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Member Name
                      </FormLabel>
                      <Input
                        fontSize="sm"
                        ms="4px"
                        type="text"
                        mb="24px"
                        size="lg"
                        placeholder="Member Name"
                        name="name"
                        // value={newMember.name}
                        // onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        // borderColor={errors.name ? "red.500" : "gray.200"}
                      />
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Email
                      </FormLabel>
                      <Input
                        fontSize="sm"
                        ms="4px"
                        type="email"
                        mb="24px"
                        size="lg"
                        placeholder="Email"
                        name="email"
                        // value={newMember.email}
                        // onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        // borderColor={errors.email ? "red.500" : "gray.200"}
                      />
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Identity Number
                      </FormLabel>
                      <Input
                        fontSize="sm"
                        ms="4px"
                        type="text"
                        mb="24px"
                        size="lg"
                        placeholder="Identity Number"
                        name="identityNumber"
                        // value={newMember.identityNumber}
                        // onChange={(e) => setNewMember({ ...newMember, identityNumber: e.target.value })}
                        // borderColor={errors.identityNumber ? "red.500" : "gray.200"}
                      />
                      <Button
                        bg="blue.400"
                        fontSize="14px"
                        color="white"
                        fontWeight="bold"
                        w="100%"
                        h="45"
                        mt="24px"
                        // onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                      <Button
                        fontSize="14px"
                        variant="solid"
                        fontWeight="bold"
                        w="100%"
                        h="45"
                        mt="4"
                        // onClick={handleCancelEdit}
                        colorScheme="gray"
                      >
                        Cancel
                      </Button>
                    </FormControl>
                  </Flex>
                </Box>
              </Box>

              {/* Loan Data */}
              <Box
                bg="transparent"
                borderRadius="12px"
                p="20px"
                maxW="1100px"
                w={{ sm: "auto", xl: "100%" }}
                overflowY="auto"
                boxShadow="lg"
                mx="auto"
                sx={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                align="center"
              >
                <Box
                  bg={bgForm}
                  borderRadius="12px"
                  boxShadow="md"
                  overflow="hidden"
                  transition="0.2s"
                  _hover={{ transform: "scale(1.03)" }}
                >
                  <Flex direction="column" w="325px" borderRadius="15px" p="40px" bg={bgForm}>
                    <Text fontSize="xl" color={textColor} fontWeight="bold" mb="22px">
                      Profile
                    </Text>
                    <FormControl>
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Member Name
                      </FormLabel>
                      <Input
                        fontSize="sm"
                        ms="4px"
                        type="text"
                        mb="24px"
                        size="lg"
                        placeholder="Member Name"
                        name="name"
                        // value={newMember.name}
                        // onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        // borderColor={errors.name ? "red.500" : "gray.200"}
                      />
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Email
                      </FormLabel>
                      <Input
                        fontSize="sm"
                        ms="4px"
                        type="email"
                        mb="24px"
                        size="lg"
                        placeholder="Email"
                        name="email"
                        // value={newMember.email}
                        // onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        // borderColor={errors.email ? "red.500" : "gray.200"}
                      />
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Identity Number
                      </FormLabel>
                      <Input
                        fontSize="sm"
                        ms="4px"
                        type="text"
                        mb="24px"
                        size="lg"
                        placeholder="Identity Number"
                        name="identityNumber"
                        // value={newMember.identityNumber}
                        // onChange={(e) => setNewMember({ ...newMember, identityNumber: e.target.value })}
                        // borderColor={errors.identityNumber ? "red.500" : "gray.200"}
                      />
                      <Button
                        bg="blue.400"
                        fontSize="14px"
                        color="white"
                        fontWeight="bold"
                        w="100%"
                        h="45"
                        mt="24px"
                        // onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                      <Button
                        fontSize="14px"
                        variant="solid"
                        fontWeight="bold"
                        w="100%"
                        h="45"
                        mt="4"
                        // onClick={handleCancelEdit}
                        colorScheme="gray"
                      >
                        Cancel
                      </Button>
                    </FormControl>
                  </Flex>
                </Box>
              </Box>

              {/* Change Password */}
              <Box
                bg="transparent"
                borderRadius="12px"
                p="20px"
                maxW="1100px"
                w={{ sm: "auto", xl: "100%" }}
                overflowY="auto"
                boxShadow="lg"
                mx="auto"
                sx={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                align="center"
              >
                <Box
                  bg={bgForm}
                  borderRadius="12px"
                  boxShadow="md"
                  overflow="hidden"
                  transition="0.2s"
                  _hover={{ transform: "scale(1.03)" }}
                >
                  <Flex direction="column" w="325px" borderRadius="15px" p="40px" bg={bgForm}>
                    <Text fontSize="xl" color={textColor} fontWeight="bold" mb="22px">
                      Change Password
                    </Text>
                    <FormControl>
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Old Password
                      </FormLabel>
                      <InputGroup size="lg" mb="24px">
                        <Input
                          fontSize="sm"
                          ms="4px"
                          type={showPassword.oldPassword ? "text" : "password"}
                          mb="24px"
                          size="lg"
                          placeholder="Your old password"
                          name="old_password"
                          value={newMember.old_password}
                          onChange={(e) =>
                            setNewMember({ ...newMember, old_password: e.target.value })
                          }
                          borderColor={errors.old_password ? "red.500" : "gray.200"}
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={
                              showPassword.oldPassword ? "Hide old password" : "Show old password"
                            }
                            icon={showPassword.oldPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => togglePasswordVisibility("oldPassword")}
                            variant="ghost"
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        New Password
                      </FormLabel>
                      <InputGroup size="lg" mb="24px">
                        <Input
                          fontSize="sm"
                          ms="4px"
                          type={showPassword.newPassword ? "text" : "password"}
                          mb="24px"
                          size="lg"
                          placeholder="Your new password"
                          name="new_password"
                          value={newMember.new_password}
                          onChange={(e) =>
                            setNewMember({ ...newMember, new_password: e.target.value })
                          }
                          borderColor={errors.new_password ? "red.500" : "gray.200"}
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={
                              showPassword.newPassword ? "Hide new password" : "Show new password"
                            }
                            icon={showPassword.newPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => togglePasswordVisibility("newPassword")}
                            variant="ghost"
                          />
                        </InputRightElement>
                      </InputGroup>
                      <Button
                        bg="blue.400"
                        fontSize="14px"
                        color="white"
                        fontWeight="bold"
                        w="100%"
                        h="45"
                        mt="24px"
                        onClick={() => openApprovalModal()}
                      >
                        Change
                      </Button>
                    </FormControl>

                    {/* Modal Change Password */}
                    <Modal isOpen={isOpen} onClose={handleClose} motionPreset="slideInBottom">
                      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(2px)" />
                      <ModalContent borderRadius="15px" boxShadow="none" p={4} maxW="400px" w="90%">
                        <ModalHeader>Change Password</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <p>
                            Are you sure you want to change your password? This action cannot be
                            undone.
                          </p>
                        </ModalBody>
                        <ModalFooter>
                          <Button colorScheme="blue" mr={3} onClick={handleClose}>
                            Cancel
                          </Button>
                          <Button colorScheme="green" onClick={handleChangePassword}>
                            Change
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Flex>

      <Footer />
    </>
  );
};
export default Profile;
