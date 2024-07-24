import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserContextProvider from "./contexts/UserContext.jsx";
import "./index.css";

import Root from "./pages/Root.jsx";
import Chatroom from "./pages/Chatroom.jsx";
import Homepage from "./pages/Homepage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/",
          element: <Homepage />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
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
