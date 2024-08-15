import PropTypes from "prop-types";
import { useRef } from "react";

export default function DateDivider({ date }) {
  const dateRef = useRef(null);

  const handleScrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="flex justify-center mb-10">
      <p ref={dateRef} onClick={() => handleScrollToSection(dateRef)} className="font-light text-zinc-500">{date}</p>
    </div>
  );
}

DateDivider.propTypes = {
  date: PropTypes.any.isRequired,
};
