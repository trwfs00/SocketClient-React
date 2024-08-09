import React, { useState, useEffect, useRef } from "react"
import { Icon } from "@iconify/react"

const WebSocketComponent2: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState<string>("")
  const [room, setRoom] = useState<string>("default-room") // Start with no room
  const [joinedRoom, setJoinedRoom] = useState<boolean>(false) // Track if the user has joined a room
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Disconnected")
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080")

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server")
      setConnectionStatus("Connected")
    }

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket server")
      setConnectionStatus("Disconnected")
    }

    ws.current.onmessage = async (event: MessageEvent) => {
      let message: string
      if (event.data instanceof Blob) {
        message = await event.data.text()
      } else {
        message = event.data
      }

      console.log("Message received in React client:", message)

      setMessages(prevMessages => [...prevMessages, message])
    }

    ws.current.onerror = error => {
      console.error("WebSocket error:", error)
      setConnectionStatus("Error")
    }

    return () => {
      ws.current?.close()
    }
  }, [])

  const joinRoom = (roomName: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: "join", room: roomName }))
      console.log(`Joined room: ${roomName}`)

      // Display a message in the chat area about the successful room join
      const joinMessage = `System: Joined room '${roomName}'`
      setMessages(prevMessages => [...prevMessages, joinMessage])

      // Update the state to indicate the user has joined a room
      setJoinedRoom(true)
    }
  }

  const sendMessage = () => {
    if (!joinedRoom) {
      // Display a message instructing the user to join a room first
      const warningMessage = "System: Please join a room first."
      setMessages(prevMessages => [...prevMessages, warningMessage])
      return
    }

    if (ws.current && input.trim() !== "") {
      const message = `React: ${input}`
      const blob = new Blob([message], { type: "text/plain" })

      ws.current.send(blob)
      console.log(`Sent message: ${message}`)
      setMessages(prevMessages => [...prevMessages, message])
      setInput("")
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>WebSocket Chat</h1>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          margin: "0 0 12px 0",
        }}
      >
        Status: Server {connectionStatus}{" "}
        {joinedRoom ? (
          <>
            <Icon
              icon='solar:chat-round-check-bold'
              width={24}
              color='#009AFF'
            />
            room joined.
          </>
        ) : (
          <>
            <Icon
              icon='solar:chat-round-dots-bold'
              width={24}
              color='#ff7171'
            />
            room not joined.
          </>
        )}
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          alignItems: "center",
          marginBottom: "36px",
          width: "100%",
        }}
      >
        <input
          type='text'
          value={room}
          onChange={e => setRoom(e.target.value)}
          placeholder='Enter room name'
          style={{ width: "100%", height: "36px", padding: "0 10px" }}
        />
        <button
          onClick={() => joinRoom(room)}
          style={{
            padding: "5px 10px",
            minWidth: "100px",
            minHeight: "46px",
            border: joinedRoom ? "none" : "1px solid #ff7171",
          }}
          disabled={!room.trim()}
        >
          Join Room
        </button>
      </div>
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          width: "100%",
          listStyle: "none",
          padding: 0,
        }}
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                alignItems: "center",
                alignSelf: msg.startsWith("React: ")
                  ? "flex-end"
                  : msg.startsWith("WinForms: ")
                  ? "flex-start"
                  : "center",
              }}
            >
              <span style={{ color: "white", marginTop: "6px" }}>
                {msg.startsWith("React") ? (
                  <Icon icon='mdi:react' width={20} />
                ) : msg.startsWith("System") ? (
                  <Icon icon='mdi:information-outline' width={20} />
                ) : (
                  <Icon icon='mdi:microsoft' width={20} />
                )}
              </span>
              <span
                style={{
                  backgroundColor: msg.startsWith("React: ")
                    ? "#009AFF"
                    : msg.startsWith("WinForms: ")
                    ? "#6363636f"
                    : "transparent",
                  padding: msg.startsWith("System: ") ? "0px" : "6px 12px",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              >
                {msg.split(": ")[1]}
              </span>
            </li>
          ))
        ) : !joinedRoom ? (
          <>
            <li
              style={{
                alignSelf: "center",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Icon icon='mdi:information-outline' width={20} />
              <span>Please join a room first.</span>
            </li>
            <li>No messages yet</li>
          </>
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
          style={{ width: "100%", height: "36px", padding: "0 10px" }}
          disabled={!joinedRoom} // Disable input if the user has not joined a room
        />
        <button
          onClick={sendMessage}
          style={{ padding: "5px 10px", minHeight: "46px" }}
          disabled={!joinedRoom || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default WebSocketComponent2
