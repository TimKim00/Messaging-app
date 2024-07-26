import { RotatingLines } from "react-loader-spinner";
import Error from "../../components/Error";
import PropTypes from "prop-types";
import ChatPreview from "../../components/ChatPreview";

export default function UserChatPreviews({
  error,
  chatrooms,
  isLoading,
  activeChat,
  setActiveChat,
}) {
  return (
    <section>
      {isLoading && (
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
      {error && <Error error={error} errorHeight={"h-screen"} />}
      <div
        className={`${
          isLoading ? "opacity-50" : "opacity-100"
        } transition-opacity duration-300`}
      >
        {chatrooms &&
          chatrooms.map((chatroom) => (
            <ChatPreview
              key={chatroom._id}
              roomName={chatroom.name}
              chatroom={chatroom}
              activeId={activeChat}
              setActiveId={setActiveChat}
            />
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
