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
import useUpdateProfile from "../../hooks/useUpdateProfile";

export default function Profile({ user = "current" }) {
  const { error, fetchProfile, isLoading, profile } = useFetchProfile();
  const {
    error: updateProfileError,
    updateProfile,
    isLoading: updateProfileLoading,
  } = useUpdateProfile();
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
  const [newProfile, setNewProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsFriend(currentUser.friends.includes(user._id));
  }, [currentUser]);

  useEffect(() => {
    if (user !== null) {
      fetchProfile(user._id);
    }
  }, [user._id]);

  useEffect(() => {
    setNewProfile(profile);
  }, [profile]);

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

  const [save, setSave] = useState(false);

  useEffect(() => {
    if (save) {
      updateProfile(user._id, newProfile);
      fetchProfile(user._id);
      setSave(false);
    }
  }, [save]);

  return (
    <div className="flex flex-col items-center p-6 h-full">
      {error && <Error error={error} />}
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <Loading />
        </div>
      )}
      {profile && (
        <div className="relative w-full max-w-4xl">
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
              <h1 className="text-2xl font-semibold">
                {profile.displayName || user.username}
              </h1>
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
                            to={`/flashchat/chat`}
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
              {isEditing ? (
                <input
                  className="text-gray-600 border-solid border-2 border-gray-300 rounded-lg pl-1"
                  name="bio"
                  defaultValue={profile.bio || ""}
                  onChange={(e) => {
                    setNewProfile((prevState) => {
                      return { ...prevState, bio: e.target.value };
                    });
                  }}
                ></input>
              ) : (
                <p className="text-gray-600">
                  {profile.bio || "No bio available."}
                </p>
              )}
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
          {currentUser._id === user._id && (
            <div className="absolute bottom-0 right-0 p-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <p
                    className="transition-colors duration-300 hover:cursor-pointer hover:text-black text-gray-400"
                    onClick={() => {
                      setSave(true);
                      setIsEditing(false);
                    }}
                  >
                    Save
                  </p>
                  <p
                    className="transition-colors duration-300 hover:cursor-pointer hover:text-black text-gray-400"
                    onClick={() => {
                      setNewProfile(profile);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </p>
                </div>
              ) : (
                <p
                  className="transition-colors duration-300 hover:cursor-pointer hover:text-black text-gray-400"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </p>
              )}
            </div>
          )}
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
