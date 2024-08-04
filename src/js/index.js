// server connection
const socket = new WebSocket('ws://localhost:8080');
socket.onmessage = handleMsg;

const roomIDLabel = document.getElementById("roomID");
const roomIDText = document.getElementById("roomIDText");
const roomIDButton = document.getElementById("roomIDButton");
const playerNameLabel = document.getElementById("playerName");
const playerNameText = document.getElementById("playerNameText");
const playerButton = document.getElementById("playerButton");
const canvas = document.getElementById("nameboard");
const startButton = document.getElementById("startButton");
const context = canvas.getContext("2d");

// player list
var roomID = 0;
var roomOwner = false;
var roomState = true;
var playerState = false;
var waitingState = false;
var ourPlayerName = "";
var ourPlayerIndex = -1;
var playerNames = [];
var playerNumber = 0;

// enter room button
roomIDText.addEventListener("keyup", enterRoomEnter); // enter a room by type enter
roomIDButton.addEventListener("click", enterRoomClick); // enter a room by click button

function enterRoomEnter(event) {
    if(event.keyCode === 13) {
        enterRoom(roomIDText.value);
        roomIDText.value = "";
    }
}

function enterRoomClick() {
    enterRoom(roomIDText.value);
    roomIDText.value = "";
}

function isPosInt(value) {
    return Number.isInteger(Number(value)) && Number(value) >= 0;
}

function enterRoom(value) {
    if (value.trim() === "") {  // Check if the room ID is empty
        alert("Room ID cannot be empty");
        return;
    }

    if (!isPosInt(value)) {  // Check if input string is positive integer
        alert("Room ID must be a non-negative integer between 0 to 16383");
        return;
    }

    if (Number(value) >= 16384) {  // Check if the room ID is too large
        alert("Room ID cannot exceed 16383");
        return;
    }

    var msg = {
        type: "enterRoom",
        roomID: value
    };
    roomID = value;
    socket.send(JSON.stringify(msg));
    // playerState = false;
    // waitingState = true;
}

// add new player button
playerNameText.addEventListener("keyup", addPlayerEnter); // add a player name by type enter
playerButton.addEventListener("click", addPlayerClick); // add a player name by click button

function addPlayerEnter(event) {
    if(event.keyCode === 13) {
        addPlayer(playerNameText.value);
        playerNameText.value = "";
    }
}

function addPlayerClick() {
    addPlayer(playerNameText.value);
    playerNameText.value = "";
}

function addPlayer(name) {
    if (!playerState) { // not able to join anymore
        return;
    }

    if (name.trim() === "") {  // Check if the name is empty
        alert("Player name cannot be empty");
        return;
    }

    if (name.length > 64) {  // Check if the name is too long
        alert("Player name too long");
        return;
    }

    if (playerNames.length === 4) {  // Check if there are already 4 players
        alert("Cannot exceed four players");
        return;
    }

    ourPlayerName = name;
    var msg = {
        type: "addPlayer",
        roomID: roomID,
        name: name
    };
    socket.send(JSON.stringify(msg));
    console.log("add a name " + name);
}

// wait for room info from server
async function handlePlayerInfo(event) {
    // Handle received message
    var msg = await event.data;
    msg = JSON.parse(msg);
    console.log('Client side: received message ' + msg);
    switch(msg.type){
        case("addPlayer") :
            if(playerNames.includes(msg.name)) { // no need to repeat
                return;
            }
            playerNames.push(msg.name);
            if(roomOwner && playerNames.length >= 2){
                startButton.style.backgroundColor = "#8f7a66";
                startButton.addEventListener("click", startGame);
            }
            break;
    }
};

// button misc
playerButton.addEventListener("mouseover", () => {
    if(playerState){
        playerButton.style.cursor = 'pointer';
    }
}); // change cursor style by hovering
playerButton.addEventListener("mouseout", () => {
    playerButton.style.cursor = 'default';
}); // change cursor style by move out

// start the game
function startGame() {
    // record player names in cookies and go to game page
    var msg = {
        type: "startGame",
        roomID: roomID,
    };
    socket.send(JSON.stringify(msg));
    document.cookie = JSON.stringify(playerNames);
    window.location.href = "hotelgame.html";
}

// handle all messages from server
async function handleMsg(event) {
    // Handle received message
    var msg = await event.data;
    msg = JSON.parse(msg);
    console.log('Client side: received message ' + msg);
    switch(msg.type){
        case("roomFull") : // room full, change to another room
            alert("this room is full, cannot enter");
            break;
        case("roomInfo") :
            playerNames = msg.playerName;
            playerNumber = msg.playerNumber;
            // become owner if we are the index 0
            if(playerNames.includes(ourPlayerName)){
                ourPlayerIndex = playerNames.indexOf(ourPlayerName);
            }
            roomOwner = ourPlayerIndex==0;
            // can start game if you are the owner
            if(roomOwner) {
                startButton.style.backgroundColor = "#8f7a66";
                startButton.addEventListener("click", startGame);
            }
            // switch to player state if in room state, and show up all blocks
            if(roomState){
                roomState = false;
                playerState = true;
                roomIDLabel.style.display = 'none';
                roomIDText.style.display = 'none';
                roomIDButton.style.display = 'none';
                playerNameLabel.style.display = 'block';
                playerNameText.style.display = 'block';
                playerButton.style.display = 'block';
                playerButton.style.backgroundColor = "#8f7a66";
                canvas.style.display = 'block';
                startButton.style.display = 'block';
            }
            updatePlayerCanvas();
            break;
    }
};

// button misc
startButton.addEventListener("mouseover", () => {
    if(playerState && roomOwner){
        startButton.style.cursor = 'pointer';
    }
}); // change cursor style by hovering
startButton.addEventListener("mouseout", () => {
    startButton.style.cursor = 'default';
}); // change cursor style by move out

// canvas update
function updatePlayerCanvas() {
    // clear canvas first
    context.clearRect(0, 0, 400, 200);
    context.font="20px verdana";
    for(let i=0; i<playerNumber; i++){
        switch(i){
            case 0: context.fillStyle = "blue";   break;
            case 1: context.fillStyle = "red";    break;
            case 2: context.fillStyle = "yellow"; break;
            case 3: context.fillStyle = "grey";   break;
        }
        context.beginPath();
        context.arc(10, 25 + 25 * i, 10, 0, 2 * Math.PI);
        context.fill();
        const text = "player " + i + ": " + playerNames[i];
        const offsetX = 20;
        const offsetY = 30 + 25*i;
        context.shadowColor="white";
        context.shadowBlur=2;
        context.lineWidth=2;
        context.strokeStyle = "white";
        context.strokeText(text, offsetX, offsetY);
        context.shadowBlur=0;
        context.fillStyle="black";
        context.fillText(text, offsetX, offsetY);
    }
}
