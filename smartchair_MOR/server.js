const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let latestMessage = "SMART CHAIR DETECTION NOTIFICATION...";

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/notify", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message received" });

  latestMessage = message;
  console.log("📨 Notification received:", message);
  io.emit("new-message", message);

  res.status(200).json({ status: "Notification received" });
});

app.get("/api/latest", (req, res) => {
  res.json({ message: latestMessage });
});

io.on("connection", (socket) => {
  console.log("✅ Client connected");
  socket.emit("new-message", latestMessage);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
