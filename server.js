
class gameStatus{
    constructor(){
        this.speed = 1000
        this.ship = [104,114,115,116]
        this.direction = 1
        this.missiles= []
        this.aliens = [1,3,5,7,9,23,25,27,29,31]
        this.game_over= false
        this.next_level= false
        this.reset_game= false
        this.score = 0
        this.level = 1
    }
}

class user{
    constructor(session,socket){
        this.session = session
        this.game_status = new gameStatus()
        this.socket = socket
    }
}

const express = require('express');
const app = express();
const port = 8080
const fs = require('fs');
const path = require('path');
const { send } = require('process');

let session = 0;

let websocket;
let web_sockets = [ ]
const users = {}
const WebSocket = require('ws');

const wsServer = new WebSocket.Server({port: '8082'})

app.use(express.static('public'))

//on connection inciializuje celá hra tak sa si spravím endpoint postový ktorý inicializuje všektko,
//ked sa to spraví tak sa to všetko inicializuje

serverSide = require("./server-side.js");

// moj object usera


// 
wsServer.on('connection', (socket) => {
    console.log("New client connected session No.:" + session)
    //websocket = socket;
    //users[game_pin]["socket"] = socket;
    session++;
    users[session] = new user(session,socket)
    payload = JSON.stringify({"game_status":users[session]["game_status"],"session":users[session]["session"]})

    console.log(JSON.parse(payload))

    web_sockets[session] = socket;
    socket.send(payload);   
    

    socket.on('close', () => {
        console.log("Client has disconected! ");
    });
})



app.get("/",(req, res) => {
    console.log("STARTED");
    res.setHeader("Content-Type", "text/html");
    res.sendFile(__dirname + '/index.html')
   
})

app.post("/start-game", (req, res) =>{
    //let game_pin = Number(req.query.pin)
    //console.log("GAME PIN: " + game_pin)
    console.log("get request start to start game ")
    console.log(web_sockets.length)
    serverSide.gameLoopMove(web_sockets[session],users[session],session);

    //console.log(user[playerCounter]);
    //playerCounter++;
})

app.post("/reset-game", (req, res) =>{
    console.log("get request to reset game")
    //console.log(websocket)
    if (serverSide.resetGame(websocket)){
        res.status("200").send("ok").end();
    }
})

app.post('/moves', (req,res) => {
    console.log("MOVES FIRED POST")
    console.log(req.query.move)
    if(serverSide.movesOn(req.query.move.toString()),websocket){
        res.status("200").send("ok").end()
    }
    //serverSide.movesOn(req.query.move,user )
})



app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })