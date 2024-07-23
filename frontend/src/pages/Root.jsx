import { Outlet, Navigate, Link } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext";
import ThemeContextProvider from "../contexts/ThemeContext.jsx";
import Navbar from "../components/Navbar.jsx";

export default function Root() {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div>
      {/* <ThemeContextProvider> */}
      <Navbar></Navbar>
      <h1>Hello World from root</h1>
      <Outlet />
      {/* </ThemeContextProvider> */}
    </div>
  );
}
