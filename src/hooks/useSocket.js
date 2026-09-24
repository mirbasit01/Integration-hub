import { io } from "socket.io-client";
import { useEffect } from "react";
import { SOCKET_URL } from "../utils/Environment";

// Socket.io singleton — one instance shared across the whole app
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 3000,
  autoConnect: false, // connect manually so beginners can see it clearly
});

socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id);
  if (socket._walletAddress) {
    socket.emit("joinRoom", { address: socket._walletAddress });
  }
});

socket.on("disconnect", (reason) => console.log("🔴 Socket disconnected:", reason));
socket.on("connect_error", (err) => console.log("❌ Socket error:", err.message));

// Call once wallet is available
socket.joinRoom = (address) => {
  if (!address) return;
  socket._walletAddress = address;
  if (socket.connected) socket.emit("joinRoom", { address });
};

export const getSocket = () => socket;

// Hook to subscribe/unsubscribe events cleanly
export const useSocketEvents = (events) => {
  // eslint-disable-next-line
  useEffect(() => {
    events.forEach(({ eventName, handler }) => socket.on(eventName, handler));
    return () => events.forEach(({ eventName, handler }) => socket.off(eventName, handler));
  }, []);
};

export default socket;
