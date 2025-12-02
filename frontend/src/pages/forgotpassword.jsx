import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import Logo1 from "../assets/img/logo1.png";
import Logo2 from "../assets/img/logo2.png";
import logInImage from "../assets/img/logInImage.jpg";

import { useMemberStore } from "../store/member";

const ForgotPassword = () => {
  // Utils
  const { forgotPassword } = useMemberStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");
  const colorMode = useColorMode();
  const navigate = useNavigate();
  const [newMember, setNewMember] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});

  // Services
  const handleResetLink = async () => {
    const currentErrors = {
      email: !newMember.email,
    };

    setErrors(currentErrors);

    const { success, message } = await forgotPassword(newMember);

    if (success) {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
      setNewMember({
        email: "",
      });
      setTimeout(() => {
        navigate("/login");
        window.location.reload();
      }, 1500);
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
    <>
      <Flex position="relative" mb="40px">
        <Flex
          minH={{ md: "1000px" }}
          h={{ sm: "initial", md: "75vh", lg: "85vh" }}
          w="100%"
          mx="auto"
          justifyContent="space-between"
          mb="30px"
          pt={{ md: "0px" }}
        >
          {/* Input */}
          <Flex
            w="100%"
            h="100%"
            alignItems="center"
            justifyContent="center"
            mb="60px"
            direction={{ base: "column", lg: "row" }}
          >
            <Box zIndex="2" pt={"25px"} mb="12px" w={{ base: "400px" }}>
              <Stack direction="row" spacing="12px" align="center" justify="center">
                {colorMode === "light" ? (
                  <img src={Logo2} alt="Logo" />
                ) : (
                  <img src={Logo1} alt="Logo" />
                )}
              </Stack>
            </Box>
            <Flex
              zIndex="2"
              direction="column"
              w={{ base: "400px", md: "350px", sm: "250px" }}
              background="transparent"
              borderRadius={{ base: "15px", md: "10px" }}
              p={{ base: "40px", md: "30px", sm: "20px" }}
              bg={bgForm}
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xl" color={textColor} fontWeight="bold" mb="22px">
                Forgot Password
              </Text>
              <FormControl>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Email
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="text"
                  mb="24px"
                  size="lg"
                  placeholder="Your email"
                  name="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  borderColor={errors.email ? "red.500" : "gray.200"}
                />
                <Button
                  fontSize="14px"
                  variant="dark"
                  fontWeight="bold"
                  w="100%"
                  h="45"
                  onClick={handleResetLink}
                >
                  Send Reset Link
                </Button>
              </FormControl>
              <Button
                fontSize="14px"
                variant="outline"
                fontWeight="bold"
                w="100%"
                h="45"
                as={Link}
                to="/login"
                mt="22px"
              >
                Back to Log In
              </Button>
            </Flex>
          </Flex>

          {/* Background */}
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
        </Flex>
      </Flex>

      <Footer />
    </>
  );
};
export default ForgotPassword;
