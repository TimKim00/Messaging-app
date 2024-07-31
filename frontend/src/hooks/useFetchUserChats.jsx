import { useState } from "react";
import { fetchPath, fetchWithCredentials } from "../utils";
import { socket } from "../socket";

const useFetchUserChats = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);

  const fetchChatInfo = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetchWithCredentials(fetchPath("/chat"), {
      method: "GET",
    });

    const json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.message);
      setChatrooms([]);
    } else {
      setChatrooms(json.allChatrooms);
      json.allChatrooms.forEach((chatroom) => {
        socket.emit("joinRoom", chatroom._id);
      })
      if (json.roomCount === 0) {
        setError("You have no messages!");
      } else {
        setError(null);
      }
    }
  };
  return { error, fetchChatInfo, isLoading, chatrooms, setChatrooms };
};

export default useFetchUserChats;
