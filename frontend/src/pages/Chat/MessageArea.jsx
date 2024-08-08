import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";

// Hooks
import useFetchMessages from "../../hooks/useFetchMessages";

// Components
import Loading from "../../components/utils/Loading";
import Error from "../../components/utils/Error";
import MessageIntro from "../../components/messages/MessageIntro";
import SendMessage from "../../components/messages/sendMessage";
import MessageHeader from "../../components/messages/MessageHeader";
import MessageBox from "../../components/messages/MessageBox";
import DateDivider from "../../components/messages/DateDivider";

// util functions
import { socket } from "../../socket";

export default function MessageArea({
  roomError,
  chatrooms,
  isRoomLoading,
  setChatrooms,
  activeChat,
}) {
  const [chatroom, setChatroom] = useState(null);
  const [messageDeletedRecently, setmessageDeletedRecently] = useState(false);
  const { error, fetchChatInfo, isLoading, messages, setMessages } =
    useFetchMessages();

  const [menuMessage, setMenuMessage] = useState(null);

  const messageEndRef = useRef(null);
  const chatroomRef = useRef(chatroom);
  const recentDate = useRef(null);
  const lastMessage = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const separateThreshold = 20 * 60 * 1000; // if it has been 20 minutes since last message, we create a new message thread.

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
    if (messageDeletedRecently) {
      setmessageDeletedRecently(false);
    } else {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  // Handle sockets
  useEffect(() => {
    const handleNewMessage = (message) => {
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

    const handleDeleteMessage = (message) => {
      let newRecentMessage = null;
      if (message.content.roomId === chatroomRef.current._id) {
        setMessages((prevState) =>
          prevState.filter((msg) => {
            if (msg._id !== message.content._id) {
              newRecentMessage = msg;
              return true;
            }
            return false;
          })
        );
      }

      const chatroomToUpdate = chatrooms.find(
        (room) => room._id === message.content.roomId
      );

      const newChatroomMessages = chatroomToUpdate.messages.filter(
        (msgId) => msgId != message.content._id
      );

      const updatedChatroom = {
        ...chatroomToUpdate,
        recentMessage: newRecentMessage,
        updateTime: new Date(),
        messages: newChatroomMessages,
      };
      setChatrooms((prevState) => {
        return prevState.map((room) =>
          room._id === chatroomToUpdate._id ? updatedChatroom : room
        );
      });

      setmessageDeletedRecently(true);
    };

    socket.on("receiveMessage", handleNewMessage);
    socket.on("receiveDeletedMessage", handleDeleteMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
      socket.off("receiveDeletedMessage", handleDeleteMessage);
    };
  }, [chatrooms, messages]);

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
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="animate-bounce font-light text-3xl">
                        Start messaging by sending "Hello👋"!
                      </span>
                    </div>
                  ) : (
                    // On development, the first ever message will always not be marked.
                    messages.map((message) => {
                      let isFirst = false;
                      if (
                        lastMessage.current === null ||
                        lastMessage.current.userId !== message.userId ||
                        new Date(message.createTime) -
                          new Date(lastMessage.current.createTime) >=
                          separateThreshold
                      ) {
                        isFirst = true;
                      }

                      console.log(lastMessage.current);

                      const user = chatroom.users.find(
                        (user) => user._id === message.userId
                      );
                      const isCurrentUser = user._id === currentUser._id;

                      const formattedDate = format(
                        message.createTime,
                        "EEEE, MMMM d, yyyy"
                      );

                      const reformat = recentDate.current !== formattedDate;
                      if (reformat) recentDate.current = formattedDate;

                      lastMessage.current = message;

                      return (
                        <div key={message._id} className="">
                          {reformat ? (
                            <DateDivider date={formattedDate}/>
                          ) : (
                            <></>
                          )}
                          <MessageBox
                            message={message}
                            isCurrentUser={isCurrentUser}
                            user={user}
                            isFirst={isFirst}
                            menuState={{ menuMessage, setMenuMessage }}
                          />
                        </div>
                      );
                    })
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
