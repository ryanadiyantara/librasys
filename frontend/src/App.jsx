import { Box, useColorModeValue } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/login";
import ForgotPassword from "./pages/forgotpassword";
import Dashboard from "./pages/dashboard";
import Loan from "./pages/loan";
import Profile from "./pages/profile";
import ChangePassword from "./pages/changepassword";
import AdminMember from "./pages/admin.member";
import AdminBook from "./pages/admin.book";
import AdminLoan from "./pages/admin.loan";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/login/forgotpassword" element={<ForgotPassword />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/loan" element={<Loan />} />
          <Route path="/changepassword" element={<ChangePassword />} />

          <Route path="/admin/loan" element={<AdminLoan />} />
          <Route path="/admin/member" element={<AdminMember />} />
          <Route path="/admin/book" element={<AdminBook />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
