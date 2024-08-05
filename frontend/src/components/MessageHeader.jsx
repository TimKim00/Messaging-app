import PropTypes from "prop-types";
import RoomImage from "./RoomImage";

// images
import MessageIcon from "../assets/userIcon-message.svg";
import Dots from "../assets/vertical-dots.svg";

export default function MessageHeader({ chatroom }) {
  let displayRoomName = "";
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const users = chatroom.users.filter((user) => user._id !== currentUser._id);
  if (chatroom.name !== "") {
    displayRoomName = chatroom.name;
  } else {
    users.forEach((user, index) => {
      if (index !== 0) {
        displayRoomName += ", ";
      }
      displayRoomName += user.username;
    });
  }

  return (
    <div className="flex justify-between p-2.5 shadow-lg shadow-indigo-200/100">
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          <RoomImage users={users} borderColor="border-blue-100"/>
        </div>
        <div className="flex-grow">
          <div className="flex flex-col justify-between gap-1">
            <div className="text-zinc-600 font-semibold">{displayRoomName}</div>
            <img className="w-3" src={MessageIcon} alt="" />
          </div>
        </div>
      </div>
      <div className="w-8 h-auto flex">
        <img src={Dots} alt="" />
      </div>
    </div>
  );
}

MessageHeader.propTypes = {
  chatroom: PropTypes.object.isRequired,
};
