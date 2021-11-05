const express = require('express');
const app = express();
const port = 8080
const fs = require('fs');
const path = require('path');
const { send } = require('process');


let websocket = null;

const WebSocket = require('ws');

const wsServer = new WebSocket.Server({port: '8082'})

app.use(express.static('public'))

//on connection inciializuje celá hra tak sa si spravím endpoint postový ktorý inicializuje všektko,
//ked sa to spraví tak sa to všetko inicializuje

serverSide = require("./server-side.js");

// databaza budúcich userov i hope
let user = [{ 
    
        nick: 'player1',
        password: '123',
        game_status: {
            speed: 1000,
            ship: [104,114,115,116],
            direction: 1,
            missiles: [],
            aliens : [1,3,5,7,9,23,25,27,29,31],
            game_over: false,
            next_level: false,
            score: 0,
            level: 1
        }
    }
]



wsServer.on('connection', (ws) => {
    console.log("New client connected")
    
    websocket = ws;
    ws.on('close', () => {
        console.log("Client has disconected! ");
    });
})



app.get("/",(req, res) => {
    console.log("STARTED");
    res.setHeader("Content-Type", "text/html");
    res.sendFile(__dirname + '/index.html')
})

app.get("/start-game", (req, res) =>{
    console.log("get request start to start game ")
    serverSide.gameLoopMove(websocket,user[0]);
})

app.get("/reset-game", (req, res) =>{
    console.log("get request to reset game")
})

app.post('/moves', (req,res) => {
    console.log("MOVES FIRED POST")
    console.log(req.query.move)
    if(serverSide.movesOn(req.query.move.toString())){
        res.status("200").send("ok").end()
    }
    //serverSide.movesOn(req.query.move,user )
})



//ked sa stlačí start sa otvorí komunikácia tak sa začne hra 
// spraví sa gameloop sa stlač



app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })