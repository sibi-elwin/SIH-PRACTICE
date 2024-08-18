// index.js
import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// To store connected clients
let clients = [];

wss.on("connection", (ws) => {
  // Add new client to clients list
  clients.push(ws);

  ws.on("message", (message) => {
    // Broadcast the received message to other clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    // Remove the client on disconnect
    clients = clients.filter((client) => client !== ws);
  });
});

// Simple route for health check
app.get("/", (req, res) => {
  res.send("WebSocket server is running");
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
