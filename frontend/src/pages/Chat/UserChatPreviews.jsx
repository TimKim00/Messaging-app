import PropTypes from "prop-types";

// Components
import ChatPreview from "../../components/messages/ChatPreview";
import Loading from "../../components/utils/Loading";
import Error from "../../components/utils/Error";
import Tooltip from "../../components/utils/Tooltip";
import { Link } from "react-router-dom";
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
        } transition-opacity duration-300 h-full`}
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
        {chatrooms.length === 0 && (
          <div className="flex animate-pulse h-full items-center font-light text-center text-3xl text-wrap-pretty">
            <div>Go to{" "} <Tooltip text={<Link to="/users"><p className="text-base">click me!</p></Link>}>users page</Tooltip>  to start messaging!</div>
          </div>
        )}
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
