import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { fetchPath, fetchWithCredentials } from "../utils";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
  const { dispatch } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const signup = async (username, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetchWithCredentials(fetchPath("/register"), {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    const json = await response.json();

    setIsLoading(false);
    if (response.ok) {
      const userObject = JSON.stringify(json.user);
      localStorage.setItem("user", userObject);
      dispatch({ type: "AUTH_VALID", payload: userObject });
      setError(null);

      navigate("/flashchat");
      navigate(0);
    } else {
        if (json.errors) {
            setError("Invalid credentials provided.");
        } else if (json.status === 409) {
            setError("Duplicate username"); // Change
        }
    }
  };
  return { error, signup, isLoading, setIsLoading, setError };
};

export default useSignup;
