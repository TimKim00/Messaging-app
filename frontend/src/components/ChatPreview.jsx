import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";
import { socket } from "../socket";

// images
import DefaultProfile from "../assets/defaultProfile.png";

export default function ChatPreview({
  roomName,
  chatroom,
  activeId,
  setActiveId,
}) {
  const [isChatSelected, setIsChatSelected] = useState(false);
  const [previewMessage, setPreviewMessage] = useState(null);

  let displayRoomName = "";

  if (roomName !== "") {
    displayRoomName = roomName;
  } else {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const users = chatroom.users.filter((user) => user._id !== currentUser._id);

    users.forEach((user, index) => {
      if (index !== 0) {
        displayRoomName += ", ";
      }
      displayRoomName += user.username;
    });
  }

  useEffect(() => {
    const setActive = () => {
      if (chatroom._id === activeId) {
        setIsChatSelected(true);
        socket.emit("joinRoom", activeId);
      } else {
        setIsChatSelected(false);
      }
    };

    setActive();
  }, [chatroom._id, activeId]);

  useEffect(() => {
    setPreviewMessage(chatroom.recentMessage);
  }, [chatroom]);

  const handleClick = () => {
    setActiveId(chatroom._id);
  };

  return (
    <div
      className={`flex items-center p-4 py-6 cursor-pointer ${
        isChatSelected
          ? "bg-blue-100 border-l-4 border-indigo-500"
          : "bg-white border-b"
      } hover:bg-gray-100`}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 mr-3">
        {chatroom.roomImage !== "" ? (
          <img
            src={chatroom.roomImage}
            alt="Room"
            className="w-10 h-10 rounded-[16px]"
          />
        ) : (
          <img
            src={DefaultProfile}
            alt="Default"
            className="w-10 h-10 rounded-[16px]"
          />
        )}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <div
            className={`text-base font-semibold ${
              isChatSelected ? "text-indigo-500" : "text-gray-900"
            }`}
          >
            {displayRoomName}
          </div>
          <div className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(chatroom.updateTime), {
              addSuffix: true,
            })}
          </div>
        </div>
        {previewMessage ? (
          <div className="text-xs text-gray-600 truncate">
            {previewMessage.message}
          </div>
        ) : (
          <div className="text-xs text-gray-600 truncate">{`Chat with ${displayRoomName}!`}</div>
        )}
      </div>
    </div>
  );
}

ChatPreview.propTypes = {
  roomName: PropTypes.string.isRequired,
  chatroom: PropTypes.object.isRequired,
  activeId: PropTypes.any,
  setActiveId: PropTypes.func.isRequired,
};
