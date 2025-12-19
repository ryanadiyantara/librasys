import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  useColorModeValue,
  VStack,
  Td,
  Select,
  Badge,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import { FaCheckCircle, FaPen } from "react-icons/fa";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar.admin";
import CustomModal from "../components/Modal";
import Footer from "../components/Footer";

import { useLoanStore } from "../store/loan";
import { useMemberStore } from "../store/member";
import { useBookStore } from "../store/book";

const AdminLoan = () => {
  // Utils
  const { loans, createLoan, fetchLoan, updateLoan, returnLoan } = useLoanStore();
  const { members, fetchMember } = useMemberStore();
  const { books, fetchBook } = useBookStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBook, setSearchBook] = useState("");
  const [newLoan, setNewLoan] = useState({
    memberId: "",
    bookIds: [],
    borrowDate: "",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingLoanId, setEditingLoanId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedLoanMember, setSelectedLoanMember] = useState(null);
  const [selectedLoanPid, setSelectedLoanPid] = useState(null);

  const handleSearchChange = (loan) => {
    setSearchQuery(loan.target.value.toLowerCase());
  };

  const handleSearchBook = (book) => {
    setSearchBook(book.target.value.toLowerCase());
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "dueDate" && new Date(value) < new Date(newLoan.borrowDate)) {
      toast({
        title: "Error",
        description: "Due date cannot be before Borrow Date.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      e.target.value = "";
      return;
    }
    setNewLoan({ ...newLoan, [name]: value });
  };

  const handleEditClick = (loan) => {
    setNewLoan({
      memberId: loan.memberId._id,
      bookIds: loan.bookIds.map((book) => book._id),
      borrowDate: formatDate(loan.borrowDate),
      dueDate: formatDate(loan.dueDate),
    });
    setErrors({});
    setIsEditing(true);
    setEditingLoanId(loan._id);
  };

  const handleCancelEdit = () => {
    setNewLoan({
      memberId: "",
      bookIds: [],
      borrowDate: "",
      dueDate: "",
    });
    setErrors({});
    setIsEditing(false);
    setEditingLoanId(null);
  };

  const openReturnModal = (title, pid) => {
    setSelectedLoanMember(title);
    setSelectedLoanPid(pid);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInputValue("");
    setSelectedLoanMember(null);
    setSelectedLoanPid(null);
  };

  // Services
  useEffect(() => {
    fetchLoan();
    fetchMember();
    fetchBook();
  }, [fetchLoan, fetchMember, fetchBook]);

  const handleSubmit = async () => {
    const currentErrors = {
      memberId: !newLoan.memberId,
      bookIds: !newLoan.bookIds || newLoan.bookIds.length === 0,
      borrowDate: !newLoan.borrowDate,
      dueDate: !newLoan.dueDate,
    };

    setErrors(currentErrors);

    if (isEditing && editingLoanId) {
      // Update loan
      const { success, message } = await updateLoan(editingLoanId, newLoan);

      if (success) {
        toast({
          title: "Success",
          description: "Loan updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        setEditingLoanId(null);
        setNewLoan({
          memberId: "",
          bookIds: [],
          borrowDate: "",
          dueDate: "",
        });
        setSearchBook("");
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          isClosable: true,
        });
      }
    } else {
      // Create new loan
      const { success, message } = await createLoan(newLoan);

      if (success) {
        toast({
          title: "Success",
          description: message,
          status: "success",
          isClosable: true,
        });
        setNewLoan({
          memberId: "",
          bookIds: [],
          borrowDate: "",
          dueDate: "",
        });
        setSearchBook("");
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleReturnLoan = async (pid) => {
    if (!selectedLoanMember) return;

    if (inputValue !== selectedLoanMember) {
      toast({
        title: "Error",
        description: "Input does not match the member name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await returnLoan(pid);

    if (success) {
      toast({
        title: "Success",
        description: "Loan returned successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsOpen(false);
      setInputValue("");
      setSelectedLoanMember(null);
      setSelectedLoanPid(null);
    } else {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Background />
      <Sidebar />
      <Box
        w={{
          base: "100%",
          xl: "calc(100% - 275px)",
        }}
        float="right"
        maxWidth="100%"
        overflow="auto"
        position="relative"
        maxHeight="100%"
        transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        transitionDuration=".2s, .2s, .35s"
        transitionProperty="top, bottom, width"
        transitionTimingFunction="linear, linear, ease"
      >
        <Navbar />

        {/* Content */}
        <HStack
          justifyContent="space-between"
          px={{ base: "30px", xl: "40px" }}
          w="100%"
          spacing={{ base: "20px", xl: "30px" }}
          alignItems={"start"}
          minHeight="85vh"
        >
          {/* Table Data */}
          <VStack
            spacing={1}
            alignItems={"left"}
            w="100%"
            p="20px"
            borderRadius="16px"
            bg={bgForm}
            overflowX={{ sm: "scroll", xl: "hidden" }}
          >
            <Flex align="center" justify="space-between" p="6px 0px 22px 0px">
              <Text fontSize="xl" color={textColor} fontWeight="bold">
                Loan List
              </Text>
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
            <Box overflowX="auto">
              <Table variant="simple" color={textColor}>
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th pl="0px" borderColor={borderColor} color="gray.400">
                      Loan ID
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Member Name & Email
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Member ID
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
                    <Th borderColor={borderColor} color="gray.400">
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {loans
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
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {loan.loanId}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Flex direction="column">
                              <Text fontSize="md" color={textColor} fontWeight="bold">
                                {loan.memberId.name}
                              </Text>
                              <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                {loan.memberId.email}
                              </Text>
                            </Flex>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {loan.memberId.memberId}
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
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {new Date(loan.borrowDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {new Date(loan.dueDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
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
                          <Td borderColor={borderColor}>
                            <Flex direction="row" p="0px" alignItems="center" gap="4">
                              <Flex
                                alignItems="center"
                                gap="1"
                                as="button"
                                onClick={() => handleEditClick(loan)}
                                opacity={loan.status ? 0.3 : 1}
                                pointerEvents={loan.status ? "none" : "auto"}
                              >
                                <FaPen size="14" color={iconColor} />
                                <Text fontSize="14px" color={textColor} fontWeight="bold">
                                  Edit
                                </Text>
                              </Flex>
                              <Flex
                                alignItems="center"
                                gap="1"
                                as="button"
                                onClick={() => openReturnModal(loan.memberId.name, loan._id)}
                                opacity={loan.status ? 0.3 : 1}
                                pointerEvents={loan.status ? "none" : "auto"}
                              >
                                <FaCheckCircle size="14" color="#38A169" />
                                <Text fontSize="14px" color="#38A169" fontWeight="bold">
                                  Return
                                </Text>
                              </Flex>
                              {/* Modal Return */}
                              <CustomModal
                                isOpen={isOpen}
                                onClose={handleClose}
                                title="Return Loan"
                                bodyContent={
                                  <p>
                                    To confirm returning the loan for member{" "}
                                    <span style={{ fontWeight: "bold" }}>{selectedLoanMember}</span>
                                    , please type the member's name below.
                                  </p>
                                }
                                modalBgColor="blackAlpha.400"
                                modalBackdropFilter="blur(1px)"
                                inputValue={inputValue}
                                onInputChange={(e) => setInputValue(e.target.value)}
                                onConfirm={() => handleReturnLoan(selectedLoanPid)}
                              />
                            </Flex>
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </Box>
          </VStack>

          {/* Input Form */}
          <VStack>
            <Flex direction="column" w="325px" borderRadius="15px" p="40px" bg={bgForm} mb="60px">
              <Text fontSize="xl" color={textColor} fontWeight="bold" mb="22px">
                {isEditing ? "Edit Loan" : "Add New Loan"}
              </Text>
              <FormControl>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Member Name
                </FormLabel>
                <Select
                  fontSize="sm"
                  ms="4px"
                  mb="24px"
                  size="lg"
                  placeholder="Select Member"
                  name="memberId"
                  value={newLoan.memberId}
                  onChange={(e) => {
                    setNewLoan({ ...newLoan, memberId: e.target.value });
                  }}
                  borderColor={errors.memberId ? "red.500" : "gray.200"}
                >
                  {members
                    .filter((member) => member.status === true)
                    .map((member) => (
                      <option
                        key={member._id}
                        value={member._id}
                        disabled={member.onLoan === true}
                        style={{
                          color: member.onLoan ? "#A0AEC0" : "#1A202C",
                          fontStyle: member.onLoan ? "italic" : "normal",
                        }}
                      >
                        {member.name} - {member.memberId}
                        {member.onLoan && " (On Loan)"}
                      </option>
                    ))}
                </Select>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Search Books
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="text"
                  mb="24px"
                  size="lg"
                  placeholder="Search books.."
                  name="bookIds"
                  value={searchBook}
                  onChange={handleSearchBook}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Selected Books
                </FormLabel>

                {(() => {
                  const query = searchBook.toLowerCase();

                  const selected = books.filter((book) => newLoan.bookIds.includes(book._id));

                  const filtered = searchBook
                    ? books.filter((book) => {
                        return (
                          book.title.toLowerCase().includes(query) ||
                          book.author.toLowerCase().includes(query)
                        );
                      })
                    : [];

                  const mergedList = [
                    ...selected,
                    ...filtered.filter((b) => !newLoan.bookIds.includes(b._id)),
                  ];

                  const noFilteredMatch = searchBook && filtered.length === 0;

                  return (
                    <>
                      <Stack
                        maxH="200px"
                        overflowY="auto"
                        border="1px solid #eee"
                        py={3}
                        px={5}
                        borderRadius="md"
                        mb="24px"
                        borderColor={errors.bookIds ? "red.500" : "gray.200"}
                      >
                        {newLoan.bookIds.length === 0 && searchBook.trim() === "" && (
                          <Text fontSize="sm" color="gray.500">
                            No books selected yet
                          </Text>
                        )}

                        {mergedList.map((book) => (
                          <Checkbox
                            key={book._id}
                            value={book._id}
                            isChecked={newLoan.bookIds.includes(book._id)}
                            onChange={(e) => {
                              const value = e.target.value;
                              const updated = e.target.checked
                                ? [...newLoan.bookIds, value]
                                : newLoan.bookIds.filter((id) => id !== value);
                              setNewLoan({ ...newLoan, bookIds: updated });
                            }}
                            isDisabled={book.available === 0}
                          >
                            {book.title} - {book.author}
                            {book.available === 0 && " (Unavailable)"}
                          </Checkbox>
                        ))}

                        {noFilteredMatch && (
                          <Text fontSize="sm" color="gray.500">
                            No books found
                          </Text>
                        )}
                      </Stack>
                    </>
                  );
                })()}
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Borrow Date
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="date"
                  mb="24px"
                  size="lg"
                  placeholder="Borrow Date"
                  name="borrowDate"
                  value={newLoan.borrowDate}
                  onChange={handleDateChange}
                  borderColor={errors.borrowDate ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Due Date
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="date"
                  mb="24px"
                  size="lg"
                  placeholder="Borrow Date"
                  name="dueDate"
                  value={newLoan.dueDate}
                  onChange={handleDateChange}
                  borderColor={errors.dueDate ? "red.500" : "gray.200"}
                />
                <Button
                  bg="blue.400"
                  fontSize="14px"
                  color="white"
                  fontWeight="bold"
                  w="100%"
                  h="45"
                  mt="24px"
                  onClick={handleSubmit}
                >
                  {isEditing ? "Update" : "Submit"}
                </Button>
                {isEditing && (
                  <Button
                    fontSize="14px"
                    variant="solid"
                    fontWeight="bold"
                    w="100%"
                    h="45"
                    mt="4"
                    onClick={handleCancelEdit}
                    colorScheme="gray"
                  >
                    Cancel
                  </Button>
                )}
              </FormControl>
            </Flex>
          </VStack>
        </HStack>

        <Footer />
      </Box>
    </>
  );
};
export default AdminLoan;
