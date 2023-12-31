const socket = io("https://chat-gsm9.onrender.com");

const roomOptions = document.getElementById("room-options");
const createRoomButton = document.getElementById("create-room");
const joinRoomButton = document.getElementById("join-room");
const roomForm = document.getElementById("room-form");
const chatRoom = document.getElementById("chat-room");
const roomInfo = document.getElementById("room-info");
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const messageInput = document.getElementById("m");
const joinRoomInput = document.getElementById("room-number");
const joinRoomButtonSubmit = document.getElementById("join-room-button");

createRoomButton.addEventListener("click", function () {
  socket.emit("createRoom");
});

joinRoomButton.addEventListener("click", function () {
  roomOptions.style.display = "none";
  roomForm.style.display = "flex";
});

joinRoomButtonSubmit.addEventListener("click", function () {
  const roomNumber = joinRoomInput.value.trim();
  if (roomNumber) {
    socket.emit("joinRoom", roomNumber);
    roomInfo.innerHTML = `<p>Room Number: ${roomNumber}</p>`;
    roomForm.style.display = "none";
    chatRoom.style.display = "flex";
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const content = messageInput.value.trim();
  if (content) {
    socket.emit("chat message", { content });
    messageInput.value = "";
  }
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO");
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO");
});

socket.on("chat message", function (msg) {
  console.log("Received message:", msg);
  const li = document.createElement("li");
  li.textContent = msg.content;
  messages.appendChild(li);
});

socket.on("roomCreated", function (roomNumber) {
  console.log("Room created:", roomNumber);
  roomInfo.innerHTML = `<p>Room Number: ${roomNumber}</p>`;
  roomForm.style.display = "none";
  chatRoom.style.display = "flex";
});
