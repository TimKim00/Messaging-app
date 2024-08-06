import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const Error = ({
  error,
  errorHeight,
  errorColor = "text-red-600",
  errorSize = "text-xl",
  redirect = false,
}) => {
  if (redirect) {
    return <Navigate to="/login" replace={true} reloadDocument/>;
  }

  return (
    <div
      className={`flex ${errorHeight} w-full items-center justify-center pt-2`}
    >
      <p className={`text-center ${errorSize} font-bold ${errorColor}`}>
        {" "}
        Error : {error}{" "}
      </p>
    </div>
  );
};

Error.propTypes = {
  error: PropTypes.string.isRequired,
  errorHeight: PropTypes.string,
  errorColor: PropTypes.string,
  errorSize: PropTypes.string,
  redirect: PropTypes.bool,
};

export default Error;
