import { useState } from "react";
import { fetchPath, fetchWithCredentials } from "../utils";

const useFetchMessages = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(null); 

  const fetchChatInfo = async (messageIds) => {
    setIsLoading(true);
    setError(null);

    const response = await fetchWithCredentials(fetchPath("/chat/getMessages"), {
      method: "POST",
      body: JSON.stringify({messages: messageIds})
    });

    const json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.error);
      setMessages(null);
    } else {
      setMessages(json.messageDocs);
      setError(null);
    }
  };
  return { error, fetchChatInfo, isLoading, messages, setMessages };
};

export default useFetchMessages;
