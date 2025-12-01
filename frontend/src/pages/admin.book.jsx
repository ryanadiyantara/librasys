import { Box } from "@chakra-ui/react";

import Background from "../components/Background";
import Footer from "../components/Footer";

const AdminBook = () => {
  return (
    <>
      <Background />

      <Box position="relative" p={4}>
        <h1>Hello World!</h1>
        <p>Admin Book</p>
        <Footer />
      </Box>
    </>
  );
};
export default AdminBook;
