import { Outlet } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext";
// import ThemeContextProvider from "../contexts/ThemeContext.jsx";
import Navbar from "../components/Navbar.jsx";
import { RotatingLines } from "react-loader-spinner";
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
    return (
      <RotatingLines
        visible={true}
        height="16"
        width="16"
        strokeColor="blue"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    );
  }

  return (
    <div className="flex h-screen">
      {/* Navigation bar */}
      <section className="h-full w-18 bg-gray-200 flex-shrink-0 sticky top-0">
        <Navbar />
      </section>
      {/* Main content */}
      <section className="flex-grow overflow-auto">
        <Outlet />
      </section>
    </div>
  );
}
