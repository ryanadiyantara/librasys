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
  Image,
} from "@chakra-ui/react";
import { FaPen, FaTrash } from "react-icons/fa";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar.admin";
import CustomModal from "../components/Modal";
import Footer from "../components/Footer";

import { useBookStore } from "../store/book";

const AdminBook = () => {
  // Utils
  const { books, createBook, fetchBook, updateBook, deleteBook } = useBookStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");
  const [searchQuery, setSearchQuery] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publisher: "",
    year: "",
    category: "",
    stock: "",
    available: "",
    location: "",
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedBookTitle, setSelectedBookTitle] = useState(null);
  const [selectedBookPid, setSelectedBookPid] = useState(null);

  const handleSearchChange = (book) => {
    setSearchQuery(book.target.value.toLowerCase());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedType = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (file) {
      const fileTypeValid = allowedType.some((type) => file.type === type);
      if (!fileTypeValid) {
        toast({
          title: "Error",
          description: "The file must be in JPG, JPEG, or PNG format.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        e.target.value = "";
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "The file size must not exceed 5 MB.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        e.target.value = "";
        return;
      }

      setNewBook({ ...newBook, image: file });
    }
  };

  const handleEditClick = (book) => {
    setNewBook({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      year: book.year,
      category: book.category,
      stock: book.stock,
      available: book.available,
      location: book.location,
      image: book.image,
    });
    setErrors({});
    setIsEditing(true);
    setEditingBookId(book._id);
  };

  const handleCancelEdit = () => {
    setNewBook({
      title: "",
      author: "",
      publisher: "",
      year: "",
      category: "",
      stock: "",
      available: "",
      location: "",
    });
    document.querySelector('input[type="file"]').value = "";
    setErrors({});
    setIsEditing(false);
    setEditingBookId(null);
  };

  const openDeleteModal = (title, pid) => {
    setSelectedBookTitle(title);
    setSelectedBookPid(pid);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInputValue("");
    setSelectedBookTitle(null);
    setSelectedBookPid(null);
  };

  // Services
  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const handleSubmit = async () => {
    const currentErrors = {
      title: !newBook.title,
      stock: !newBook.stock,
      available: !newBook.available,
    };

    setErrors(currentErrors);

    if (isEditing && editingBookId) {
      // Update book
      const { success, message } = await updateBook(editingBookId, newBook);

      if (success) {
        toast({
          title: "Success",
          description: "Book updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        setEditingBookId(null);
        setNewBook({
          title: "",
          author: "",
          publisher: "",
          year: "",
          category: "",
          stock: "",
          available: "",
          location: "",
          image: "",
        });
        document.querySelector('input[type="file"]').value = "";
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          isClosable: true,
        });
      }
    } else {
      // Create new book
      const { success, message } = await createBook(newBook);

      if (success) {
        toast({
          title: "Success",
          description: message,
          status: "success",
          isClosable: true,
        });
        setNewBook({
          title: "",
          author: "",
          publisher: "",
          year: "",
          category: "",
          stock: "",
          available: "",
          location: "",
          image: "",
        });
        document.querySelector('input[type="file"]').value = "";
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

  const handleDeleteBook = async (pid) => {
    if (!selectedBookTitle) return;

    if (inputValue !== selectedBookTitle) {
      toast({
        title: "Error",
        description: "Input does not match the book title.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await deleteBook(pid);

    if (success) {
      toast({
        title: "Success",
        description: "Book deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsOpen(false);
      setInputValue("");
      setSelectedBookTitle(null);
      setSelectedBookPid(null);
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
                Book List
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
                      Cover
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Title & Author
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Publisher & Year
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Category
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Location
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Available
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Stock
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {books
                    .filter((book) => {
                      return (
                        book.title.toLowerCase().includes(searchQuery) ||
                        book.author.toLowerCase().includes(searchQuery) ||
                        book.publisher.toLowerCase().includes(searchQuery) ||
                        book.year.toLowerCase().includes(searchQuery) ||
                        book.category.toLowerCase().includes(searchQuery) ||
                        book.location.toLowerCase().includes(searchQuery)
                      );
                    })
                    .map((book) => {
                      return (
                        <Tr key={book._id} _hover={{ backgroundColor: hoverColor }}>
                          <Td borderColor={borderColor} p="0px">
                            <Image
                              src={
                                book.image && book.image !== "-" && book.image.trim() !== ""
                                  ? "/public/uploads/" + book.image
                                  : "/public/uploads/bookImage/default.jpg"
                              }
                              alt={book.image}
                              boxSize="50px"
                              objectFit="cover"
                              borderRadius="none"
                              width="60px"
                              height="90px"
                              mt="5px"
                              mb="5px"
                            />
                          </Td>
                          <Td borderColor={borderColor}>
                            <Flex direction="column">
                              <Text fontSize="md" color={textColor} fontWeight="bold">
                                {book.title}
                              </Text>
                              <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                {book.author}
                              </Text>
                            </Flex>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Flex direction="column">
                              <Text fontSize="md" color={textColor} fontWeight="bold">
                                {book.publisher}
                              </Text>
                              <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                {book.year}
                              </Text>
                            </Flex>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {book.category}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {book.location}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {book.available}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {book.stock}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Flex direction="row" p="0px" alignItems="center" gap="4">
                              <Flex
                                alignItems="center"
                                gap="1"
                                as="button"
                                onClick={() => handleEditClick(book)}
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
                                onClick={() => openDeleteModal(book.title, book._id)}
                              >
                                <FaTrash size="14" color="#E53E3E" />
                                <Text fontSize="14px" color="#E53E3E" fontWeight="bold">
                                  Delete
                                </Text>
                              </Flex>
                              {/* Modal Delete */}
                              <CustomModal
                                isOpen={isOpen}
                                onClose={handleClose}
                                title="Delete Book"
                                bodyContent={
                                  <p>
                                    To delete a book titled{" "}
                                    <span style={{ fontWeight: "bold" }}>{selectedBookTitle}</span>,
                                    type the title to confirm.
                                  </p>
                                }
                                modalBgColor="blackAlpha.400"
                                modalBackdropFilter="blur(1px)"
                                inputValue={inputValue}
                                onInputChange={(e) => setInputValue(e.target.value)}
                                onConfirm={() => handleDeleteBook(selectedBookPid)}
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
                {isEditing ? "Edit Book" : "Add New Book"}
              </Text>
              <FormControl>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Title
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="text"
                  mb="24px"
                  size="lg"
                  placeholder="Title of the Book"
                  name="title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  borderColor={errors.title ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Author
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="text"
                  mb="24px"
                  size="lg"
                  placeholder="Author of the Book"
                  name="author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  borderColor={errors.author ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Publisher
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="text"
                  mb="24px"
                  size="lg"
                  placeholder="Publisher of the Book"
                  name="publisher"
                  value={newBook.publisher}
                  onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                  borderColor={errors.publisher ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Year
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="number"
                  mb="24px"
                  size="lg"
                  placeholder="Year of Publication"
                  name="year"
                  value={newBook.year}
                  onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                  borderColor={errors.year ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Category
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="text"
                  mb="24px"
                  size="lg"
                  placeholder="Category of the Book"
                  name="category"
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  borderColor={errors.category ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Stock
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="number"
                  mb="24px"
                  size="lg"
                  placeholder="Stock Quantity"
                  name="stock"
                  value={newBook.stock}
                  onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
                  borderColor={errors.stock ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Available
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="number"
                  mb="24px"
                  size="lg"
                  placeholder="Available Quantity"
                  name="available"
                  value={newBook.available}
                  onChange={(e) => setNewBook({ ...newBook, available: e.target.value })}
                  borderColor={errors.available ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Location
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="text"
                  mb="24px"
                  size="lg"
                  placeholder="Location in Library"
                  name="location"
                  value={newBook.location}
                  onChange={(e) => setNewBook({ ...newBook, location: e.target.value })}
                  borderColor={errors.location ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Image
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="file"
                  size="lg"
                  name="image"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 12px",
                  }}
                  onChange={handleFileChange}
                  borderColor={errors.image ? "red.500" : "gray.200"}
                />
                <Text fontSize="xs" color="red.500" ms="4px" fontStyle="italic">
                  * Accepted file types: JPG, JPEG, PNG.
                </Text>
                <Text fontSize="xs" color="red.500" ms="4px" mb="24px" fontStyle="italic">
                  * Recommended aspect ratio: Portrait (1:1.5)
                </Text>
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
export default AdminBook;
