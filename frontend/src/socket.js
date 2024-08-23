import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "production"
    ? "https://messaging-app-drj8.onrender.com"
    : "http://localhost:3000";

export const socket = io(URL, {
  secure: true,
  transports: ["websocket"],
  autoConnect: false,
});
