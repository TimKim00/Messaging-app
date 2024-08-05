import { useState, useEffect } from "react";
import useFetchUsers from "../../hooks/useFetchUsers";
import { socket } from "../../socket";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import FriendLogo from "../../assets/friends.svg";

export default function UserPage() {
  // Retreive the list of users.
  const { error, fetchUsers, isLoading, globalUsers } = useFetchUsers();
  const [parsedUsers, setParsedUsers] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const parseUsers = (onlineUsers) => {
      const onlineSet = new Set(onlineUsers.map((info) => info.user.username)); // Hashset.
      const tempArr = [];

      globalUsers.forEach((user) => {
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

      console.log("Setting parsedUsers:", tempArr); // Debugging log
      setParsedUsers(tempArr);
    };
    console.log("Attaching socket listener for getUser event"); // Debugging log
    socket.emit("getOnlineUsers");

    socket.on("getOnlineUsersResponse", parseUsers);

    return () => {
      console.log("Detaching socket listener for getUser event"); // Debugging log
      socket.off("getOnlineUsersResponse", parseUsers);
    };
  }, [globalUsers]);

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
            {isLoading && <Loading />}
            {parsedUsers.forEach((user) => {(
                <img src={user.coverImage}></img>
            )})}
          </div>
        </div>
      </section>
    </main>
  );
}
