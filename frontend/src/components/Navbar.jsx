import { useState, useEffect } from "react";
import { useUserContext } from "../hooks/useUserContext";
import { fetchPath } from "../utils";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useUserContext();
  const [toggledIcon, setToggledIcon] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(fetchPath(`/users/profile/${user._id}`), {
          method: "GET",
        });

        const profile = await response.json();
        if (profile.profilePicture) {
          setProfileImage(profile.profilePicture);
        } else {
          setProfileImage(null);
        }
      } catch (error) {
        console.error("Error");
      }
    };
    fetchProfileImage();
  }, [user._id, profileImage]);

  const handleToggle = (iconId) => {
    setToggledIcon(toggledIcon === iconId ? null : iconId);
  };

  const icons = [
    { id: "home", label: "Home", icon: "homeIcon.svg", redirect: "/" },
    { id: "chat", label: "Chat", icon: "Chat.svg", redirect: "/chat" },
    { id: "users", label: "User", icon: "User.svg", redirect: "/user" },
    {
      id: "profile",
      label: "Profile",
      icon: user.profileImage,
      redirect: "/profile",
    },
  ];

  return (
    <div className="nav-icons">
      {icons.map(({ id, icon, redirect }) => (
        <Link key={id} to={redirect} onClick={() => handleToggle(id)}>
          <button className={`nav-icon ${toggledIcon === id ? "toggled" : ""}`}>
            <img src={icon} alt={`${id} icon`} />
          </button>
        </Link>
      ))}
    </div>
  );
};

export default Navbar;
