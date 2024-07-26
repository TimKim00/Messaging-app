import { useUserContext } from "../../hooks/useUserContext";
import { useState, useEffect } from "react";
import useFetchUserChats from "../../hooks/useFetchUserChats";
import UserChatPreviews from "./UserChatPreviews";
import MessageArea from "./MessageArea";

export default function Homepage() {
  const { user } = useUserContext();
  const { error, fetchChatInfo, isLoading, chatrooms } = useFetchUserChats();
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetchChatInfo();
  }, [user.rooms]);

  return (
    <main className="grid" style={{"gridTemplateColumns": "1fr 2fr"}}>
      <UserChatPreviews
        error={error}
        isLoading={isLoading}
        chatrooms={chatrooms}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      ></UserChatPreviews>
      <MessageArea
        error={error}
        isLoading={isLoading}
        chatrooms={chatrooms}
        activeChat={activeChat}
      ></MessageArea>
    </main>
  );
}
