//import 'server-side.js'

var rectangles = { };
var running = false;



//zmeniť

var speed ;
var ship = [104,114,115,116] ;
var direction;
var missiles = [];
var aliens = [1,3,5,7,9,23,25,27,29,31] ;

//FE websocket 
const socket = new WebSocket('ws://localhost:8082');

socket.addEventListener('open', (event) => {
    console.log("Connected to the server side")
})

// DOSTANEM MESSAGE
var object = {}

socket.addEventListener('message', (event) => {
        console.log("UPDATE")
        object = JSON.parse(event.data);
        console.log(object);
        speed = object.game_status.speed;
        ship = object.game_status.ship;
        direction = object.game_status.direction;
        missiles = object.game_status.missiles;
        aliens = object.game_status.aliens;       
})


document.getElementById('start').addEventListener('click',function(){
    fetch('/start-game').then(console.log("fetch to start game"));
    //gameLoop()
    if(!running) gameLoop();
});


function initSpace() {

    console.log("Vytvaram prostredie...")
    var canvasToHTML = document.createElement("canvas");
    canvasToHTML.id = "myCanvas";
    canvasToHTML.setAttribute("width",528);
    canvasToHTML.setAttribute("height",528);

document.getElementById("space").appendChild(canvasToHTML);
document.getElementsByTagName("TABLE")[0].remove();


var alien = document.createElement("img");
alien.id = "alien";
alien.src = "https://cdn.pixabay.com/photo/2020/12/25/00/41/alien-5858427_1280.png";
document.getElementById("space").appendChild(alien);

var stone = document.createElement("img");
stone.id = "stone";
stone.src = "https://www.goodfreephotos.com/albums/vector-images/grey-stone-rock-vector-clipart.png";
document.getElementById("space").appendChild(stone);

var rocket = document.createElement("img");
rocket.id = "rocket";
rocket.src = "https://freesvg.org/img/rocket-297573.png";
document.getElementById("space").appendChild(rocket);

var stone = document.createElement("img");
stone.id = "winner";
stone.src = "https://www.pngrepo.com/png/123399/512/winner-trophy-for-the-best.png";
document.getElementById("space").appendChild(stone);

var stone = document.createElement("img");
stone.id = "loose";
stone.src = "https://cdn.pixabay.com/photo/2020/10/31/17/31/sad-5701778_1280.png";
document.getElementById("space").appendChild(stone);

var audio = document.createElement("audio");
audio.id = "music";
audio.style = "none";
audio.src = "https://ia800908.us.archive.org/14/items/OnorezdiLP014/EXILE%20-%20SLUM%20VILLAGE%20%28PROD%20THEDEEPR%20EDIT%29%20-%20TIME%20HAS%20COME.mp3";
document.getElementById("space").appendChild(audio);

var button = document.createElement("button");
button.innerHTML = "MUSIC";
button.id = "musicBtn";
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

var button = document.createElement("button");
button.innerHTML = "RESET";
button.id = "resetBtn";
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

var score = document.createElement("h2");
score.innerHTML =  "Score: 0" ; 
score.id = "score";
var body = document.getElementsByTagName("body")[0];
body.appendChild(score);


var score = document.createElement("h2");
score.innerHTML =  "Aktualny level: " ; 
score.id = "level";
var body = document.getElementsByTagName("body")[0];
body.appendChild(score);



//hide IMG 
var images = document.getElementsByTagName('img');
for (i = 0; i < images.length;i++ ) {
    images[i].style.display = "none";
}

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var counter = 0;
var x,y;


for(var i = 0; i < 11; i++) {
for(var j = 0; j < 11; j++) {
    x = j * 48;
    y = i * 48;
    ctx.beginPath();
    ctx.rect(x, y, 48, 48);
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3;
    ctx.fillStyle = "#202020";
    ctx.textAlign = "center";
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText(counter , x + 25 , y + 28 );
    rectangles[counter] = {x: x, y: y};
   //console.log(rectangles[counter]);
    counter++;
    }
}
}

initSpace();


function drawSpace() {

    var levelPrint = document.getElementById("level");
    levelPrint.innerHTML = "Aktualny level: " + level;

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var counter = 0;
    for(var i = 0; i < 11; i++) {
        for(var j = 0; j < 11; j++) {
            x = j * 48;
            y = i * 48;
            ctx.beginPath();
            ctx.rect(x, y, 48, 48);
            ctx.strokeStyle = "black"
            ctx.lineWidth = 3;
            ctx.fillStyle = "#202020";
            ctx.textAlign = "center";
            ctx.stroke();
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.fillText(counter , x + 25 , y + 28 );     
            counter++;       
        }
    } 
}


