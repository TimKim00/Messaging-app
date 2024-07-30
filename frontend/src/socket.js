import { io } from "socket.io-client";

const URL = "http://localhost:3000";

export const socket = io(URL, {
  secure: true,
  transports: ["websocket"],
  autoConnect: false,
});