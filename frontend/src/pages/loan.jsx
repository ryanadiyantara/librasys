import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  useColorModeValue,
  VStack,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
} from "@chakra-ui/react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import logInImage from "../assets/img/logInImage.jpg";

import { useLoanStore } from "../store/loan";
import { useMemberStore } from "../store/member";

const Profile = () => {
  // Utils
  const { loans, fetchLoan } = useLoanStore();
  const { currentMembers, fetchCurrentMember } = useMemberStore();

  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (loan) => {
    setSearchQuery(loan.target.value.toLowerCase());
  };

  // Services
  useEffect(() => {
    fetchLoan();
    fetchCurrentMember();
  }, [fetchLoan, fetchCurrentMember]);

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
            overflow="hidden"
          >
            {/* Loan Data */}
            <Box
              bg="transparent"
              borderRadius="12px"
              p="20px"
              maxW="1100px"
              w="auto"
              boxShadow="lg"
              mx="auto"
              align="center"
            >
              <Box
                bg={bgForm}
                borderRadius="12px"
                boxShadow="md"
                transition="0.2s"
                _hover={{ transform: "scale(1.03)" }}
              >
                <Flex direction="column" w="100%" borderRadius="15px" p="40px" bg={bgForm}>
                  <Text fontSize="xl" color={textColor} fontWeight="bold" mb="22px">
                    Loan Data
                  </Text>
                  <VStack
                    spacing={1}
                    alignItems={"left"}
                    w="100%"
                    p="20px"
                    borderRadius="16px"
                    bg={bgForm}
                  >
                    <Flex align="right" p="6px 0px 22px 0px">
                      <Box>
                        <Input
                          placeholder="Search on list.."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          size="sm"
                          borderRadius="5px"
                          w={{ base: "85%", md: "100%" }}
                          ml={{ base: "15%", md: "0%" }}
                        />
                      </Box>
                    </Flex>
                    <Box
                      maxH="60vh"
                      overflowY="auto"
                      overflowX="auto"
                      sx={{
                        "&::-webkit-scrollbar": { width: "6px" },
                      }}
                    >
                      <Table variant="simple" color={textColor}>
                        <Thead>
                          <Tr my=".8rem" pl="0px" color="gray.400">
                            <Th pl="0px" borderColor={borderColor} color="gray.400">
                              Loan ID
                            </Th>
                            <Th borderColor={borderColor} color="gray.400">
                              Borrowed Book
                            </Th>
                            <Th borderColor={borderColor} color="gray.400">
                              Borrow Date
                            </Th>
                            <Th borderColor={borderColor} color="gray.400">
                              Due Date
                            </Th>
                            <Th borderColor={borderColor} color="gray.400">
                              Return Date
                            </Th>
                            <Th borderColor={borderColor} color="gray.400">
                              Status
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {loans
                            .filter(
                              (loan) =>
                                currentMembers?._id && loan.memberId._id === currentMembers._id
                            )
                            .filter((loan) => {
                              const borrowDate = new Date(loan.borrowDate);
                              const dueDate = new Date(loan.dueDate);
                              const returnDate = new Date(loan.returnDate);

                              const formattedBorrowDate = borrowDate
                                .toLocaleDateString("en-GB", {
                                  weekday: "long",
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })
                                .toLowerCase();

                              const formattedDueDate = dueDate
                                .toLocaleDateString("en-GB", {
                                  weekday: "long",
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })
                                .toLowerCase();

                              const formattedReturnDate = returnDate
                                .toLocaleDateString("en-GB", {
                                  weekday: "long",
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })
                                .toLowerCase();

                              const bookMatch = loan.bookIds.some(
                                (book) =>
                                  book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  book.author.toLowerCase().includes(searchQuery.toLowerCase())
                              );

                              return (
                                loan.loanId.toLowerCase().includes(searchQuery) ||
                                loan.memberId.name.toLowerCase().includes(searchQuery) ||
                                loan.memberId.email.toLowerCase().includes(searchQuery) ||
                                bookMatch ||
                                formattedBorrowDate.includes(searchQuery.toLowerCase()) ||
                                formattedDueDate.includes(searchQuery.toLowerCase()) ||
                                formattedReturnDate.includes(searchQuery.toLowerCase())
                              );
                            })
                            .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
                            .map((loan) => {
                              const isReturned = loan.returnDate !== null;
                              const isOverdue = !isReturned && new Date() > new Date(loan.dueDate);
                              const isBorrowed = !isReturned && !isOverdue;

                              let statusColor = "gray";
                              let statusText = "Unknown";

                              if (isReturned) {
                                statusColor = "green";
                                statusText = "RETURNED";
                              } else if (isOverdue) {
                                statusColor = "red";
                                statusText = "OVERDUE";
                              } else if (isBorrowed) {
                                statusColor = "yellow";
                                statusText = "BORROWED";
                              }
                              return (
                                <Tr key={loan._id} _hover={{ backgroundColor: hoverColor }}>
                                  <Td borderColor={borderColor} p="0px">
                                    <Text
                                      fontSize="md"
                                      color={textColor}
                                      fontWeight="bold"
                                      minWidth="100%"
                                    >
                                      {loan.loanId}
                                    </Text>
                                  </Td>
                                  <Td borderColor={borderColor}>
                                    <Flex direction="column" gap={1}>
                                      {loan.bookIds.map((book) => (
                                        <Box
                                          key={book._id}
                                          p={2}
                                          bg="gray.200"
                                          borderRadius="md"
                                          boxShadow="sm"
                                          fontSize="sm"
                                        >
                                          <Text fontWeight="bold" color="black">
                                            {book.title}
                                          </Text>
                                          <Text fontSize="xs" color="gray.400">
                                            {book.author}
                                          </Text>
                                        </Box>
                                      ))}
                                    </Flex>
                                  </Td>
                                  <Td borderColor={borderColor}>
                                    <Text
                                      fontSize="md"
                                      color={textColor}
                                      fontWeight="bold"
                                      minWidth="100%"
                                    >
                                      {new Date(loan.borrowDate).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </Text>
                                  </Td>
                                  <Td borderColor={borderColor}>
                                    <Text
                                      fontSize="md"
                                      color={textColor}
                                      fontWeight="bold"
                                      minWidth="100%"
                                    >
                                      {new Date(loan.dueDate).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </Text>
                                  </Td>
                                  <Td borderColor={borderColor}>
                                    <Text
                                      fontSize="md"
                                      color={textColor}
                                      fontWeight="bold"
                                      minWidth="100%"
                                    >
                                      {loan.returnDate
                                        ? new Date(loan.returnDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                          })
                                        : "-"}
                                    </Text>
                                  </Td>
                                  <Td borderColor={borderColor}>
                                    <Badge
                                      colorScheme={statusColor}
                                      variant="solid"
                                      fontSize="0.75rem"
                                      fontWeight="bold"
                                      borderRadius="md"
                                    >
                                      {statusText}
                                    </Badge>
                                  </Td>
                                </Tr>
                              );
                            })}
                        </Tbody>
                      </Table>
                    </Box>
                  </VStack>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Flex>

      <Footer />
    </>
  );
};
export default Profile;
