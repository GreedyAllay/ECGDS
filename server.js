const server = {
    port: 6969
}

const WebSocket = require("ws")

let players = {

}

console.log("starting dedicated server...")
server.websocket = new WebSocket.Server({port: server.port})


server.websocket.on('connection', (ws) => {
  console.log('wow someone joined');

  //console.log(server.websocket.clients())
  
  //ws.send('hi little client');

  ws.on('message', (msg) => {
    const rx = JSON.parse(msg)

    const {type, username, player} = rx

    try {
      switch(type) {
        case "join":
          //send global server message to everyone that some dumbass decided to become part of this place
          players
        break;
        case "update":
          if(!players[username]) {
            players[username] = {x: 0, y: 0}
          }
          players[username].x = player.x
          players[username].y = player.y
          players[username].xv = player.xv
          players[username].yv = player.yv
          players[username].mirror = player.mirror
          players[username].texture = player.texture

          if(players) {
            const tx = {type: "update", players: players}
            ws.send(JSON.stringify(tx))
          }
        break;
        case "chat": 
          sendGlobalChat(rx.message)
        break;
      }
    } catch (error) {
      ws.send(`serverError: ${error}`);
    }

    //console.log(`death threat received: ${message}`);
    //ws.send(`death threat received: ${message}`);
  });

  
  function sendGlobalChat(message) {
    const tx = {type: "chat", message: message}
    sendToAll(JSON.stringify(tx))
    console.log(`[CHAT] ${message}`)
  }

  function sendToAll(data) {
    server.websocket.clients.forEach(client => {
      if(!client.readyState === WebSocket.OPEN) {return}
      client.send(data)
    });
  }

  ws.on('close', () => {
    console.log('player disconnected');
    players = {}
    sendGlobalChat('gary disconnected.')
    console.log(server.clients)
  });
});