import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { getPath } from "../utils";
import { redirect } from "react-router-dom";

const useLogin = () => {
  const { dispatch } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(getPath("login", true), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.error());
      dispatch({ type: "AUTH_INVALID" });
    } else {
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "AUTH_VALID", payload: json });

      redirect("/");
    }
  };
  return { login, error, isLoading };
};

export default useLogin;
