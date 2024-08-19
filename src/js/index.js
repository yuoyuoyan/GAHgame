// Check browser type first, only found issues in Safari now, store it for future
// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 79
var isChrome = !!window.chrome;

// Edge (based on chromium) detection
var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

// server connection
const socket = new WebSocket('ws://localhost:8083');
// const socket = new WebSocket('ws://121.43.102.218:8083');
socket.onmessage = isSafari ? handleMsgApple : handleMsgNotApple;

const roomIDLabel = document.getElementById("roomID");
const roomIDText = document.getElementById("roomIDText");
const roomIDButton = document.getElementById("roomIDButton");
const playerNameLabel = document.getElementById("playerName");
const playerNameText = document.getElementById("playerNameText");
const playerButton = document.getElementById("playerButton");
const canvas = document.getElementById("nameboard");
const standartHotelDiv = document.getElementById("standartHotelDiv");
const standartHotelSwtich = document.getElementById("standartHotelSwtich");
const useRecordDiv = document.getElementById("useRecordDiv");
const useRecordSwtich = document.getElementById("useRecordSwtich");
const startButton = document.getElementById("startButton");
const context = canvas.getContext("2d");

// player list
var roomID = 0;
var roomOwner = false;
var roomState = true;
var playerState = false;
var waitingState = false;
var gameState = false;
var ourPlayerName = "";
var ourPlayerIndex = -1;
var playerNames = [];
var playerNumber = 0;
var useStandardHotel = true;
var useRecord = false;

var game;

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
    // one client can only add name by once
    playerState = false;
    waitingState = true;
    playerButton.style.backgroundColor = "grey";
    socket.send(JSON.stringify(msg));
    console.log("add a name " + name);
}

// start the game
function startGame() {
    // record player names in cookies and go to game page
    var msg = {
        type: "startGame",
        roomID: roomID,
        useStandardHotel: useStandardHotel,
        useRecord: useRecord
    };
    socket.send(JSON.stringify(msg));
}

// toggle standard hotel switch
function toggleStandardSwitch() {
    useStandardHotel = !useStandardHotel;
}

function toggleUseRecord() {
    useRecord = !useRecord;
}

// button misc
playerButton.addEventListener("mouseover", () => {
    if(playerState){
        playerButton.style.cursor = 'pointer';
    }
}); // change cursor style by hovering
playerButton.addEventListener("mouseout", () => {
    playerButton.style.cursor = 'default';
}); // change cursor style by move out

// button misc
startButton.addEventListener("mouseover", () => {
    if(waitingState && roomOwner){
        startButton.style.cursor = 'pointer';
    }
}); // change cursor style by hovering
startButton.addEventListener("mouseout", () => {
    startButton.style.cursor = 'default';
}); // change cursor style by move out

// handle all messages from server
function handleMsgApple(event){
    var msg = event.data;
    msg = JSON.parse(msg);
    handleMsg(msg);
}

async function handleMsgNotApple(event) {
    var msg = await event.data;
    msg = JSON.parse(msg);
    handleMsg(msg);
}

