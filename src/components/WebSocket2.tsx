import React, { useState, useEffect, useRef } from "react"
import { Icon } from "@iconify/react"

const WebSocketComponent2: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState<string>("")
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Disconnected")
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080")

    ws.current.onopen = () => {
      setConnectionStatus("Connected")
    }

    ws.current.onclose = () => {
      setConnectionStatus("Disconnected")
    }

    ws.current.onmessage = async (event: MessageEvent) => {
      if (event.data instanceof Blob) {
        const message = await event.data.text()
        setMessages(prevMessages => [...prevMessages, message])
      } else {
        console.warn("Received non-Blob message:", event.data)
      }
    }

    ws.current.onerror = error => {
      console.error("WebSocket error:", error)
      setConnectionStatus("Error")
    }

    return () => {
      ws.current?.close()
    }
  }, [])

  const sendMessage = () => {
    if (ws.current && input.trim() !== "") {
      const message = `React: ${input}`
      const blob = new Blob([message], { type: "text/plain" })
      ws.current.send(blob)
      setInput("")
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>WebSocket Example</h1>
      <p>Status: {connectionStatus}</p>
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
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
                alignSelf: msg.includes("React") ? "flex-end" : "flex-start",
              }}
            >
              <span style={{ color: 'white', marginTop: '6px' }}>
                {msg.split(": ")[0] == "React" ? (
                  <Icon icon='mdi:react' width={20} />
                ) : (
                  <Icon icon='mdi:microsoft' width={20} />
                )}
              </span>
              <span
                style={{
                  backgroundColor: msg.includes("React")
                    ? "#009AFF"
                    : "#6363636f",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              >
                {msg.split(": ")[1]}
              </span>
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
          style={{ width: "100%", height: "36px", padding: "0 10px" }}
        />
        <button onClick={sendMessage} style={{ height: "40px" }}>
          Send
        </button>
      </div>
    </div>
  )
}

export default WebSocketComponent2
