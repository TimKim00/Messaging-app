import { useState } from "react";
import { fetchPath, fetchWithCredentials } from "../utils";

const useUpdateProfile = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (userId, userInfo) => {
    setIsLoading(true);
    setError(null);

    const response = await fetchWithCredentials(fetchPath(`/users/profile/${userId}`), {
      method: "PATCH",
      body: JSON.stringify({userInfo})
    });

    const json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.message);
    } else {
      setError(null);
    }
  };
  return { error, updateProfile, isLoading };
};

export default useUpdateProfile;
