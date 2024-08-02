import { RotatingLines } from "react-loader-spinner";
import PropTypes from "prop-types";

export default function Loading({
    dim=80,
    color="blue",
    width=5,
    duration=0.75
}) {
  return <RotatingLines
    visible={true}
    height={`${dim}`}
    width={`${dim}`}
    strokeColor={color}
    strokeWidth={`${width}`}
    animationDuration={`${duration}`}
    ariaLabel="rotating-lines-loading"
  />;
}

Loading.propTypes= {
    dim: PropTypes.number,
    color: PropTypes.string,
    width: PropTypes.number,
    duration: PropTypes.number,
}
