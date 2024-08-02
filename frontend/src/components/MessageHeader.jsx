import PropTypes from "prop-types";

// images
import DefaultProfile from "../assets/defaultProfile.png";
import MessageIcon from "../assets/userIcon-message.svg";
import Dots from "../assets/vertical-dots.svg";

export default function MessageHeader({ chatroom }) {
  let displayRoomName = "";

  if (chatroom.name !== "") {
    displayRoomName = chatroom.name;
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

  return (
    <div className="flex justify-between p-2.5 shadow-lg shadow-indigo-200/100">
      <div className="flex">
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
