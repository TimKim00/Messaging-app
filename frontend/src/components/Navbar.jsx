import { useState } from "react";
import { useUserContext } from "../hooks/useUserContext";
import { Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import Error from "./Error";

// Icons
import Home from "../assets/logo.svg";
import Message from "../assets/messageIcon.svg";
import UserIcon from "../assets/userIcon.svg";
import DefaultProfile from "../assets/defaultProfile.png";
import LogoutIcon from "../assets/logoutIcon.svg";

const Navbar = () => {
  const { user } = useUserContext();
  const [toggledIcon, setToggledIcon] = useState(null);
  const { error, logout } = useLogout();

  const handleToggle = (iconId) => {
    if (iconId !== toggledIcon) { setToggledIcon(toggledIcon !== iconId ? iconId : null); }
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    await logout();
  };

  const icons = [
    { id: "chat", label: "Chat", icon: Message, redirect: "/chat" },
    { id: "users", label: "User", icon: UserIcon, redirect: "/chat" },
  ];

  return (
    <div className="flex flex-col h-full border-r-2 border-gray-800 bg-gray-900">
      <div className="flex flex-col justify-between h-full py-4">
        <div>
          <Link to="/">
            <button className="home-button px-2 -py-2 ml-1 flex items-center justify-center w-13 h-13">
              <img src={Home} alt="home icon" className="w-12 h-12" onClick={() => handleToggle(null)}/>
            </button>
          </Link>
          <hr className="my-4 border-gray-700 w-3/4 mx-auto" />
          <div>
            <div className="flex flex-col items-center">
              {icons
                .filter((icon) => icon.id !== "home" && icon.id !== "profile")
                .map(({ id, icon, redirect }) => (
                  <Link
                    key={id}
                    to={redirect}
                    onClick={() => handleToggle(id)}
                    className="-ml-5"
                  >
                    <button
                      className={`nav-icon p-2 mx-2 mb-4 w-full h-12 flex items-center justify-center ${
                        toggledIcon === id
                          ? "bg-gradient-to-r from-indigo-600 to-transparent border-l-4 border-indigo-500"
                          : ""
                      }`}
                    >
                      <img
                        src={icon}
                        alt={`${id} icon`}
                        className="w-7 h-7 invert"
                      />
                    </button>
                  </Link>
                ))}
            </div>
            <div className="flex flex-col items-center mt-4 -ml-1">
              <button
                className="logout-button p-2 mb-4 flex items-center justify-center w-12 h-12"
                onClick={handleLogout}
              >
                <img
                  src={LogoutIcon}
                  alt="logout icon"
                  className="w-6 h-6 mx-1 invert"
                />
              </button>
              {error && <Error error={error} redirect={true} />}
            </div>
          </div>
        </div>
        <div>
          <hr className="my-4 border-gray-700 w-3/4 mx-auto" />
          <div className="flex flex-col items-center">
            <Link to={`/profile/${user._id}`}>
              <button className="profile p-2">
                {user.coverImage ? (
                  <img
                    src={user.coverImage}
                    alt="profile"
                    className="rounded-full w-10 h-10"
                  />
                ) : (
                  <img
                    src={DefaultProfile}
                    alt="default profile"
                    className="rounded-full w-10 h-10"
                  />
                )}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
