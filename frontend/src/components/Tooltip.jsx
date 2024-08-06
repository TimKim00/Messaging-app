import PropTypes from "prop-types";
import { useState } from "react";

export default function Tooltip({
  children,
  text = "Tooltip text",
  direction = "top",
}) {
  const [toggled, setToggled] = useState(false);
  return (
    <div
      className={`tooltip ${toggled ? "toggled" : ""}`}
      onClick={() => setToggled((prevState) => !prevState)}
    >
      {children}
      <div className={`tooltiptext ${direction}`}>{text}</div>
    </div>
  );
}
Tooltip.propTypes = {
  children: PropTypes.any,
  text: PropTypes.string,
  direction: PropTypes.string,
};
