import PropTypes from "prop-types";
import DefaultProfile from "../../assets/defaultProfile.png"; // Adjust the import path as necessary
import { useState } from "react";

export default function UserPreview({ userInfo, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-3.5 py-2 overflow-auto text-lg rounded-lg font-semibold transition duration-500 transform hover:bg-indigo-100 hover:cursor-pointer"
    >
      <div className="relative">
        <img
          src={userInfo.user.coverImage || DefaultProfile}
          className="w-10 h-10 rounded-[16px]"
          alt="User Cover"
          draggable={false}
        />
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
            userInfo.online ? "bg-green-500" : "bg-gray-500"
          }`}
        ></div>
      </div>
      {userInfo.user.username}
    </div>
  );
}

UserPreview.propTypes = {
  userInfo: PropTypes.shape({
    user: PropTypes.shape({
      _id: PropTypes.string,
      coverImage: PropTypes.string,
      username: PropTypes.string,
    }),
    online: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
