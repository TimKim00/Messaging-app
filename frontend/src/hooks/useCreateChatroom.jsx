import { useState } from "react";
import { fetchPath, fetchWithCredentials } from "../utils";

const useCreateChatroom = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roomId, setRoomId] = useState(null);

  const createRoom = async (roomInfo) => {
    setIsLoading(true);
    setError(null);

    const response = await fetchWithCredentials(fetchPath("/chat"), {
      method: "POST",
      body: JSON.stringify({roomInfo})
    });

    const json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.message);
      setRoomId(null);
    } else {
      setError(null);
      setRoomId(json.room._id);
    }
  };
  return { error, createRoom, isLoading, roomId };
};

export default useCreateChatroom;
