//import 'server-side.js'

var rectangles = { };
var running = false;



//zmeniť

var speed ;
var ship = [104,114,115,116] ;
var direction;
var missiles = [];
var aliens = [1,3,5,7,9,23,25,27,29,31] ;
var game_over = false;
var scoreCounter = 0;
var level = 1;
var next_level = false;
var reset_game = false;
var default_connection = true;
var game_pin = 999;
var top_score = 0;
var nickname = "jozo";

//FE websocket 
const web_socket = new WebSocket('ws://localhost:8082');

web_socket.addEventListener('open', (event) => {
    console.log("Connected to the server side")


    //web_socket.send(object)
})

// DOSTANEM MESSAGE
var object = {}

web_socket.addEventListener('message', (event) => {
        console.log("UPDATE")
        

        object = JSON.parse(event.data);
        console.log(object)


        if(object.session == game_pin){
            console.log("next connection")
            speed = object.game_status.speed;
            ship = object.game_status.ship;
            direction = object.game_status.direction;
            missiles = object.game_status.missiles;
            aliens = object.game_status.aliens;
            game_over = object.game_status.game_over;  
            scoreCounter = object.game_status.score;   
            level = object.game_status.level;  
            next_level = object.game_status.next_level;
            reset_game = object.game_status.reset_game;
            top_score = object.game_status.top_score
            
        }



        if (default_connection){
            console.log("first connection");
            default_connection = false;
            game_pin = object.session;

        }

        //console.log(object);
        
})


document.getElementById('start').addEventListener('click',function(){
    

    ///moves?move=${"right"}
    fetch(`http://localhost:8080/start-game?pin=${game_pin}`, {
        method: 'POST'
    }).then(console.log("fetch to start game"));
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

var button = document.createElement("button");
button.innerHTML = "LEFT";
button.id = "leftBtn";
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

var button = document.createElement("button");
button.innerHTML = "RIGHT";
button.id = "rightBtn";
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

var button = document.createElement("button");
button.innerHTML = "FIRE";
button.id = "fireBtn";
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

var score = document.createElement("h2");
score.innerHTML =  "Score: 0" ; 
score.id = "score";
var body = document.getElementsByTagName("body")[0];
body.appendChild(score);

var score = document.createElement("h2");
score.innerHTML =  "Top Score: 0" ; 
score.id = "top_score";
var body = document.getElementsByTagName("body")[0];
body.appendChild(score);

var score = document.createElement("h2");
score.innerHTML =  "Aktualny level: " ; 
score.id = "level";
var body = document.getElementsByTagName("body")[0];
body.appendChild(score);

//login 
var element = document.createElement("input");
//score.innerHTML =  "Aktualny level: " ; 
element.type = "text";
element.placeholder = "Enter nickname"
element.id = "nickname";
element.name = "nickname";
var body = document.getElementsByTagName("body")[0];
body.appendChild(element);

var element = document.createElement("input");
//score.innerHTML =  "Aktualny level: " ; 
element.type = "password";
element.placeholder = "Enter password"
element.id = "password";
var body = document.getElementsByTagName("body")[0];
body.appendChild(element);

var button = document.createElement("button");
button.innerHTML = "LOGIN";
button.id = "loginBtn";
button.type = "submit";
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);


//register 

var score = document.createElement("br");
var body = document.getElementsByTagName("body")[0];
body.appendChild(score);


var element = document.createElement("input");
element.type = "text";
element.placeholder = "Enter nickname"
element.id = "nickname-register";
element.name = "nickname-register";
var body = document.getElementsByTagName("body")[0];
body.appendChild(element);

var element = document.createElement("input");
element.type = "password";
element.placeholder = "Enter password"
element.id = "password-register";
var body = document.getElementsByTagName("body")[0];
body.appendChild(element);

var element = document.createElement("input");
element.type = "password";
element.placeholder = "Enter password"
element.id = "password-2-register";
var body = document.getElementsByTagName("body")[0];
body.appendChild(element);

var element = document.createElement("input");
element.type = "email";
element.placeholder = "Enter email"
element.id = "email-register";
var body = document.getElementsByTagName("body")[0];
body.appendChild(element);

var element = document.createElement("input");
element.type = "text";
element.placeholder = "Enter First name";
element.id = "firstname-register";
element.name = "lastname-register";
var body = document.getElementsByTagName("body")[0];
body.appendChild(element);

var element = document.createElement("input");
element.type = "text";
element.placeholder = "Enter Lastname";
element.id = "lastname-register";
element.name = "lastname-register";
var body = document.getElementsByTagName("body")[0];
body.appendChild(element);

var button = document.createElement("button");
button.innerHTML = "REGISTER";
button.id = "registerBtn";
button.type = "submit";
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);



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
    //console.log("loose")

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
        console.log("looping")
        
        drawSpace();
        drawAliens();
        drawMissiles();
        drawShip();
        
        
        if(next_level){
            console.log("SOM V NEXT LEVEL")
            clearInterval(loop2);
            document.removeEventListener('keydown',checkKey);
            drawMissiles();
            win();
            setTimeout(function(){
                gameLoop();
            },1000);
        }

        if(reset_game){
            console.log("clear interval frontend")
            clearInterval(loop2);
            setTimeout(function(){
                gameLoop();
            },1000);
            
        }

        if(game_over) {
            loose();
            document.removeEventListener('keydown',checkKey);
            if(reset_game) {
                gameLoop()
            }

        }

        
        var score = document.getElementById("score");
        score.innerHTML = "Score: " + scoreCounter.toString();

        var levelPrint = document.getElementById("level");
        levelPrint.innerHTML = "Aktualny level: " + level;

        var levelPrint = document.getElementById("top_score");
        levelPrint.innerHTML = "Top Score: " + top_score;

        
    },speed/2);

    

}

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

    fetch(`http://localhost:8080/reset-game?pin=${game_pin}`, {
            method: 'POST'
        }).catch(err => {
            console.error(err)
        })

})

