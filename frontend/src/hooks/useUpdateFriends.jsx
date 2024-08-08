import { useState } from "react";
import { fetchPath, fetchWithCredentials } from "../utils";

const useUpdateFriends = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateFriends = async (friendId, update=true) => {
    setIsLoading(true);
    setError(null);

    const response = await fetchWithCredentials(fetchPath(`/users/friends/${friendId}`), {
      method: update ? "POST" : "DELETE",
    });

    const json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.message);
    } else {
      setError(null);
    }
  };
  return { error, updateFriends, isLoading };
};

export default useUpdateFriends;
