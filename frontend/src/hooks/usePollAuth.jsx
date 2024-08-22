import { useState } from "react";
import { fetchPath, fetchWithCredentials } from "../utils";

const usePollAuth = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pollAuth = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetchWithCredentials(fetchPath("/auth-status"), {
      method: "GET",
    });

    const json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.message);
    } else {
      setError(null);
    }
  };
  return { error, pollAuth, isLoading };
};

export default usePollAuth;