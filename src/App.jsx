// src/App.js
import React, { useState, useEffect, useRef } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onmessage = async (event) => {
      if (event.data instanceof Blob) {
        // If the received message is a Blob, convert it to text
        const text = await event.data.text();
        setMessages((prevMessages) => [...prevMessages, text]);
      } else {
        // If it's not a Blob, handle it as text directly
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && message.trim()) {
      ws.current.send(message);
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Simple WebSocket Chat</h2>
      <div
        style={{
          marginBottom: "20px",
          height: "300px",
          overflowY: "scroll",
          border: "1px solid black",
          padding: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
}

export default App;
