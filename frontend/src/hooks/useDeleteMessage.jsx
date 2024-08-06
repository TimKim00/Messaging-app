import { useState } from "react";
import { fetchPath, fetchWithCredentials } from "../utils";
import { socket } from "../socket";

const useDeleteMessage = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const deleteMessage = async (roomId, message) => {
    setIsLoading(true);
    setError(null);

    const response = await fetchWithCredentials(fetchPath(`/chat/${roomId}/${message._id}`), {
      method: "DELETE",
    });

    const json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.error);
    } else {
      socket.emit("deleteMessage", {room: roomId, content: message});
      setError(null);
    }
  };
  return { error, deleteMessage, isLoading};
};

export default useDeleteMessage;
