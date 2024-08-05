import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import MessageIntro from "../../components/MessageIntro";
import useFetchMessages from "../../hooks/useFetchMessages";
import MessageDisplay from "../../components/MessageDisplay";
import SendMessage from "../../components/sendMessage";
import MessageHeader from "../../components/MessageHeader";
import { groupMessages } from "../../utils";
import { socket } from "../../socket";

export default function MessageArea({
  roomError,
  chatrooms,
  isRoomLoading,
  setChatrooms,
  activeChat,
}) {
  const [chatroom, setChatroom] = useState(null);
  const { error, fetchChatInfo, isLoading, messages, setMessages } =
    useFetchMessages();

  const messageEndRef = useRef(null);
  const chatroomRef = useRef(chatroom);

  useEffect(() => {
    const setChatInfo = () => {
      const matchingChatroom = chatrooms.find(
        (chatroom) => chatroom._id === activeChat
      );
      if (matchingChatroom) {
        setChatroom(matchingChatroom);
      }
    };
    if (chatroom && activeChat !== chatroom._id) {
      setMessages(null);
    }
    setChatInfo();
  }, [activeChat, chatrooms, chatroom, setMessages]);

  // Effect to fetch messages when chatroom is defined
  useEffect(() => {
    if (chatroom) {
      fetchChatInfo(chatroom.messages);
    }
    chatroomRef.current = chatroom;
  }, [chatroom && chatroom._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  useEffect(() => {
    const handleMessage = (message) => {
      if (message.content.roomId === chatroomRef.current._id) {
        setMessages((prevState) => [...prevState, message.content]);
      }
      const chatroomToUpdate = chatrooms.find(
        (room) => room._id === message.content.roomId
      );
      const updatedChatroom = {
        ...chatroomToUpdate,
        recentMessage: message.content,
        updateTime: new Date(),
        messages: [message.content._id, ...chatroomToUpdate.messages],
      };
      setChatrooms((prevState) => {
        return prevState.map((room) =>
          room._id === chatroomToUpdate._id ? updatedChatroom : room
        );
      });
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [chatrooms]);

  return (
    <section className="h-screen bg-blue-100 shadow-lg shadow-neutral-300">
      {!roomError && (
        <>
          {isLoading && (
            <div className="h-full w-full flex items-center justify-center">
              <Loading />
            </div>
          )}
          {error && <Error error={error} errorHeight={"h-screen"} />}
          <div
            className="grid h-full"
            style={{ gridTemplateRows: "0.4fr 4fr 1fr" }}
          >
            {chatroom === null ? (
              <MessageIntro />
            ) : (
              <>
                <div className="bg-blue-100">
                  <MessageHeader chatroom={chatroom} />
                </div>
                <div className="flex-grow py-4 overflow-y-auto">
                  {messages === null ? (
                    <div className="flex items-center justify-center">
                      <Loading />
                    </div>
                  ) : messages.length === 0 ? (
                    <Error
                      error={"No message to display"}
                      errorHeight={"h-screen"}
                    />
                  ) : (
                    groupMessages(messages).map((messageGroup) => (
                      <MessageDisplay
                        key={messageGroup[0]._id}
                        messages={messageGroup}
                        setMessages={setMessages}
                        users={chatroom.users}
                        isLoading={isLoading && isRoomLoading}
                      />
                    ))
                  )}

                  <div ref={messageEndRef}></div>
                </div>
                {/* Send messages */}
                <SendMessage roomId={chatroom._id} />
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}

MessageArea.propTypes = {
  roomError: PropTypes.string,
  chatrooms: PropTypes.array.isRequired,
  isRoomLoading: PropTypes.bool,
  setChatrooms: PropTypes.func,
  activeChat: PropTypes.any,
};
