import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";

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
  const [unreads, setUnreads] = useState(0);

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
      } else {
        setIsChatSelected(false);
      }
    };

    setActive();
    setUnreads(0);
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
          <div>
            <div
              className={`text-base font-semibold ${
                isChatSelected ? "text-indigo-500" : "text-gray-900"
              }`}
            >
              {displayRoomName}
            </div>
            {previewMessage ? (
              <div className="text-xs text-gray-600 truncate">
                {previewMessage.message}
              </div>
            ) : (
              <div className="text-xs text-gray-600 truncate">{`Chat with ${displayRoomName}!`}</div>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end justify-center space-x-2">
            <div className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(chatroom.updateTime), {
                addSuffix: true,
              })}
            </div>
            {unreads !== 0 ? (
              <span className="bg-indigo-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                {unreads}
              </span>
            ) : (
              <span className="w-6 h-6"></span>
            )}
          </div>
        </div>
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
