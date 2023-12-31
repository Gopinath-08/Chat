const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);

// Replace "https://chat-gsm9.onrender.com" with your actual Socket.IO link
const socketIOLink = "https://chat-gsm9.onrender.com";

// Replace "https://chat-gopinath-08.vercel.app/" with your actual server link
const yourServerLink = "https://chat-gopinath-08.vercel.app/";

// Initialize Socket.IO with the server and set origins
const io = socketIO(server, {
  cors: {
    origin: socketIOLink,
    methods: ["GET", "POST"]
  }
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle chat messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
