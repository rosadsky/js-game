
bcrypt = require('bcrypt');

let users_db = require('./userdb.json')


const gameLoopMove = function gameLoopMove(ws_socket,user,session) {

    console.log("GAMELOOP - MOVE fired")
    
  

    //websocket_global = websocket;
    
   

    if(user.game_status != undefined){
        user.game_status.next_level = false;
        user.game_status.reset_game = false;
    }
     
    var a = 0;    
    var loop1 = setInterval(function(){
        
        
        moveAliens(user);
        moveMissiles(user);
        checkCollisionsMA(user);
        if(a%4==3) lowerAliens(user);
        if(RaketaKolidujeSVotrelcom(user)) {
            console.log("colission")
            user.game_status.game_over = true;
            //websocket.send(JSON.stringify(object))
            clearInterval(loop1);
            defaultValuesAfterLoose(user)

        }
        if(user.game_status.aliens.length === 0) {
            console.log("0 ALIENS WIN")
            user.game_status.next_level = true;
            clearInterval(loop1);   
            user.game_status.missiles = [];
            setTimeout(function(){
                nextLevel(user,ws_socket,session);
            },100);
        }

        if(user.game_status.reset_game){
            console.log("CLEAR INTERVAL AFTER RESET")
            clearInterval(loop1);
        }

        //top score prepisovanie
        if(user.game_status.score > user.game_status.top_score){
            user.game_status.top_score = user.game_status.score;
        }

        console.log("SEND..on pin " + session)
        ws_socket.send(JSON.stringify(user));
        a++;
        
    },user.game_status.speed);

   
}

function checkCollisionsMA(object) {
    for(var i=0;i<object.game_status.missiles.length;i++) {
        if(object.game_status.aliens.includes(object.game_status.missiles[i])) {
            var alienIndex = object.game_status.aliens.indexOf(object.game_status.missiles[i]);
            object.game_status.aliens.splice(alienIndex, 1);
            object.game_status.missiles.splice(i, 1);
            console.log("+10 SCORE");
            object.game_status.score += 10;
        }
    }
}

function RaketaKolidujeSVotrelcom(object) {
    for(var i=0;i<object.game_status.aliens.length;i++) {
        if(object.game_status.aliens[i]>98) {
            return true;
        }
    }
    return false;
}

function moveMissiles(object) {
    var i=0;
    for(i=0;i<object.game_status.missiles.length;i++) {
        object.game_status.missiles[i]-=11 ;
        if(object.game_status.missiles[i] < 0) object.game_status.missiles.splice(i,1);
    }
}


function defaultValuesAfterLoose(object){
    object.game_status.aliens = [1,3,5,7,9,23,25,27,29,31];
    object.game_status.missiles = [];
    object.game_status.speed = 512;
    object.game_status.ship = [104,114,115,116];
    object.game_status.score = 0;
    object.game_status.level = 1;
    object.game_status.game_over = false;

}

function moveAliens(object) {
    var i=0;
    for(i=0;i<object.game_status.aliens.length;i++) {
        // TOTO POTREBUEJM POSIELAŤ NEJAK 
        object.game_status.aliens[i]=object.game_status.aliens[i]+object.game_status.direction;
    }
    object.game_status.direction *= -1;
}
function lowerAliens(object) {
    var i=0;
    for(i=0;i<object.game_status.aliens.length;i++) {
        object.game_status.aliens[i]+=11;
    }
}

function nextLevel(object,websocket,session) {
    object.game_status.level++;
    console.log('level: '+ object.game_status.level);
    if(object.game_status.level==1) object.game_status.aliens = [1,3,5,7,9,23,25,27,29,31];
    if(object.game_status.level==2) object.game_status.aliens = [1,3,5,7,9,13,15,17,19,23,25,27,29,31];
    if(object.game_status.level==3) object.game_status.aliens = [1,5,9,23,27,31];
    if(object.game_status.level==4) object.game_status.aliens = [45,53];
    if(object.game_status.level > 4) {
        object.game_status.level = 1;
        object.game_status.aliens = [1,3,5,7,9,23,25,27,29,31];
        object.game_status.speed = object.game_status.speed / 2;
    }

    object.game_status.running = false;
    object.game_status.game_over = false;
    gameLoopMove(websocket,object,session);
}

var movesOn = function movesOn(object,move,websocket){
    console.log("move on func")
    console.log(typeof(move))
  
    switch(move) {
        case "left":
            console.log("lets go left")
            if(object.game_status.ship[0] > 100) {
                var i=0;
                for(i=0;i<object.game_status.ship.length;i++) {
                    object.game_status.ship[i]--;
                }
                return true
            }
        case "right":
            console.log("lest go right")
            var i=0;
            for(i=0;i<object.game_status.ship.length;i++) {
                object.game_status.ship[i]++;
            }
            return true
        case "fire":
            object.game_status.missiles.push(object.game_status.ship[0]-11);
            return true
    }
    websocket.send(JSON.stringify(object))
    return false
    
}


var resetGame = function resetGame(websocket,object){


    console.log(object);

    object.game_status.reset_game = true;


    console.log("restart level");
    object.game_status.aliens = [1,3,5,7,9,23,25,27,29,31];
    object.game_status.missiles = [];
    object.game_status.speed = 512;
    object.game_status.ship = [104,114,115,116];
    object.game_status.score = 0;
    object.game_status.level = 1;
    //window.scoreCounter = 0;
    //document.getElementById('score').innerHTML = "Score: " +scoreCounter;
    setTimeout(function(){
        gameLoopMove(websocket,object);
    },999);

    return true;
}


var getProperty = function (propertyName,obj) {
    return obj[propertyName];
};

var loginUser = async function loginUser(user){

    let hash_password = ""
    hash_number = 10;
    const originalPassword = "password";
    const password = "password";
    console.log("loginuser")
    //console.log(users_db)
    
        //console.log(users_db[user.nickname.stringify()])
    
    
    for(let i = 0; i < users_db.length; i++){
        if(users_db[i].nickname == user.nickname){
            console.log("som in")
            //hash_password = user.nickname;
            hash_password = users_db[i].password;
            break;
        }
    }

    //register
    //const hash_password = await bcrypt.hash(originalPassword,hash_number);
    //store to DB
    //console.log(hash_password);


    const isMatch = await bcrypt.compare(user.password,hash_password);

    console.log(isMatch);


    return isMatch;
}


module.exports = { gameLoopMove, movesOn, resetGame, loginUser}
