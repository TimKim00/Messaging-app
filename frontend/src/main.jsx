import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserContextProvider from "./contexts/UserContext.jsx";
import "./index.css";

import Root from "./pages/Root.jsx";
import Homepage from "./pages/Homepage.jsx";
import Chatpage from "./pages/Chat/Chatpage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import SignupPage from "./pages/Auth/SignupPage.jsx";
import ProfilePage from "./pages/Profile/ProfilePage.jsx";
import UserPage from "./pages/Profile/UserPage.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/",
          element: <Homepage />
        },
        {
          path: "/chat",
          element: <Chatpage />,
        },
        {
          path: "/profile",
          element: <ProfilePage />
        },
        {
          path: "/users",
          element: <UserPage />
        }
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <SignupPage />
    }
  ]
  // ,{ basename: "/fweechat" }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </React.StrictMode>
);
