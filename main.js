const socket = io("http://localhost:3000");

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  socket.emit("chat message", document.getElementById("m").value);

  document.getElementById("m").value = "";
});

socket.on("chat message", function (msg) {
  const li = document.createElement("li");
  li.textContent = msg;
  document.getElementById("messages").appendChild(li);
});
