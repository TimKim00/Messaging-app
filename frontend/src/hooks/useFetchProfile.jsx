import { useState } from "react";
import { fetchPath, fetchWithCredentials } from "../utils";

const useFetchProfile = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const fetchChatInfo = async (userId) => {
    setIsLoading(true);
    setError(null);

    const response = await fetchWithCredentials(
      fetchPath(`/users/profile/${userId}`),
      {
        method: "GET",
      }
    );

    const json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.message);
      setProfile(null);
    } else {
      setProfile(json.profile);
    }
  };
  return { error, fetchChatInfo, isLoading, profile };
};

export default useFetchProfile;
