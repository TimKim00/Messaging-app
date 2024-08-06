import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

// Components
import Error from "../../components/utils/Error";
import Loading from "../../components/utils/Loading";
import UserPreview from "../../components/messages/UserPreview";

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
      <section className="min-w-96 flex bg-slate-500">
        <div className="m-5 bg-slate-400 flex-grow rounded">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Find or start a conversation"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-11/12 p-2 mx-3.5 mt-6 mb-2 border border-gray-300 rounded"
          />

          {/* Friends toggle */}
          <div
            className={`w-11/12 mx-3.5 py-2 px-5 flex gap-5 items-center rounded ${
              showFriends ? "bg-blue-100" : "bg-inherit"
            }`}
            onClick={() => setShowFriends((prevState) => !prevState)}
          >
            <img src={FriendLogo} alt="" className="w-8" />
            <p className="font-semibold">Friends</p>
          </div>

          <hr className="my-2 border-gray-700 mx-4" />

          {/* User List */}
          <div>
            {error && <Error error={error} />}
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loading />
              </div>
            ) : (
              <>
                {parsedUsers.map((userInfo) => (
                  <UserPreview key={userInfo.user._id} userInfo={userInfo} />
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
