import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

// Components
import Error from "../../components/utils/Error";
import Loading from "../../components/utils/Loading";
import UserPreview from "../../components/profiles/UserPreview";
import Profile from "../../components/profiles/Profile";

// Hooks
import useFetchUsers from "../../hooks/useFetchUsers";

// assets
import FriendLogo from "../../assets/friends.svg";

export default function UserPage() {
  // Retreive the list of users.
  const { error, fetchUsers, isLoading, globalUsers } = useFetchUsers();
  const [parsedUsers, setParsedUsers] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const onlineUsers = useOutletContext();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const onlineSet = new Set(onlineUsers.map((info) => info.user.username)); // Hashset.
    const tempArr = [];
    let candidates = [];

    if (showFriends) {
      const friendSet = new Set(currentUser.friends);
      globalUsers.forEach((user) => {
        if (friendSet.has(user._id)) {
          candidates.push(user);
        }
      });
    } else {
      candidates = globalUsers;
    }

    candidates.forEach((user) => {
      if (onlineSet.has(user.username)) {
        tempArr.push({ user, online: true });
      } else {
        tempArr.push({ user, online: false });
      }
    });

    tempArr.sort((k1, k2) => {
      if (k1.online && !k2.online) return -1;
      if (!k1.online && k2.online) return 1;
      return k1.user.username.localeCompare(k2.user.username);
    });

    setParsedUsers(tempArr);
  }, [globalUsers, onlineUsers, showFriends, currentUser._id]);

  return (
    <main className="grid h-full" style={{ gridTemplateColumns: "1fr 2.5fr" }}>
      <section className="min-w-96 flex">
        <div className="bg-white z-1 flex-grow p-6 shadow-2xl shadow-indigo-200 border border-gray-200">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Find or start a conversation"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          />

          {/* Friends toggle */}
          <div
            className={`w-full px-5 py-2 flex gap-5 items-center rounded-lg cursor-pointer transition-all duration-300 transform ${
              showFriends ? "bg-indigo-200" : ""
            } hover:bg-indigo-200`}
            onClick={() => setShowFriends((prevState) => !prevState)}
          >
            <img
              src={FriendLogo}
              alt="Friends Logo"
              className="w-10 h-10"
              draggable={false}
            />
            <p className="font-semibold">Friends</p>
          </div>

          <hr className="my-2 border-gray-300" />

          {/* User List */}
          <div>
            {error && <Error error={error} redirect={true} />}
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loading />
              </div>
            ) : (
              <div className="transition-all">
                {parsedUsers.map((userInfo) => (
                  <UserPreview key={userInfo.user._id} userInfo={userInfo} onClick={() => setSelectedUser(userInfo)}/>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <section>
        {selectedUser ? (<Profile user={selectedUser.user}></Profile>) : (<></>)}
      </section>
    </main>
  );
}
