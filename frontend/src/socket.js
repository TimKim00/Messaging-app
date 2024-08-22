import { io } from "socket.io-client";

const URL = "https://messaging-app-drj8.onrender.com";

export const socket = io(URL, {
  secure: true,
  transports: ["websocket"],
  autoConnect: false,
});