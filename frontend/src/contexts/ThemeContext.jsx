import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";

export const ThemeContext = createContext(null);

const themeReducer = (state, action) => {
  switch (action.type) {
    case "DARK":
      return { ...state, theme: "dark" };
    case "LIGHT":
      return { ...state, theme: "light" };
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    default:
      return state;
  }
};

const ThemeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, {
    theme: "light",
  });

  useEffect(() => {
    const storedTheme = JSON.parse(localStorage.getItem("theme"));

    if (storedTheme) {
      dispatch({ type: storedTheme === "light" ? "LIGHT" : "DARK" });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", state.theme);
    if (state.theme == "light") {
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.add("dark-theme");
    }
  }, [state.theme]);

  return (
    <ThemeContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeContextProvider.propTypes = {
  children: PropTypes.any,
};

export default ThemeContextProvider;
