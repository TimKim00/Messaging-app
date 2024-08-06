import PropTypes from "prop-types";
import DefaultProfile from "../assets/defaultProfile.png"; // Adjust the import path as necessary
import { useState } from "react";

export default function UserPreview({ userInfo }) {
  return (
    <div className="flex items-center gap-4 m-3.5 overflow-auto text-lg font-semibold">
      <div className="relative">
        <img
          src={userInfo.user.coverImage || DefaultProfile}
          className="w-10 h-10 rounded-[16px]"
          alt="User Cover"
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
};
