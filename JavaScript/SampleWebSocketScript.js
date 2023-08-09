// Create WebSocket
const socket = new WebSocket("ws://example.com/socket");

// Set request headers
socket.setRequestHeader("Authorization", "Bearer 1234"); 

// Handle messages
socket.onmessage = (event) => {
  const data = event.data;
  console.log(data);
}

// Send message
socket.send("Hello");
