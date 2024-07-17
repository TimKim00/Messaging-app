import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext(null);

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_VALID":
      return { ...state, user: action.payload };
    case "AUTH_INVALID":
      return { ...state, user: null };
    case "AUTH_UPDATE":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "AUTH_VALID", payload: user });
    }

    dispatch({ type: "AUTH_READY" });
  }, []);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.any,
};

export default UserContextProvider;
