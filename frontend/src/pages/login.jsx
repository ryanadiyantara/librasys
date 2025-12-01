import { useState } from "react";
import { useUserStore } from "../store/user";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // Utils
  const { loginUser } = useUserStore();

  const toast = useToast();
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Services
  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentErrors = {
      email: !newUser.email,
      password: !newUser.password,
    };

    setErrors(currentErrors);

    const { success, message } = await loginUser(newUser);

    if (success) {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
      setNewUser({
        email: "",
        password: "",
      });
      setTimeout(() => {
        navigate("/dashboard");
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
      <h1>Hello World!</h1>
      <p>Login</p>

      <form>
        <div>
          <label>Email:</label>
          <br />
          <input
            type="text"
            placeholder="Enter email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Password:</label>
          <br />
          <input
            type="password"
            placeholder="Enter password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
        </div>

        <button type="submit" style={{ marginTop: "15px" }} onClick={handleSubmit}>
          Login
        </button>
      </form>
    </>
  );
};
export default Login;
