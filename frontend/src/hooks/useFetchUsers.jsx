import { useState } from "react";
import { fetchPath, fetchWithCredentials } from "../utils";

const useFetchUsers = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalUsers, setGlobalUsers] = useState([]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetchWithCredentials(fetchPath("/users"), {
      method: "GET",
    });

    const json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.message);
      setGlobalUsers([]);
    } else {
      setGlobalUsers(json.allUsers);
      setError(null);
    }
  };
  return { error, fetchUsers, isLoading, globalUsers };
};

export default useFetchUsers;