document.getElementById('loginBtn').addEventListener('click', () =>{

    var nickname = document.getElementById("nickname").value;
    var password = document.getElementById("password").value;
    console.log("LOGIN NICKNAME: " + nickname)
    console.log("PASSWORD: " + password)
//?nickname=${game_pin}`
    fetch(`http://localhost:8080/login?pin=${game_pin}&nickname=${nickname}&password=${password}`, {
            method: 'POST'
        }).catch(err => {
            console.error(err)
        })

})

document.getElementById('registerBtn').addEventListener('click', () =>{

    var nickname = document.getElementById("nickname-register").value;
    var password = document.getElementById("password-register").value;
    var password2 = document.getElementById("password-2-register").value;
    var firstname = document.getElementById("firstname-register").value;
    var lastname = document.getElementById("lastname-register").value;

    console.log("LOGIN NICKNAME: " + nickname)
    console.log("PASSWORD: " + password)

    fetch(`http://localhost:8080/register?pin=${game_pin}&nickname=${nickname}&password=${password}&password2=${password2}&firstname=${firstname}&lastname=${lastname}`, {
            method: 'POST'
        }).catch(err => {
            console.error(err)
        })

})


function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37' || e.keyCode == '71' ) {
        console.log("CLICKED")
        fetch(`http://localhost:8080/moves?move=${"left"}&pin=${game_pin}`, {
            method: 'POST'
        }).then()
    }
    else if ((e.keyCode == '39' || e.keyCode == '74' )  && object.game_status.ship[0] < 108) {
        fetch(`http://localhost:8080/moves?move=${"right"}&pin=${game_pin}`, {
            method: 'POST'
        }).then()

    }
    else if (e.keyCode == '32') {
        fetch(`http://localhost:8080/moves?move=${"fire"}&pin=${game_pin}`, {
            method: 'POST'
        }).then()
        
    }
}





