import { Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// socket
import { socket } from "../socket.js";

// Hooks
import { useUserContext } from "../hooks/useUserContext";
// import ThemeContextProvider from "../contexts/ThemeContext.jsx";

// Components
import Navbar from "../components/Navbar.jsx";
import Loading from "../components/utils/Loading.jsx";

export default function Root() {
  const { user, authReady } = useUserContext();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    // Connect to the socket when the component mounts
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("addUser", user);
    });

    socket.on("getUser", (users) => {
      setOnlineUsers(users);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }, [user]);

  if (!authReady) {
    return <Loading dim={16} />;
  }

  if (!user) {
    return <Navigate to="login" replace={true} reloadDocument></Navigate>
  }

  return (
    <div className="flex h-lvh z-0">
      {/* Navigation bar */}
      <section className="w-18 bg-gray-200 flex-shrink-0 sticky top-0">
        <Navbar />
      </section>
      {/* Main content */}
      <section className="flex-grow overflow-auto">
        <Outlet context={onlineUsers}/>
      </section>
    </div>
  );
}
