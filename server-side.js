
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
    
    object.game_status.next_level = false;

    var a = 0;    
    var loop1 = setInterval(function(){

      
        console.log("game running..")
        moveAliens();
        moveMissiles();
        checkCollisionsMA();
        if(a%4==3) lowerAliens();
        if(RaketaKolidujeSVotrelcom()) {
            console.log("colission")
            object.game_status.game_over = true;
            websocket.send(JSON.stringify(object))
            clearInterval(loop1);

        }
        if(object.game_status.aliens.length === 0) {

            console.log("0 ALIENS WIN")
            //clearInterval(loop2);

            object.game_status.next_level = true;
            clearInterval(loop1);
            
            object.game_status.missiles = [];
            //drawMissiles();
            //win();
            //setTimeout(function(){
                //nextLevel();
            //},1000);
            //websocket.send(JSON.stringify(object))
            setTimeout(function(){
                nextLevel();
            },100);
            
        }




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
            object.game_status.score += 10;
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

function nextLevel() {
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
    gameLoopMove(websocket_global,object);
}

var movesOn = function movesOn(move){
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
    websocket_global.send(JSON.stringify(object))
    return false
    
}


var resetGame = function resetGame(){
    clearInterval(window.loop1);
    clearInterval(window.loop2);

    console.log("restart level");
    aliens = [1,3,5,7,9,23,25,27,29,31];
    missiles = [];
    speed = 512;
    ship = [104,114,115,116];
    scoreCounter = 0;
    level = 1;
    window.scoreCounter = 0;
    document.getElementById('score').innerHTML = "Score: " +scoreCounter;

    gameLoop()
}

module.exports = { gameLoopMove, movesOn, resetGame }
