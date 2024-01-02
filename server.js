const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get('/download', (req, res) => {
  res.sendFile(path.join(__dirname + "/download.html"));
});

const PORT = process.env.PORT || 8800;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Helper function to generate a random room number
function generateRoomNumber() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const socketToRoom = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("createRoom", () => {
    const roomNumber = generateRoomNumber();
    socket.join(roomNumber);
    socketToRoom[socket.id] = roomNumber;
    io.to(roomNumber).emit("chat message", {
      content: "User created and joined the room",
      roomNumber: roomNumber,
    });
    io.to(socket.id).emit("roomCreated", roomNumber);
  });

  socket.on("joinRoom", (roomNumber) => {
    const existingRoom = io.sockets.adapter.rooms.get(roomNumber);
    if (existingRoom) {
      socket.join(roomNumber);
      socketToRoom[socket.id] = roomNumber;
      io.to(roomNumber).emit("chat message", {
        content: "User joined the room",
        roomNumber: roomNumber,
      });
    } else {
      io.to(socket.id).emit("chat message", {
        content: "Room does not exist",
      });
    }
  });

  socket.on("chat message", (msg) => {
    io.to(socketToRoom[socket.id]).emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