function handleMsg(msg) {
    // Handle received message
    // var msg = await event.data;
    // var msg = event.data;
    // msg = JSON.parse(msg);
    console.log('Client side: received message ' + msg);
    switch(msg.type){
        case("roomFull") : // room full, change to another room
            alert("this room is full, cannot enter");
            break;
        case("roomInfo") :
            playerNames = msg.playerName;
            playerNumber = msg.playerNumber;
            // game already started and someone disconnect, game force end
            if(gameState && playernumber != game.playerNumber) {
                for(let i=0; i<game.playerNumber; i++){
                    if(!playerNames.includes(game.playerName[i])){
                        alert(game.playerName[i] + "断线，游戏终止");
                        gameState = false;
                        return;
                    }
                }
            }
            // become owner if we are the index 0
            if(playerNames.includes(ourPlayerName)){
                ourPlayerIndex = playerNames.indexOf(ourPlayerName);
            }
            roomOwner = ourPlayerIndex==0;
            // can start game and change config if you are the owner
            if(roomOwner & playerNumber>=2) {
                startButton.style.backgroundColor = "#8f7a66";
                startButton.addEventListener("click", startGame);
            } else {
                startButton.style.cursor = "default";
            }
            if(roomOwner){
                standartHotelSwtich.addEventListener('change', toggleStandardSwitch);
                useRecordSwtich.addEventListener('change', toggleUseRecord);
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
                if(roomOwner){ // only owner can change config
                    standartHotelDiv.style.display = 'block';
                    useRecordDiv.style.display = 'block';
                }
                startButton.style.display = 'block';
            }
            updatePlayerCanvas();
            break;
        case("startGame") :
            waitingState = false;
            gameState = true;
            playerNameLabel.style.display = 'none';
            playerNameText.style.display = 'none';
            playerButton.style.display = 'none';
            canvas.style.display = 'none';
            standartHotelSwtich.style.display = 'none';
            useRecordSwtich.style.display = 'none';
            startButton.style.display = 'none';
            guestCanvas.style.display = 'block';
            actionCanvas.style.display = 'block';
            logCanvas.style.display = 'block';
            player0Canvas.style.display = 'block';
            player1Canvas.style.display = 'block';
            player2Canvas.style.display = 'block';
            player3Canvas.style.display = 'block';
            serverCanvas.style.display = 'block';
            hotelCanvas.style.display = 'block';
            game = new Game(playerNames.length, playerNames);
            game.ourPlayer = ourPlayerIndex;
            // send an init info request
            var msg = {
                type: "gameInitInfoReq",
                roomID: roomID,
                playerID: ourPlayerIndex
            };
            socket.send(JSON.stringify(msg));
            // document.cookie = JSON.stringify(playerNames);
            // window.location.href = "hotelgame.html";
            break;
        case("gameInitInfo") :
            // init players and hotel
            game.hotelID = msg.hotelID;
            game.constructPlayer();
            // tasks and decks
            game.majorTask0 = msg.majorTask[0];
            game.majorTask1 = msg.majorTask[1];
            game.majorTask2 = msg.majorTask[2];
            game.royalTask0 = msg.royalTask[0];
            game.royalTask1 = msg.royalTask[1];
            game.royalTask2 = msg.royalTask[2];
            game.guestDeck = msg.guestDeck;
            game.serverDeck = msg.serverDeck;
            for(let i=0; i<5; i++){
                game.guestInQueue.push(game.guestDeck.at(-1));
                game.guestDeck.pop();
            }
            // draw 6 servers
            for(let i=0; i<game.playerNumber; i++) {
                game.players[i].addServerToHand(6);
            }
            game.updateAllCanvas();
            // Add debug state if needed
            gameOn();
            game.bkupMiniTurn();
            break;
        case("diceInfo") : // sync random dice roll
            game.actionPoint = msg.dice;
            game.updateAllCanvas();
            game.bkupMiniTurn();
            break;
        case("broadcast") : // broadcast all canvas clicking to every players
            // only act when it's our controlled player
            var event = {
                offsetX: msg.offsetX,
                offsetY: msg.offsetY
            };
            switch(msg.canvasType){
                case("guest") :
                    game.handleGuestClick(event);
                    break;
                case("action") :
                    game.handleActionClick(event);
                    break;
                case("hotel") :
                    game.handleHotelClick(event);
                    break;
                case("server") :
                    game.handleServerClick(event);
                    break;
                case("alert") :
                    game.handleAlertClick(event);
                    break;
                case("player0") :
                    game.handlePlayer0Click(event);
                    break;
                case("player1") :
                    game.handlePlayer1Click(event);
                    break;
                case("player2") :
                    game.handlePlayer2Click(event);
                    break;
                case("player3") :
                    game.handlePlayer3Click(event);
                    break;
                case("restart") :
                    game.handleRestart(event);
                    break;
            }
            break;
    }
};

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
