import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Input,
  Image,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  AspectRatio,
} from "@chakra-ui/react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logInImage from "../assets/img/logInImage.jpg";

import { useBookStore } from "../store/book";

const Dashboard = () => {
  // Utils
  const { books, fetchBook } = useBookStore();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (book) => {
    setSearchQuery(book.target.value.toLowerCase());
  };

  // Services
  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  return (
    <>
      {/* Background */}
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
            maxW="1100px"
            zIndex="10"
          >
            <Flex justify="center" mb="25px">
              <Input
                placeholder="Search books..."
                maxW="400px"
                color="gray.800"
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                _placeholder={{ color: "gray.500" }}
                borderRadius="md"
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px #63B3ED",
                }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Flex>

            <Box
              bg="transparent"
              borderRadius="12px"
              p="20px"
              maxW="1100px"
              w="100%"
              maxH="800px"
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
            >
              {/* GRID OF BOOK CARDS */}
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="25px">
                {books
                  .filter((book) => {
                    return (
                      book.title.toLowerCase().includes(searchQuery) ||
                      book.author.toLowerCase().includes(searchQuery) ||
                      book.location.toLowerCase().includes(searchQuery)
                    );
                  })
                  .map((book) => (
                    <Box
                      key={book._id}
                      bg="white"
                      borderRadius="12px"
                      boxShadow="md"
                      overflow="hidden"
                      transition="0.2s"
                      _hover={{ transform: "scale(1.03)" }}
                    >
                      <AspectRatio ratio={1 / 1.5} w="100%">
                        <Image
                          src={
                            book.image && book.image !== "-" && book.image.trim() !== ""
                              ? "/public/uploads/" + book.image
                              : "/public/uploads/bookImage/default.jpg"
                          }
                          objectFit="cover"
                        />
                      </AspectRatio>

                      <VStack align="start" spacing="2" p="15px">
                        <HStack w="100%" justifyContent="space-between">
                          <Text fontSize="md" color="gray.700" fontWeight="bold">
                            {book.title}
                          </Text>
                          <Text fontSize="sm" color="gray.700" fontWeight="normal">
                            {book.location}
                          </Text>
                        </HStack>
                        <HStack w="100%" justifyContent="space-between">
                          <Text fontSize="sm" color="gray.400" fontWeight="normal">
                            {book.author}
                          </Text>
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color={book.available > 0 ? "green.500" : "red.500"}
                          >
                            {book.available > 0 ? "Available" : "Unavailable"}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
              </SimpleGrid>
            </Box>
          </Box>
        </Flex>
      </Flex>

      <Footer />
    </>
  );
};
export default Dashboard;
