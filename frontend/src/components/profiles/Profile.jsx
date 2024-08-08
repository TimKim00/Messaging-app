import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useFetchProfile from "./../../hooks/useFetchProfile"; // Ensure this hook fetches the profile data
import useUpdateFriends from "../../hooks/useUpdateFriends";
import useCreateChatroom from "../../hooks/useCreateChatroom";
import Loading from "./../utils/Loading"; // Assume there's a Loading component
import Error from "./../utils/Error"; // Assume there's an Error component
import PropTypes from "prop-types";
import DefaultProfile from "./../../assets/defaultProfile.png";
import DefaultBackground from "./../../assets/defaultBackground.jpg";

export default function Profile({ user = "current" }) {
  const { error, fetchChatInfo, isLoading, profile } = useFetchProfile();
  const {
    error: updateError,
    updateFriends,
    isLoading: updateLoading,
  } = useUpdateFriends();
  const {
    error: createError,
    createRoom,
    isLoading: createLoading,
    roomId,
  } = useCreateChatroom();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (user === "current") {
    user = currentUser;
  }

  const [isFriend, setIsFriend] = useState(null);

  useEffect(() => {
    setIsFriend(currentUser.friends.includes(user._id));
  }, [currentUser]);

  useEffect(() => {
    if (user !== null) {
      fetchChatInfo(user._id);
    }
  }, [user._id]);

  const handleAddRemoveFriend = (friendId) => {
    // Handle add/remove friend logic here
    if (currentUser.friends.includes(friendId)) {
      currentUser.friends = currentUser.friends.filter((id) => id != friendId);
      localStorage.setItem("user", JSON.stringify(currentUser));
      // Handle server response.
      updateFriends(friendId, false);

      setIsFriend(false);
    } else {
      currentUser.friends.push(friendId);
      localStorage.setItem("user", JSON.stringify(currentUser));
      // Handle server response.
      updateFriends(friendId, true);

      setIsFriend(true);
    }
  };

  const handleStartMessaging = (friendId) => {
    createRoom({ users: [currentUser._id, friendId] });
  };
  return (
    <div className="flex flex-col items-center p-6 h-full">
      {error && <Error error={error} />}
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <Loading />
        </div>
      )}
      {profile && (
        <div className="w-full max-w-4xl">
          {/* Cover Image */}
          <div className="relative">
            <img
              className="w-full h-64 rounded-t-lg object-cover"
              src={profile.profilePicture || DefaultBackground}
              alt=""
            />
            {/* Profile Picture */}
            <img
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 rounded-full border-4 border-white"
              src={user.coverImage || DefaultProfile}
              alt=""
            />
          </div>
          {/* Profile Details */}
          <div className="bg-white rounded-b-lg shadow-lg p-6 pt-16">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">{user.username}</h1>
              <p className="text-gray-600">{profile.bio}</p>
              <p className="text-gray-600">{profile.email}</p>
              {/* Buttons */}
              <div className="mt-4 flex justify-center space-x-4">
                {currentUser._id !== user._id && (
                  <>
                    <button
                      onClick={() => handleAddRemoveFriend(profile.userId)}
                      className={`px-4 py-2 ${
                        isFriend
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white rounded-lg hover:bg-blue-600 transition-colors`}
                    >
                      {isFriend ? (
                        <>
                          {(updateError && <Error error={updateError} />) ||
                            (updateLoading && (
                              <Loading color="white" dim={16} />
                            )) ||
                            "Remove Friend"}
                        </>
                      ) : (
                        <>
                          {(updateError && <Error error={updateError} />) ||
                            (updateLoading && (
                              <Loading color="white" dim={16} />
                            )) ||
                            "Add Friend"}
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleStartMessaging(profile.userId)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      {(createError && <Error error={createError}></Error>) ||
                        (createLoading && (
                          <Loading color="white" dim={16}></Loading>
                        )) ||
                        (roomId && (
                          <Navigate
                            to={`/chat?${roomId}`}
                            replace={true}
                            reloadDocument
                          ></Navigate>
                        )) ||
                        "Send Message"}
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold">About Me</h2>
              <p className="text-gray-600">
                {profile.bio || "No bio available."}
              </p>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Main Skills</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600">No skills listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    coverImage: PropTypes.string,
    username: PropTypes.string.isRequired,
  }),
};
