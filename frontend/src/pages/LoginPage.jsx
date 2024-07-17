import { useState } from "react";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  console.log("Hi");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {login, isLoading, error} = useLogin();

  const handleLoginSubmit = async (e)  => {
    e.preventDefault();

    await login(username, password);
  };

  return (
    <>
   
    </>
  )
};

export default LoginPage;