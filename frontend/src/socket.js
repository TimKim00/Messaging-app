import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "production"
    ? "https://messaging-app-sigma-seven.vercel.app"
    : "http://localhost:3000";

export const socket = io(URL, {
  secure: true,
  transports: ["websocket"],
  autoConnect: false,
});
