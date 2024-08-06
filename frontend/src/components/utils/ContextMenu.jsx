import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const ContextMenu = ({ mousePosition, relPosition, menus, onMenuClick, disabledList=[] }) => {
  const { mouseX, mouseY } = mousePosition;
  const [position, setPosition] = useState(relPosition);
  const menuRef = useRef(null);

  useEffect(() => {
    const adjustPosition = () => {
      const menu = menuRef.current;
      if (menu) {
        const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
        const { offsetWidth: menuWidth, offsetHeight: menuHeight } = menu;

        // Check if the menu overflows the right edge of the viewport
        if (mouseX + menuWidth > windowWidth) {
          setPosition({
            ...relPosition,
            relX: relPosition.relX - menuWidth,
          });
        } else {
          setPosition((prevState) => ({
            ...prevState,
            relX: relPosition.relX,
          }));
        }

        // Check if the menu overflows the bottom edge of the viewport
        if (mouseY + menuHeight > windowHeight) {
          setPosition({
            ...relPosition,
            relY: relPosition.relY - menuHeight,
          });
        } else {
          setPosition((prevState) => ({
            ...prevState,
            relY: relPosition.relY,
          }));
        }
      }
    };

    adjustPosition();
  }, [mouseX, mouseY]);

  return (
    <ul
      ref={menuRef}
      className="absolute z-50 bg-white shadow-lg opacity-90 rounded p-2"
      style={{ top: position.relY, left: position.relX }}
    >
      {menus.map((menu, index) => {
        const disabled = disabledList.includes(index);

        return (
          <li
            key={index}
            className={`p-2 text-sm  ${
              disabled
                ? "text-gray-500 cursor-not-allowed"
                : "hover:bg-gray-200 cursor-pointer"
            }`}
            onClick={() => {
              if (!disabled) {
                onMenuClick(menu);
              }
            }}
            style={{ whiteSpace: "nowrap" }}
          >
            {menu}
          </li>
        );
      })}
    </ul>
  );
};

ContextMenu.propTypes = {
  menus: PropTypes.array,
  mousePosition: PropTypes.shape({
    mouseX: PropTypes.number.isRequired,
    mouseY: PropTypes.number.isRequired,
  }).isRequired,
  relPosition: PropTypes.shape({
    relX: PropTypes.number.isRequired,
    relY: PropTypes.number.isRequired,
  }).isRequired,
  onMenuClick: PropTypes.func.isRequired,
  disabledList: PropTypes.array,
};

export default ContextMenu;
