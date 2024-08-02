const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function(event) {
  // Handle connection open
  console.log('Client side: connection on');
  sendMessage('hello');
};

socket.onmessage = async function(event) {
  // Handle received message
  const text = await event.data.text();
  console.log('Client side: received message ' + text);
//   socket.close();
};

socket.onclose = function(event) {
  // Handle connection close
  console.log('Client side: connection lost');
};

function sendMessage(message) {
  socket.send(message);
}