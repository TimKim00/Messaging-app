import { useState } from "react";
import { fetchPath, fetchWithCredentials } from "../utils";

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

    console.log(json);

    setIsLoading(false);
    if (!response.ok) {
      setError(json.error);
      setNewMessage("");
    } else {
      setNewMessage(json.messageDocs);
      setError(null);
    }
  };
  return { error, sendMessage, isLoading, newMessage, setNewMessage };
};

export default useSendMessage;
