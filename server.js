
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
        this.top_score = 0
        this.level = 1
    }
}

class user{
    constructor(session,socket){
        this.session = session
        this.game_status = new gameStatus()
        this.socket = socket
        this.nickname = "anonym"
        this.password = ""
        this.logged = false
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
let users_db = require('./userdb.json');
bcrypt = require('bcrypt');

const wsServer = new WebSocket.Server({port: '8082'})

fs.readFile("./userdb.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    console.log("File data:", jsonString);

    users_db = JSON.parse(jsonString);
  });

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

    //console.log(JSON.parse(payload))

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

    console.log(users_db)
   
})

app.post("/start-game", (req, res) =>{
    let game_pin = Number(req.query.pin)
    console.log("GAME PIN: " + game_pin)
    console.log(game_pin)
    console.log("get request start to start game ")
    //console.log(web_sockets.length)
    
    serverSide.gameLoopMove(web_sockets[game_pin],users[game_pin],game_pin);

    //console.log(user[playerCounter]);
    //playerCounter++;
})

app.post("/reset-game", (req, res) =>{
    console.log("get request to reset game")
    console.log(req.query.pin)
    //console.log(websocket)
    if (serverSide.resetGame(web_sockets[req.query.pin],users[req.query.pin])){
        res.status("200").send("ok").end();
    }
})

app.post('/moves', (req,res) => {
    console.log("MOVES FIRED POST")
    console.log(req.query.pin)
    if(serverSide.movesOn(users[req.query.pin],req.query.move.toString())){
        res.status("200").send("ok").end()
    }
    //serverSide.movesOn(req.query.move,user )
})

app.post('/login', (req,res) => {
    console.log("loginn");

    let game_pin = req.query.pin;
    let nickname = req.query.nickname;
    let password = req.query.password;
    let tmp_object = null;
    console.log(game_pin)
    console.log(nickname)
    console.log(password)
    
    //console.log(users);

    users[game_pin].nickname = nickname
    users[game_pin].password = password

    //console.log(users[game_pin])
    console.log(users_db)
    
    if (serverSide.loginUser(users[game_pin])) {
        res.status("200").send("succesfuly logged!").end()
        console.log(tmp_object)
        for( let i = 0 ; i < users_db.length; i++){
            if(users_db[i].nickname == users[game_pin].nickname){
                console.log("prepis values")
                //users[game_pin].game_status = users_db[i].game_status;
                users[game_pin].game_status.level = users_db[i].game_status.level;
                users[game_pin].game_status.top_score = users_db[i].game_status.top_score;
                break;
            }
        }
    } else {
        console.log("WRONG PASSWORD")
    }
    
    //serverSide.movesOn(req.query.move,user )
})


app.post('/register', (req, res)=> {
    var game_pin = req.query.pin;
    var nickname = req.query.nickname;
    var password =  req.query.password;
    var password2 = req.query.password2;
    var firstname = req.query.firstname;
    var lastname = req.query.lastname;
    
    console.log(game_pin)
    console.log(nickname)
    console.log(password)
    console.log(password2)
    console.log(firstname)
    console.log(lastname)

    let tmp_hash = "";

    if (registerUser(nickname,password,password2,firstname,lastname,game_pin)){
        res.status("200").send("ok").end()
    }

    console.log("HASH TMP")
    console.log(tmp_hash)


})



app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })

setInterval(function(){ 
    console.log("update db")
    jsonReader("./userdb.json", (err, customers) => {
        if (err) {
          console.log("Error reading file:", err);
          return;
        }
        // increase customer order count by 1
        fs.writeFile("./userdb.json", JSON.stringify(users_db), err => {
          if (err) console.log("Error writing file:", err);
        });
      });


}, 1000);
 

async function registerUser(nickname,password,password2,firstname,lastname,game_pin) {
   
    let hash_password = null;

    if(password != password2){
        return false;
    }

    hash_password = await bcrypt.hash(password,10);
    

    users[game_pin].nickname = nickname;
    users[game_pin].password = hash_password;
    users[game_pin].name = firstname + " " +lastname;
    
    store_obj = users[game_pin];
    store_obj.socket = "";    
    users_db.push(store_obj);

   
    return true;

    

}

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
      }
    });
  }