let server = {
    port: 6969,
    name: "missing server config",
    motd: "no server config found!",
    maxPlayers: 0,
    levelName: "defineLevel0"
}

const WebSocket = require("ws")
const fs = require("fs")


let loadedConfig

try {
  loadedConfig = fs.readFileSync("properties.json", "utf-8")
} catch (error) {
  console.log("theres no properties.json, guess i will create a new one then, dont delete it next time!")
  fs.writeFileSync("properties.json", `
{
  "port": 6969,
  "name": "missing server config",
  "motd": "no server config found!",
  "maxPlayers": 0,
  "levelName": "defineLevel0"
}
  `)
  loadedConfig = fs.readFileSync("properties.json", "utf-8")
}

server = loadedConfig ? JSON.parse(loadedConfig) : server

console.log("using config: \n", server)

const levelData = fs.readFileSync(`level/${server.levelName}.js`, "utf-8")




let players = {}

console.log("starting dedicated server...")
try {
  server.websocket = new WebSocket.Server({port: server.port})
  console.log("done.")
} catch (error) {
  console.log("error opening socket: " + error)
} 


server.websocket.on('connection', async(ws) => {
  console.log('wow someone joined');

  //console.log(server.websocket.clients())
  
  //ws.send('hi little client');

  ws.on('message', (msg) => {
    const rx = JSON.parse(msg)

    const {type, username, player} = rx

    try {
      switch(type) {
        case "join":{
          const pl = Object.keys(players)
          if(pl.includes(username)) {
            sendPrivate(`"${username}" is already taken, sorry!`)
            //ws.close()
            return
          }
          //send global server message to everyone that some dumbass decided to become part of this place
          sendGlobalChat(`${username} joined`)
          const tx = {type: "level", data: level}
          ws.send(JSON.stringify(tx))
        break;}
        case "update":
          //yes i love allowing anyone to change anyone's positions thats a very nice thing to do and extremely secure
          if(!players[username]) {
            players[username] = {x: 0, y: 0}
          }
          //wowie so nice i hope it works
          //edit: it didnt work
          const copy = [ "x", "y", "xv", "yv", "w", "h", "ox", "oy", "sneaking", "mirror", "texture" ]
          copy.forEach(property => { players[username][property] = player[property] })
          if(players) {
            const tx = {type: "update", players: players}
            ws.send(JSON.stringify(tx)) //give da data to da ppl
          }
        break;
        case "chat": 
          sendGlobalChat(rx.message)
        break;
        case "query":{
          const tx = {type: "query", motd: server.motd, name: server.name, count: Object.keys(players).length, max: server.maxPlayers}
          ws.send(JSON.stringify(tx))}
          break;
        case "edit": {
          const {change, data} = rx
            switch(change) {
              case "add":
                const {x, y, w, h} = data
                const tx = {type: "change", type: "add", data: [x, y, w, h]}
                ws.send(JSON.stringify(tx))
        break;
              }
            }
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

  function sendPrivate(msg) {
    const tx = {type: "msg", msg: msg}
    console.log(`[DIRECT] ${msg}`)
    ws.send(JSON.stringify(tx))
  }

  ws.on('close', () => {
    players = {}
    sendGlobalChat('gary disconnected.')
  });
});