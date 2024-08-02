const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {
    // Handle incoming message
    console.log('Server side: received message ' + message.data);
    ws.send(message);
  });

  ws.on('close', function() {
    // Handle connection close
    console.log('Server side: connection lost');
  });
});