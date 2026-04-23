const server = {
    port: 6969
}

const WebSocket = require("ws")

console.log("starting dedicated server...")
server.websocket = new WebSocket.Server({port: server.port})


server.websocket.on('connection', (ws) => {
  console.log('wow someone joined');
  
  // Send a welcome message to the client
  ws.send('hi little client');

  // Message event handler
  ws.on('message', (message) => {
    console.log(`death threat received: ${message}`);
    // Echo the message back to the client
    ws.send(`death threat received: ${message}`);
  });

  // Close event handler
  ws.on('close', () => {
    console.log('player disconnected');
  });
});