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
import ProfilePage from "./components/profiles/Profile.jsx";
import UserPage from "./pages/Profile/UserPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Homepage />
    },
    {
      path: "/flashchat",
      element: <Root />,
      children: [
        {
          path: "/flashchat",
          element: <Dashboard />
        },
        {
          path: "/flashchat/chat",
          element: <Chatpage />,
        },
        {
          path: "/flashchat/profile",
          element: <ProfilePage />
        },
        {
          path: "/flashchat/users",
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
  // ,{ basename: "/flashchat" }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </React.StrictMode>
);
