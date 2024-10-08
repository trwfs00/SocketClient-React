import React from "react"
// import WebSocketComponent from "./components/WebSocket"
import WebSocketComponent2 from "./components/WebSocket2"
// import WebSocketComponent3 from "./components/WebSocket3"

const App: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        gap: "12px",
      }}
    >
      {/* <WebSocketComponent /> */}
      <WebSocketComponent2 />
      {/* <WebSocketComponent3 /> */}
    </div>
  )
}

export default App
