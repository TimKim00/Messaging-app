import { useState, useEffect } from "react";
import UserChatPreviews from "./UserChatPreviews";
import MessageArea from "./MessageArea";

// Hooks
import { useUserContext } from "../../hooks/useUserContext";
import useFetchUserChats from "../../hooks/useFetchUserChats";

export default function ChatPage() {
  const { user } = useUserContext();
  const { error, fetchChatInfo, isLoading, chatrooms, setChatrooms } =
    useFetchUserChats();
  const [activeChat, setActiveChat] = useState(String(window.location.search) || null);

  useEffect(() => {
    fetchChatInfo();
  }, [user.rooms]);

  return (
    <main className="grid" style={{ gridTemplateColumns: "1fr 2.3fr" }}>
      <div className="border-r border-zinc-200 min-w-80">
        <span className="flex p-4 text-xl font-bold border-b-4 border-indigo-500"> Chats</span>
        <UserChatPreviews
          error={error}
          isLoading={isLoading}
          chatrooms={chatrooms}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        ></UserChatPreviews>
      </div>
      <MessageArea
        error={error}
        isLoading={isLoading}
        chatrooms={chatrooms}
        setChatrooms={setChatrooms}
        activeChat={activeChat}
      ></MessageArea>
    </main>
  );
}
