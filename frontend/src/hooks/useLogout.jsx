import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { fetchPath } from "../utils";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

const useLogout = () => {
  const { dispatch } = useContext(UserContext);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const logout = async () => {
    setError(null);

    const response = await fetch(fetchPath("/logout"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      socket.disconnect();
      
      dispatch({ type: "AUTH_LOGOUT" });
      setError(null);

      navigate("/login");
      navigate(0);
    }
  };
  return { error, logout};
};

export default useLogout;