function drawAliens() {
    
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var alienImg = document.getElementById("alien");
    var i=0;
    var x = 0;
    var y = 0;
    for(i=0;i<aliens.length;i++) {
       x = rectangles[aliens[i]].x;
       y = rectangles[aliens[i]].y;
    
       ctx.beginPath();
       ctx.drawImage(alienImg, x, y, 48, 48);
       ctx.textAlign = "center";
       ctx.fill();
       ctx.fillStyle = "white";
       ctx.fillText(aliens[i] , x + 25 , y + 28 );     

    }
}

function drawShip() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var rocketImg = document.getElementById("rocket");
    var i=0;
    for(i=99;i<121;i++) {

        x = rectangles[i].x;
        y = rectangles[i].y;
     
        ctx.beginPath();
        ctx.rect(x, y, 48, 48);
        ctx.fillStyle = '#202020';
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(i , x + 25 , y + 28 );     


    }
    for(i=0;i<ship.length;i++) {
        //document.getElementById('p'+ship[i]).style.background = 'white';
        x = rectangles[ship[i]].x;
        y = rectangles[ship[i]].y;
     
        ctx.beginPath();
        
        ctx.drawImage(rocketImg, x, y, 48, 48);
        //ctx.rect(x, y, 48, 48);
        ctx.strokeStyle = "black"
        ctx.lineWidth = 3;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(ship[i] , x + 25 , y + 28 );     
    }
}

function drawMissiles() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var stoneImg = document.getElementById("stone");
    var i=0;
    var list = [];
    for(i=0;i<missiles.length;i++) {
       list.push(missiles[i]);

       x = rectangles[missiles[i]].x;
       y = rectangles[missiles[i]].y;
       
       ctx.beginPath();
       ctx.drawImage(stoneImg , x, y, 48, 48);
       ctx.lineWidth = 3;
       ctx.textAlign = "center";
       ctx.fill();
       ctx.fillStyle = "white";
       ctx.fillText(missiles[i] , x + 25 , y + 28 );  

        
    }
}

function loose() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var loose = document.getElementById("loose");
    var i=0;
    console.log("loose")

    for(i=0;i<121;i++) {
       x = rectangles[i].x;
       y = rectangles[i].y;
       
       ctx.beginPath();
       ctx.rect(x, y, 48, 48);
       ctx.lineWidth = 3;
       ctx.fillStyle = "red";
       ctx.fill();
       
    }

    ctx.beginPath();
    ctx.drawImage(loose ,160, 160, 200, 200);
    ctx.fill();
    running = false;
}

function win() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var winner = document.getElementById("winner");
    var i=0;
    console.log("WIN")
   

    for(i=0;i<121;i++) {
        x = rectangles[i].x;
        y = rectangles[i].y;
        
        ctx.beginPath();
        ctx.rect(x, y, 48, 48);
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        ctx.fill();
    }

    ctx.beginPath();
    ctx.drawImage(winner ,160, 160, 200, 200);
    ctx.fill();
}

function gameLoop() {
    console.log('gameloop');
       
    running = true;
    document.addEventListener('keydown',checkKey);
    
    var loop2 = setInterval(function(){

        drawSpace();
        drawAliens();
        drawMissiles();
        drawShip();
        if(aliens.length === 0) {
            clearInterval(loop2);
            clearInterval(loop1);
            document.removeEventListener('keydown',checkKey);
            missiles = [];
            drawMissiles();
            win();
            setTimeout(function(){
                nextLevel();
            },1000);
        }
    },speed/2);

}
/*
document.getElementById('start').addEventListener('keydown',function(e){
    e.preventDefault();
    e.stopPropagation();
});
*/
document.getElementById('musicBtn').addEventListener('click', () =>{
    var audio = document.getElementById('music');

    if(audio.paused){
        console.log("music ON")
        audio.play();
    }else {
        console.log("music PAUSE")
        audio.pause();
    }
})

document.getElementById('resetBtn').addEventListener('click', () =>{

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

})
/*
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37' || e.keyCode == '71' ) {
        if(ship[0] > 100) {
            var i=0;
            for(i=0;i<ship.length;i++) {
                ship[i]--;
            }
        }
    }
    else if ((e.keyCode == '39' || e.keyCode == '74' )  && ship[0] < 108) {
        var i=0;
        for(i=0;i<ship.length;i++) {
            ship[i]++;
        }
    }
    else if (e.keyCode == '32') {
        missiles.push(ship[0]-11);
    }
}
*/

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37' || e.keyCode == '71' ) {
        console.log("CLICKED")
        fetch(`http://localhost:8080/moves?move=${"left"}`, {
            method: 'POST'
        }).catch(err => {
            console.error(err)
        })

    }
    else if ((e.keyCode == '39' || e.keyCode == '74' )  && object.game_status.ship[0] < 108) {
        fetch(`http://localhost:8080/moves?move=${"right"}`, {
            method: 'POST'
        }).catch(err => {
            console.error(err)
        })

    }
    else if (e.keyCode == '32') {
        fetch(`http://localhost:8080/moves?move=${"fire"}`, {
            method: 'POST'
        }).catch(err => {
            console.error(err)
        })
        
    }
}





