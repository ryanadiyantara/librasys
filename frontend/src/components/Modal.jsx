import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@chakra-ui/react";

const CustomModal = ({
  isOpen,
  onClose,
  title = "Modal Title",
  bodyContent = null,
  modalBgColor = "none",
  modalBackdropFilter = "blur(1px)",
  inputValue = "",
  onInputChange = null,
  onConfirm = () => {},
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay bg={modalBgColor} backdropFilter={modalBackdropFilter} />
        <ModalContent borderRadius="15px" boxShadow="none" p={4} maxW="400px" w="90%">
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {bodyContent}
            {onInputChange && (
              <Input
                placeholder="Type here..."
                value={inputValue}
                onChange={onInputChange}
                mt={2}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onConfirm}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomModal;
