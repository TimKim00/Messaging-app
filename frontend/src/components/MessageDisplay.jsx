import PropTypes from "prop-types";
import format from "date-fns/format";
import Loading from "./Loading";

// images
import DefaultProfile from "../assets/defaultProfile.png";

const MessageBubble = ({ message, isCurrentUser, user, isFirst }) => (
  <div
    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-1`}
  >
    {isCurrentUser && (
      <span className="flex justify-between items-center text-xs text-gray-600 mr-2">
        {format(new Date(message.createTime), "p")}
      </span>
    )}
    <div
      className={`relative inline-block ${
        isCurrentUser
          ? "bg-blue-500 text-white text-right"
          : "bg-gray-300 text-gray-900 text-left"
      } px-4 pt-1 pb-2 rounded-lg ${
        isFirst
          ? !isCurrentUser
            ? "speech-bubble-other"
            : "speech-bubble"
          : ""
      }`}
    >
      {message.isImage ? (
        <img src={message.message} alt="Message" className="rounded-lg mt-2" />
      ) : (
        <p className="mt-2">{message.message}</p>
      )}
      {isFirst && (
        <div
          className={`absolute ${
            isCurrentUser ? "right-0 mr-2" : "left-0 ml-2"
          } top-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent ${
            isCurrentUser
              ? "border-l-8 border-l-blue-500"
              : "border-r-8 border-r-gray-300"
          } transform -translate-y-1/2`}
        ></div>
      )}
    </div>
    <div className="flex justify-between items-center">
      {!isCurrentUser && (
        <>
          <span className="text-sm font-semibold">{user.name}</span>
          <span className="text-xs text-gray-600 ml-2">
            {format(new Date(message.createTime), "p")}
          </span>
        </>
      )}
    </div>
  </div>
);

MessageBubble.propTypes = {
  message: PropTypes.object.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  isFirst: PropTypes.bool.isRequired,
};

const MessageDisplay = ({ messages, users, isLoading }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const user = users.find((user) => user._id === messages[0].userId);
  const isCurrentUser = messages[0].userId === currentUser._id;

  return (
    <main>
      {/* Display messages. */}
      <section>
        {(isLoading || user === undefined) ? (
          <Loading color="gray"></Loading>
        ) : (
          <div
            className={`flex ${
              isCurrentUser ? "justify-end" : "justify-start"
            } mb-4 px-4`}
          >
            {!isCurrentUser && (
              <div className="flex">
                {console.log(messages)}
                {console.log(users)}
                {console.log(user)}
                <img
                  src={user.profilePicture || DefaultProfile}
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
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

MessageDisplay.propTypes = {
  messages: PropTypes.array.isRequired,
  users: PropTypes.any.isRequired,
  setMessages: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default MessageDisplay;
