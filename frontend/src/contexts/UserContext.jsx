import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext(null);

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_VALID":
      return { ...state, user: action.payload, authReady: true };
    case "AUTH_INVALID":
      return { ...state, user: null, authReady: true };
    case "LOGOUT":
      return {...state, user: null, authReady: false}
    default:
      return {...state, authReady: false};
  }
};

const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authReady: false,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "AUTH_VALID", payload: user});
    } else {
      dispatch({ type: "AUTH_INVALID"});
    }
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
