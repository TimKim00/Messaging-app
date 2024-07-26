import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { RotatingLines } from "react-loader-spinner";
import Error from "../../components/Error";
import MessageIntro from "../../components/MessageIntro";
import useFetchMessages from "../../hooks/useFetchMessages";
import MessageDisplay from "../../components/MessageDisplay";
import SendMessage from "../../components/sendMessage";
import { groupMessages } from "../../utils";

export default function MessageArea({ error, chatrooms, activeChat }) {
  const [chatroom, setChatroom] = useState(null);
  const { mError, fetchChatInfo, mLoading, messages, setMessages } =
    useFetchMessages();

  useEffect(() => {
    const setChatInfo = () => {
      const matchingChatroom = chatrooms.find(
        (chatroom) => chatroom._id === activeChat
      );
      if (matchingChatroom) {
        setChatroom(matchingChatroom);
      }
    };
    setChatInfo();
    setMessages([]);
  }, [activeChat, chatrooms, setMessages]);

  // Effect to fetch messages when chatroom is defined
  useEffect(() => {
    if (chatroom) {
      fetchChatInfo(chatroom.messages);
    }
  }, [chatroom]);
  
  return (
    <section className="h-screen bg-blue-100 shadow-lg shadow-neutral-300">
      {!error && (
        <>
          {mLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <RotatingLines
                visible={true}
                height="80"
                width="80"
                strokeColor="blue"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            </div>
          )}
          {mError && <Error error={mError} errorHeight={"h-screen"} />}
          <div className="grid h-full" style={{ gridTemplateRows: "4fr 1fr" }}>
            {chatroom === null ? (
              <MessageIntro />
            ) : (
              <>
                <div className="flex-grow py-4 overflow-y-auto">
                  {(messages || []).length === 0 ? (
                    <Error
                      error={"No message to display"}
                      errorHeight={"h-screen"}
                    />
                  ) : (
                    groupMessages(messages).map((messageGroup) => (
                      <MessageDisplay
                        key={messageGroup[0]._id}
                        messages={messageGroup}
                        users={chatroom.users}
                      />
                    ))
                  )}
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
  error: PropTypes.string,
  chatrooms: PropTypes.array.isRequired,
  activeChat: PropTypes.any,
};
