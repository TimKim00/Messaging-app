import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { fetchPath } from "../utils";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const { dispatch } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(fetchPath("/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.message);
      dispatch({ type: "AUTH_INVALID" });
    } else {
      const userObject = JSON.stringify(json.user);
      localStorage.setItem("user", userObject);
      console.log(localStorage.getItem("user"));
      dispatch({ type: "AUTH_VALID", payload: userObject });
      setError(null);

      navigate('/');
    }
  };
  return { error, login, isLoading, setIsLoading, setError };
};

export default useLogin;
