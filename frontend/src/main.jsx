import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";

import Root from "./pages/Root.jsx";
import Chatroom from "./pages/Chatroom.jsx";
import LoginPage from "./pages/LoginPage.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/rooms",
          element: <Chatroom />,
        },
        {
          path: "/login",
          element: <LoginPage />
        }
      ],
    },
  ],
  { basename: "/fweechat" }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
