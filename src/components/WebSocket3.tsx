import React, { useState, useEffect, useRef } from "react"

const WebSocketComponent3: React.FC = () => {
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<string[]>([])
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Create a WebSocket connection when the component mounts
    ws.current = new WebSocket("ws://localhost:8080")

    // Log when the WebSocket is connected
    ws.current.onopen = () => {
      console.log("WebSocket Client Connected")
    }

    // Handle messages received from the server
    ws.current.onmessage = (event: MessageEvent) => {
      setMessages(prevMessages => [...prevMessages, event.data])
    }

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message)
      setMessages(prevMessages => [...prevMessages, `You: ${message}`])
      setMessage("")
    }
  }

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <div style={{ display: "flex", gap: '12px' }}>
        <input
          type='text'
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder='Type a message...'
          onKeyPress={e => e.key === "Enter" && sendMessage()}
          style={{ width: "300px", height: "40px" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default WebSocketComponent3
