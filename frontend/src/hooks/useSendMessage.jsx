import { useState } from "react";
import { fetchPath, fetchWithCredentials } from "../utils";
import { socket } from "../socket";

const useSendMessage = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = async (roomId) => {
    setIsLoading(true);
    setError(null);

    const response = await fetchWithCredentials(fetchPath(`/chat/${roomId}`), {
      method: "POST",
      body: JSON.stringify({
        messageInfo: {
          message: newMessage,
          userId: JSON.parse(localStorage.getItem("user"))._id,
        },
      }),
    });

    const json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.error);
      setNewMessage(json.messageDocs);
    } else {
      socket.emit("sendMessage", {room: roomId, content: json.messageInfo});
      setNewMessage("");
      setError(null);
    }
  };
  return { error, sendMessage, isLoading, newMessage, setNewMessage };
};

export default useSendMessage;
