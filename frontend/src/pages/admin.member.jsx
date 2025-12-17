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
  Select,
  Badge,
} from "@chakra-ui/react";
import { FaPen, FaBan, FaCheck } from "react-icons/fa";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar.admin";
import CustomModal from "../components/Modal";
import Footer from "../components/Footer";

import { useMemberStore } from "../store/member";

const AdminMember = () => {
  // Utils
  const { members, createMember, fetchMember, updateMember, setStatusMember } = useMemberStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMember, setNewMember] = useState({
    role: "",
    name: "",
    email: "",
    identityNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedMemberName, setSelectedMemberName] = useState(null);
  const [selectedMemberPid, setSelectedMemberPid] = useState(null);
  const [selectedMemberStatus, setSelectedMemberStatus] = useState(null);

  const handleSearchChange = (member) => {
    setSearchQuery(member.target.value.toLowerCase());
  };

  const handleEditClick = (member) => {
    setNewMember({
      role: member.role,
      name: member.name,
      email: member.email,
      identityNumber: member.identityNumber,
    });
    setErrors({});
    setIsEditing(true);
    setEditingMemberId(member._id);
  };

  const handleCancelEdit = () => {
    setNewMember({
      role: "",
      name: "",
      email: "",
      identityNumber: "",
    });
    setErrors({});
    setIsEditing(false);
    setEditingMemberId(null);
  };

  const openSetStatusModal = (name, pid, status) => {
    setSelectedMemberName(name);
    setSelectedMemberPid(pid);
    setSelectedMemberStatus(status);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInputValue("");
    setSelectedMemberName(null);
    setSelectedMemberPid(null);
    setSelectedMemberStatus(null);
  };

  // Services
  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  const handleSubmit = async () => {
    const currentErrors = {
      role: !newMember.role,
      name: !newMember.name,
      email: !newMember.email,
      identityNumber: !newMember.identityNumber,
    };

    setErrors(currentErrors);

    if (isEditing && editingMemberId) {
      // Update member
      const { success, message } = await updateMember(editingMemberId, newMember);

      if (success) {
        toast({
          title: "Success",
          description: "Member updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        setEditingMemberId(null);
        setNewMember({
          role: "",
          name: "",
          email: "",
          identityNumber: "",
        });
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          isClosable: true,
        });
      }
    } else {
      // Create new member
      const { success, message } = await createMember(newMember);

      if (success) {
        toast({
          title: "Success",
          description: message,
          status: "success",
          isClosable: true,
        });
        setNewMember({
          role: "",
          name: "",
          email: "",
          identityNumber: "",
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

  const handleStatusMember = async (pid, currentStatus) => {
    if (!selectedMemberName) return;
    const newStatus = !currentStatus;

    if (inputValue !== selectedMemberName) {
      toast({
        title: "Error",
        description: "Input does not match the member name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await setStatusMember(pid, currentStatus);

    if (success) {
      toast({
        title: "Success",
        description: newStatus ? "Member has been activated" : "Member has been deactivated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsOpen(false);
      setInputValue("");
      setSelectedMemberName(null);
      setSelectedMemberPid(null);
      setSelectedMemberStatus(null);
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
          alignItems={{ base: "center", xl: "start" }}
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
                Member List
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
                      Name & Email
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Member ID
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Identity Number
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Role
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Registered Date
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
                  {members
                    .filter((member) => {
                      const createdAt = new Date(member.createdAt);

                      const formattedRegisteredDate = createdAt
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                        .toLowerCase();

                      const statusText = member.status ? "active" : "inactive";

                      return (
                        member.name.toLowerCase().includes(searchQuery) ||
                        member.email.toLowerCase().includes(searchQuery) ||
                        member.memberId.toLowerCase().includes(searchQuery) ||
                        member.identityNumber.toLowerCase().includes(searchQuery) ||
                        member.role.toLowerCase().includes(searchQuery) ||
                        formattedRegisteredDate.includes(searchQuery.toLowerCase()) ||
                        statusText.includes(searchQuery.toLowerCase())
                      );
                    })
                    .map((member) => {
                      return (
                        <Tr key={member._id} _hover={{ backgroundColor: hoverColor }}>
                          <Td
                            borderColor={borderColor}
                            width={{ base: "100px", xl: "300px" }}
                            p="0px"
                          >
                            <Flex direction="row">
                              <Image
                                src={
                                  member.profileImage &&
                                  member.profileImage !== "-" &&
                                  member.profileImage.trim() !== ""
                                    ? "/public/uploads/" + member.profileImage
                                    : "/public/uploads/profileImage/default.jpg"
                                }
                                alt={member.profileImage}
                                boxSize="50px"
                                objectFit="cover"
                                borderRadius="lg"
                                width="40px"
                                height="40px"
                                mr="10px"
                              />
                              <Flex direction="column" width={{ base: "100px", xl: "300px" }}>
                                <Text fontSize="md" color={textColor} fontWeight="bold">
                                  {member.name}
                                </Text>
                                <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                  {member.email}
                                </Text>
                              </Flex>
                            </Flex>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {member.memberId}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {member.identityNumber}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {member.role}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {new Date(member.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Badge
                              colorScheme={member.status ? "green" : "red"}
                              variant="solid"
                              fontSize="0.75rem"
                              fontWeight="bold"
                              borderRadius="md"
                            >
                              {member.status ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Flex direction="row" p="0px" alignItems="center" gap="4">
                              <Flex
                                alignItems="center"
                                gap="1"
                                as="button"
                                onClick={() => handleEditClick(member)}
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
                                onClick={() =>
                                  openSetStatusModal(member.name, member._id, member.status)
                                }
                              >
                                {member.status ? (
                                  <FaBan size="14" color="#E53E3E" />
                                ) : (
                                  <FaCheck size="14" color="#38A169" />
                                )}
                                <Text
                                  fontSize="14px"
                                  color={member.status ? "#E53E3E" : "#38A169"}
                                  fontWeight="bold"
                                >
                                  {member.status ? "Deactivate" : "Activate"}
                                </Text>
                              </Flex>
                              {/* Modal Set Status */}
                              <CustomModal
                                isOpen={isOpen}
                                onClose={handleClose}
                                title="Set Status Member"
                                bodyContent={
                                  <p>
                                    To {selectedMemberStatus ? "deactivate" : "activate"} the member
                                    named{" "}
                                    <span style={{ fontWeight: "bold" }}>{selectedMemberName}</span>
                                    , type the name to confirm.
                                  </p>
                                }
                                modalBgColor="blackAlpha.400"
                                modalBackdropFilter="blur(1px)"
                                inputValue={inputValue}
                                onInputChange={(e) => setInputValue(e.target.value)}
                                onConfirm={() =>
                                  handleStatusMember(selectedMemberPid, selectedMemberStatus)
                                }
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
                {isEditing ? "Edit Member" : "Add New Member"}
              </Text>
              <FormControl>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Role
                </FormLabel>
                <Select
                  fontSize="sm"
                  ms="4px"
                  mb="24px"
                  size="lg"
                  placeholder="Select Role"
                  name="role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  borderColor={errors.role ? "red.500" : "gray.200"}
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </Select>
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
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  borderColor={errors.name ? "red.500" : "gray.200"}
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
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  borderColor={errors.email ? "red.500" : "gray.200"}
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
                  value={newMember.identityNumber}
                  onChange={(e) => setNewMember({ ...newMember, identityNumber: e.target.value })}
                  borderColor={errors.identityNumber ? "red.500" : "gray.200"}
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
export default AdminMember;
