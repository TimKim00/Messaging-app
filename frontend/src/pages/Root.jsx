import React from "react";
import { Outlet } from "react-router-dom";
import UserContextProvider from "../contexts/UserContext.jsx";
import ThemeContextProvider from "../contexts/ThemeContext.jsx";

export default function Root() {
  return (
    <UserContextProvider>
      {/* <ThemeContextProvider> */}
        <div>
          <h1>Hello World from root</h1>
          <Outlet />
        </div>
      {/* </ThemeContextProvider> */}
    </UserContextProvider>
  );
}
