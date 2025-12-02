import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Footer from "../components/Footer";
import Logo1 from "../assets/img/logo1.png";
import Logo2 from "../assets/img/logo2.png";
import logInImage from "../assets/img/logInImage.jpg";

import { useMemberStore } from "../store/member";

const Login = () => {
  // Utils
  const { loginMember } = useMemberStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");
  const colorMode = useColorMode();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newMember, setNewMember] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Services
  useEffect(() => {
    const loginMessage = searchParams.get("message");
    if (loginMessage === "Session Expired") {
      toast({
        title: "Error",
        description: "Session expired, please log in again",
        status: "error",
        isClosable: true,
      });
    } else if (loginMessage === "Password reset successfully") {
      toast({
        title: "Success",
        description: "Password reset successfully, please log in again",
        status: "success",
        isClosable: true,
      });
    } else if (loginMessage === "Token is invalid") {
      toast({
        title: "Error",
        description: "Token is invalid or expired",
        status: "error",
        isClosable: true,
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentErrors = {
      email: !newMember.email,
      password: !newMember.password,
    };

    setErrors(currentErrors);

    const { success, message, role } = await loginMember(newMember);

    if (success) {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
      setNewMember({
        email: "",
        password: "",
      });
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
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
            direction={{ base: "row", lg: "row" }}
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
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Password
                </FormLabel>
                <InputGroup size="lg" mb="24px">
                  <Input
                    fontSize="sm"
                    ms="4px"
                    type={showPassword ? "text" : "password"}
                    mb="24px"
                    size="lg"
                    placeholder="Your password"
                    name="password"
                    value={newMember.password}
                    onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                    borderColor={errors.password ? "red.500" : "gray.200"}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? "Hide old password" : "Show old password"}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={togglePasswordVisibility}
                      variant="ghost"
                    />
                  </InputRightElement>
                </InputGroup>
                <Button
                  fontSize="14px"
                  variant="dark"
                  fontWeight="bold"
                  w="100%"
                  h="45"
                  onClick={handleSubmit}
                >
                  Log In
                </Button>
              </FormControl>
              <Text
                fontSize="sm"
                color={textColor}
                as={Link}
                to="/login/forgotpassword"
                fontWeight="bold"
                mt="22px"
              >
                Forgot password?
              </Text>
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
export default Login;
