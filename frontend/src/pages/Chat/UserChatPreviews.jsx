import PropTypes from "prop-types";

// Components
import ChatPreview from "../../components/messages/ChatPreview";
import Loading from "../../components/utils/Loading";
import Error from "../../components/utils/Error";
export default function UserChatPreviews({
  error,
  chatrooms,
  isLoading,
  activeChat,
  setActiveChat,
}) {
  return (
    <section className="h-full-minus-pixels">
      <style>{`
        .h-full-minus-pixels {
          height: calc(100vh - 64px);
        }
      `}</style>
      {isLoading && (
        <div className="h-full flex items-center justify-center">
          <Loading />
        </div>
      )}
      {error && <Error redirect={true} />}
      <div
        className={`${
          isLoading ? "opacity-50" : "opacity-100"
        } transition-opacity duration-300`}
      >
        {chatrooms &&
          chatrooms
            .sort(function (a, b) {
              return (
                new Date(b.updateTime).getTime() -
                new Date(a.updateTime).getTime()
              );
            })
            .map((chatroom) => (
              <div
                key={chatroom._id}
                className="transform transition-transform duration-500 ease-in-out"
              >
                <ChatPreview
                  roomName={chatroom.name}
                  chatroom={chatroom}
                  activeId={activeChat}
                  setActiveId={setActiveChat}
                />
              </div>
            ))}
      </div>
    </section>
  );
}

UserChatPreviews.propTypes = {
  error: PropTypes.string,
  chatrooms: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  activeChat: PropTypes.any,
  setActiveChat: PropTypes.func.isRequired,
};
