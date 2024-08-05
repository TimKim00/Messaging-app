import { Outlet } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext";
// import ThemeContextProvider from "../contexts/ThemeContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Loading from "../components/Loading.jsx";
import { useEffect } from "react";
import { socket } from "../socket.js";

export default function Root() {
  const { user, authReady } = useUserContext();

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
      console.log("Online users:", users);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }, [user]);

  if (!authReady) {
    return <Loading dim={16} />;
  }

  return (
    <div className="flex h-lvh">
      {/* Navigation bar */}
      <section className="w-18 bg-gray-200 flex-shrink-0 sticky top-0">
        <Navbar />
      </section>
      {/* Main content */}
      <section className="flex-grow overflow-auto">
        <Outlet />
      </section>
    </div>
  );
}
