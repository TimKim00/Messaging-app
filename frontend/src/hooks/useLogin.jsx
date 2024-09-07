import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { fetchPath, fetchWithCredentials } from "../utils";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const { dispatch } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetchWithCredentials(fetchPath("/login"), {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    const json = await response.json();
    console.log(response);
    console.log(json);

    if (!response.ok) {
      setError(json.message);
      dispatch({ type: "AUTH_INVALID" });
      setIsLoading(false);
    } else {
      const userObject = JSON.stringify(json.user);
      const token = json.token;
      localStorage.setItem("user", userObject);
      localStorage.setItem('token', token);
      dispatch({ type: "AUTH_VALID", payload: userObject, expireTime: new Date().getTime });
      setError(null);

      navigate("/flashchat");

      setIsLoading(false);  
      navigate(0);
    }
  };
  return { error, login, isLoading, setIsLoading, setError };
};

export default useLogin;
