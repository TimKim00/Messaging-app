import format from "date-fns/format";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

// Components
import ContextMenu from "./../utils/ContextMenu";

// Hooks
import useDeleteMessage from "../../hooks/useDeleteMessage";

// Assets
import DefaultProfile from "../../assets/defaultProfile.png";

const MessageBox = ({ message, isCurrentUser, user, isFirst, menuState }) => {
  const [contextMenu, setContextMenu] = useState(null);
  const { menuMessage, setMenuMessage } = menuState;
  const messageRef = useRef(null);
  const { deleteMessage } = useDeleteMessage();

  console.log(isFirst);

  const handleContextMenu = (e) => {
    e.preventDefault();
    const sectionRect = messageRef.current.getBoundingClientRect();

    const relativeX = e.clientX - sectionRect.left;
    const relativeY = e.clientY - sectionRect.top;
    const clientX = e.clientX;
    const clientY = e.clientY;

    setMenuMessage(message._id);
    setContextMenu({
      relativeX,
      relativeY,
      clientX,
      clientY,
    });
  };

  const handleClickOutside = (e) => {
    e.preventDefault();
    if (messageRef.current && !messageRef.current.contains(e.target)) {
      setContextMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (menuMessage !== message._id) {
      setContextMenu(null);
    }
  }, [menuMessage, message]);

  const handleMenuClick = (action) => {
    setContextMenu(null);

    if (action === "Delete") {
      deleteMessage(message.roomId, message);
    } else {
      window.alert(`${action} is not implemented yet!`);
    }
  };

  return (
    <div
      ref={messageRef}
      className={`flex relative ${
        isCurrentUser ? "justify-end" : "justify-start"
      } px-4 mb-1 ${isFirst && "mt-3"}`}
    >
      {isCurrentUser ? (
        <>
          <div className="flex">
            {/* Date */}
            <span className="flex justify-between items-center text-xs text-gray-600 mr-2">
              {format(new Date(message.createTime), "p")}
            </span>
            {/* Message */}
            <div
              className={`relative text-pretty inline-block bg-blue-500 text-white text-right px-4 pt-1 pb-2 max-w-xl rounded-lg ${
                isFirst && "speech-bubble"
              }`}
              onContextMenu={handleContextMenu}
            >
              {message.isImage ? (
                <img
                  src={message.message}
                  alt="Message"
                  className="rounded-lg mt-2"
                />
              ) : (
                <p className="mt-1">{message.message}</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex">
            {isFirst ? (
              <div className="flex gap-1">
                <img
                  src={user.coverImage || DefaultProfile}
                  alt={user.name}
                  className="w-10 h-10 rounded-[16px] mr-3"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">{user.username}</span>
                  <div className="flex gap-2">
                    {/* Message */}
                    <div
                      className={`relative text-pretty inline-block bg-gray-300 text-gray-900 text-left px-4 pt-1 pb-2 rounded-lg ${
                        isFirst ? "speech-bubble-other" : ""
                      }`}
                      onContextMenu={handleContextMenu}
                    >
                      {message.isImage ? (
                        <img
                          src={message.message}
                          alt="Message"
                          className="rounded-lg mt-2"
                        />
                      ) : (
                        <p className="mt-1">{message.message}</p>
                      )}
                    </div>
                    {/* Date */}
                    <span className="flex justify-between items-center text-xs text-gray-600 mr-2">
                      {format(new Date(message.createTime), "p")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                {/* Message */}
                <div
                  className={`relative ml-14 text-pretty inline-block bg-gray-300 text-gray-900 text-left px-4 pt-1 pb-2 rounded-lg ${
                    isFirst ? "speech-bubble-other" : ""
                  }`}
                  onContextMenu={handleContextMenu}
                >
                  {message.isImage ? (
                    <img
                      src={message.message}
                      alt="Message"
                      className="rounded-lg mt-2"
                    />
                  ) : (
                    <p className="mt-1">{message.message}</p>
                  )}
                </div>
                {/* Date */}
                <span className="flex justify-between items-center text-xs text-gray-600 mr-2">
                  {format(new Date(message.createTime), "p")}
                </span>
              </div>
            )}
          </div>
        </>
      )}
      {/* <div
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
          <img
            src={message.message}
            alt="Message"
            className="rounded-lg mt-2"
          />
        ) : (
          <p className="mt-1">{message.message}</p>
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
      </div> */}
      {contextMenu && (
        <ContextMenu
          mousePosition={{
            mouseX: contextMenu.clientX,
            mouseY: contextMenu.clientY,
          }}
          relPosition={{
            relX: contextMenu.relativeX,
            relY: contextMenu.relativeY,
          }}
          menus={["Reply", "Delete", "Add Reaction"]}
          onMenuClick={handleMenuClick}
          disabledList={isCurrentUser ? [] : [1]}
        />
      )}
    </div>
  );
};

MessageBox.propTypes = {
  message: PropTypes.object.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  isFirst: PropTypes.bool.isRequired,
  menuState: PropTypes.any,
};

export default MessageBox;
