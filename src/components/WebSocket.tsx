import React, { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

const SOCKET_SERVER_URL = "http://localhost:8080" // Update this URL to your WebSocket server

const WebSocketComponent: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState<string>("")
  const [connectionStatus, setConnectionStatus] = useState<string>("")
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"], // Ensures WebSocket transport is used
    })

    // Handle successful connection
    newSocket.on("connect", () => {
      setConnectionStatus("Connected to server")
      alert("Successfully connected to the server!")
    })

    // Handle connection error
    newSocket.on("connect_error", error => {
      setConnectionStatus("Connection failed")
      alert(`Failed to connect to the server: ${error.message}`)
    })

    // Handle messages from the server
    newSocket.on("message", (data: string) => {
      setMessages(prevMessages => [...prevMessages, data])
    })

    setSocket(newSocket)

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect()
    }
  }, [])

  const sendMessage = () => {
    if (input.trim() !== "" && socket) {
      socket.emit("message", `React: ${input}`)
      setInput("")
    }
  }

  return (
    <div>
      <h1>WebSocket Example</h1>
      <p>Status: {connectionStatus}</p>
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "90%",
        }}
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <li
              key={index}
              style={{
                alignSelf: msg.includes("React") ? "flex-end" : "flex-start",
                backgroundColor: msg.includes("React")
                  ? "#009AFF"
                  : "#23232350",
                padding: "6px 12px",
                borderRadius: "8px",
              }}
            >
              {msg.split(": ")[1]}
            </li>
          ))
        ) : (
          <li>No messages yet</li>
        )}
      </ul>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          alignItems: "center",
          marginTop: "36px",
          width: "100%",
        }}
      >
        <input
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          style={{ width: "100%", height: "36px" }}
        />
        <button onClick={sendMessage} style={{ height: "40px" }}>
          Send
        </button>
      </div>
    </div>
  )
}

export default WebSocketComponent
