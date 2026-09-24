import { useState, useEffect } from "react";
import socket, { useSocketEvents } from "../../hooks/useSocket";
import "../ApiDemo/ApiDemo.css";
import "./SocketDemo.css";

export default function SocketDemo() {
  const [connected, setConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [room, setRoom] = useState("general");

  // Connect / disconnect manually so beginners can see it
  const handleConnect = () => socket.connect();
  const handleDisconnect = () => socket.disconnect();

  // Listen to socket status
  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // Listen to incoming messages
  useSocketEvents([
    {
      eventName: "message",
      handler: (data) =>
        setMessages((prev) => [
          { id: Date.now(), text: data.text, from: data.from || "Server", time: new Date().toLocaleTimeString() },
          ...prev.slice(0, 19),
        ]),
    },
    {
      eventName: "price_update",
      handler: (data) =>
        setMessages((prev) => [
          { id: Date.now(), text: `Price update: ${JSON.stringify(data)}`, from: "📡 Feed", time: new Date().toLocaleTimeString() },
          ...prev.slice(0, 19),
        ]),
    },
  ]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("message", { text: input, room });
    setMessages((prev) => [
      { id: Date.now(), text: input, from: "You", time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 19),
    ]);
    setInput("");
  };

  const joinRoom = () => {
    socket.emit("joinRoom", { room });
    setMessages((prev) => [
      { id: Date.now(), text: `Joined room: ${room}`, from: "System", time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">⚡ Socket.io Integration</h2>
      <p className="page-desc">
        Real-time communication using <code>socket.io-client</code>. Connect, join rooms, send and receive events.
      </p>

      {/* Connection Status */}
      <div className="section">
        <div className="section-header">
          <h3>Connection Status</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" onClick={handleConnect} disabled={connected}>Connect</button>
            <button className="btn-secondary" onClick={handleDisconnect} disabled={!connected}>Disconnect</button>
          </div>
        </div>
        <div className={`status-indicator ${connected ? "online" : "offline"}`}>
          <span className="status-dot" />
          {connected ? `Connected — ID: ${socket.id}` : "Disconnected"}
        </div>
      </div>

      {/* Room */}
      <div className="section">
        <h3>Join a Room</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="input"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Room name"
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={joinRoom} disabled={!connected}>Join</button>
        </div>
      </div>

      {/* Send Message */}
      <div className="section">
        <h3>Send Message</h3>
        <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1 }}
            disabled={!connected}
          />
          <button className="btn-primary" type="submit" disabled={!connected}>Send</button>
        </form>
      </div>

      {/* Messages */}
      <div className="section">
        <h3>Live Messages ({messages.length})</h3>
        {messages.length === 0 ? (
          <p style={{ color: "#888", fontSize: 14 }}>No messages yet. Connect and send one!</p>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.from === "You" ? "mine" : ""}`}>
                <span className="msg-from">{msg.from}</span>
                <span className="msg-text">{msg.text}</span>
                <span className="msg-time">{msg.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
