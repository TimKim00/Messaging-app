import PropTypes from "prop-types";
import Loading from "../utils/Loading";
import MessageBubble from "./MessageBubble";

// images
import DefaultProfile from "../../assets/defaultProfile.png";

const MessageDisplay = ({ messages, users, isLoading, menuState }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const user = users.find((user) => user._id === messages[0].userId);
  const isCurrentUser = messages[0].userId === currentUser._id;

  return (
    <section>
      {isLoading || user === undefined ? (
        <Loading color="gray"></Loading>
      ) : (
        <div
          className={`flex ${
            isCurrentUser ? "justify-end" : "justify-start"
          } mb-4 px-4`}
        >
          {!isCurrentUser && (
            <div className="flex">
              <img
                src={user.coverImage || DefaultProfile}
                alt={user.name}
                className="w-10 h-10 rounded-[16px] mr-3"
              />
              <div>
                <span className="text-sm text-gray-700">{user.username}</span>
                <div className="flex flex-col gap-2">
                  {messages.map((message, index) => (
                    <MessageBubble
                      key={index}
                      message={message}
                      isCurrentUser={false}
                      user={user}
                      isFirst={index === 0}
                      menuState={menuState}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {isCurrentUser && (
            <div className="flex flex-col gap-2">
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  message={message}
                  isCurrentUser={true}
                  user={currentUser}
                  isFirst={index === 0}
                  menuState={menuState}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

MessageDisplay.propTypes = {
  messages: PropTypes.array.isRequired,
  users: PropTypes.any.isRequired,
  setMessages: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  menuState: PropTypes.any,
};

export default MessageDisplay;
