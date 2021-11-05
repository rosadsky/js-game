
// databaza budúcich userov i hope


// toto prerobiť na to aby to bolo uložené per user ?? 

var object
var websocket_global

const gameLoopMove = function gameLoopMove(websocket,user) {


    console.log("GAMELOOP - MOVE")

    websocket_global = websocket;
    
    
    //document.addEventListener('keydown',checkKey);
    object = user

    websocket.addEventListener('message', (event) => {
        console.log("message from fe")
        object = JSON.parse(event.data);
        //console.log(object);         
    })
    

    var a = 0;    
    var loop1 = setInterval(function(){

      
        console.log("game running..")
        moveAliens();
        moveMissiles();
        checkCollisionsMA();
        if(a%4==3) lowerAliens();
        //if(RaketaKolidujeSVotrelcom(user)) {
            //clearInterval(loop2);
            //clearInterval(loop1);
            //document.removeEventListener('keydown',checkKey);
        //    missiles = [];
          //  drawMissiles();
            //loose();
       // }
        a++;

        websocket.send(JSON.stringify(object))
    },user.game_status.speed);

    //window.loop1 = loop1;
    //window.loop2 = loop2;
}

function checkCollisionsMA() {
    for(var i=0;i<object.game_status.missiles.length;i++) {
        if(object.game_status.aliens.includes(object.game_status.missiles[i])) {
            var alienIndex = object.game_status.aliens.indexOf(object.game_status.missiles[i]);
            object.game_status.aliens.splice(alienIndex, 1);
            object.game_status.missiles.splice(i, 1);
            console.log("+10 SCORE");
            //scoreCounter+= 10;
            //var score = document.getElementById("score");
            //score.innerHTML = "Score: " + scoreCounter;
            

        }
    }
}

function RaketaKolidujeSVotrelcom() {
    for(var i=0;i<object.game_status.aliens.length;i++) {
        if(object.game_status.aliens[i]>98) {
            return true;
        }
    }
    return false;
}

function moveMissiles() {
    var i=0;
    for(i=0;i<object.game_status.missiles.length;i++) {
        object.game_status.missiles[i]-=11 ;
        if(object.game_status.missiles[i] < 0) object.game_status.missiles.splice(i,1);
    }
}


function moveAliens() {
    var i=0;
    for(i=0;i<object.game_status.aliens.length;i++) {
        // TOTO POTREBUEJM POSIELAŤ NEJAK 
        object.game_status.aliens[i]=object.game_status.aliens[i]+object.game_status.direction;
    }
    object.game_status.direction *= -1;
}
function lowerAliens() {
    var i=0;
    for(i=0;i<object.game_status.aliens.length;i++) {
        object.game_status.aliens[i]+=11;
    }
}

var movesOn = function movesOn(move){
    console.log("move on func")
    console.log(typeof(move))
    /*
    if(move == "left"){
        console.log("lefted")
        if(object.game_status.ship[0] > 100) {
            var i=0;
            for(i=0;i<object.game_status.ship.length;i++) {
                object.game_status.ship[i]--;
            }
            return true

    }
    
    if(move == "right"){
        console.log("righted")
        var i=0;
        for(i=0;i<object.game_status.ship.length;i++) {
            object.game_status.ship[i]++;
        }
        return true
    } 
    
    if (move == "fire") {
        console.log("fored")
        //object.game_status.missiles.push(object.game_status.ship[0]-11);
        console.log(object.game_status.missiles);
        return true
    }

    }
    */

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
    websocket_global.send(JSON.stringify(object))
    
}
module.exports = { gameLoopMove, movesOn }
