import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";
import RoomImage from "./RoomImage";

// images
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
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const users = chatroom.users.filter((user) => user._id !== currentUser._id);

  if (roomName !== "") {
    displayRoomName = roomName;
  } else {
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
      className={`flex items-center px-4 py-6 cursor-pointer ${
        isChatSelected
          ? "bg-blue-100 border-l-4 border-indigo-500"
          : "bg-white border-b"
      } hover:bg-gray-100`}
      onClick={handleClick}
    >
      <div className="mr-3 bg-inherit flex-shrink-0">
        <RoomImage
          users={users}
          borderColor={`${isChatSelected ? "border-blue-100" : "border-white"}`}
        />
      </div>
      <div className="max-w-full flex flex-col basis-full space-y-1 w-full-minus-pixels">
        <style>{`
            .w-full-minus-pixels {
              max-width: calc(100% - 64px);
            }
      `}</style>
        {/* Top */}
        <div className="flex-shrink-0">
          <div className="flex justify-between">
            <div
              className={`text-base font-semibold ${
                isChatSelected ? "text-indigo-500" : "text-gray-900"
              }`}
            >
              {displayRoomName}
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap">
              {formatDistanceToNow(new Date(chatroom.updateTime), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="flex justify-between space-x-6">
          <div className="text-xs text-gray-600 truncate">
            {previewMessage ? (
              <>{previewMessage.message}</>
            ) : (
              <>{`Chat with ${displayRoomName}!`}</>
            )}
          </div>
          {unreads !== 0 ? (
            <span className="bg-indigo-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
              {unreads}
            </span>
          ) : (
            <span className="w-6 h-6 flex-shrink-0"></span>
          )}
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
