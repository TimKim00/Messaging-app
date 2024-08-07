import PropTypes from "prop-types";

export default function DateDivider({ date }) {
  return (
    <div className="flex justify-center m-10">
      <p className="font-light text-zinc-500">{date}</p>
    </div>
  );
}

DateDivider.propTypes = {
  date: PropTypes.any.isRequired,
};
