const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8083 });

var roomIDList = [];
var roomList = [];
class gameRoom{
    constructor(roomID) {
        this.roomID = roomID;
        this.roomPlayerNumber = 0;// number of people in room, not necesary to prepare
        this.roomCients = []; // clients in room
        this.playerNumber = 0;
        this.playerName = [];
        this.playerClients = []; // clients on table
        this.gameStart = false;
        this.gameOver = false;
        this.winner = -1;
        // two card deck moved to server
        this.guestDeck = Array.from({length: 58}, (_, i) => i);
        this.serverDeck = Array.from({length: 48}, (_, i) => i);
        // task info
        this.majorTask = [];
        this.royalTask = [];
        // dice info
        this.dice = [0, 0, 0, 0, 0, 0];
    }
}

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        // Handle incoming message
        console.log('Server side: received message ' + message);
        var rcvmsg = JSON.parse(message);
        var rplmsg;
        var roomIndex = roomIDList.indexOf(rcvmsg.roomID);
        switch(rcvmsg.type){
            case "enterRoom":
                if(checkRoomExist(rcvmsg.roomID)){ // room exist
                    if(roomList[roomIndex].roomPlayerNumber == 4){ // full already
                        console.log("Full room index " + roomIndex);
                        rplmsg = {
                            type: "roomFull"
                        };
                        // reply room full instead of broadcast room info
                        ws.send(JSON.stringify(rplmsg));
                        return;
                    } else {
                        // add new player to room
                        console.log("Enter room index " + roomIndex);
                        roomList[roomIndex].roomCients.push(ws);
                        roomList[roomIndex].roomPlayerNumber++;
                        rplmsg = {
                            type: "roomInfo",
                            playerNumber: roomList[roomIndex].playerNumber,
                            playerName: roomList[roomIndex].playerName
                        };
                    }
                } else { // room doesn't exist, open a new room
                    console.log("create a new room");
                    addRoom(rcvmsg.roomID);
                    roomIndex = roomIDList.indexOf(rcvmsg.roomID);
                    roomList[roomIndex].roomCients.push(ws);
                    roomList[roomIndex].roomPlayerNumber++;
                    rplmsg = {
                        type: "roomInfo",
                        playerNumber: roomList[roomIndex].playerNumber,
                        playerName: roomList[roomIndex].playerName
                    };
                }
                break;
            case "addPlayer":
                console.log("Add a player " + rcvmsg.name + " in room ID " + rcvmsg.roomID);
                roomList[roomIndex].playerNumber++;
                roomList[roomIndex].playerName.push(rcvmsg.name);
                roomList[roomIndex].playerClients.push(ws);
                rplmsg = {
                    type: "roomInfo",
                    playerNumber: roomList[roomIndex].playerNumber,
                    playerName: roomList[roomIndex].playerName
                };
                break;
            case "startGame": // only owner can start game, owner is player ID 0
                console.log("start game");
                roomList[roomIndex].gameStart = true;
                rplmsg = {
                    type: "startGame"
                }
                gameInit(roomList[roomIndex]);
                break;
            case "gameInitInfoReq" :
                console.log("send game initialization info to players");
                var playerIndex = rcvmsg.playerID;
                // var firstSixServer = [];
                // for(let i=0; i<6; i++){
                //     firstSixServer.push(roomList[roomIndex].serverDeck.at(-1));
                //     roomList[roomIndex].serverDeck.pop();
                // }
                rplmsg = {
                    type: "gameInitInfo",
                    majorTask: roomList[roomIndex].majorTask,
                    royalTask: roomList[roomIndex].royalTask,
                    guestDeck: roomList[roomIndex].guestDeck,
                    serverDeck: roomList[roomIndex].serverDeck,
                };
                roomList[roomIndex].playerClients[playerIndex].send(JSON.stringify(rplmsg));
                return;
            case "rollDiceReq" :
                console.log("roll dice for room " + rcvmsg.roomID);
                rollDice(roomList[roomIndex]);
                rplmsg = {
                    type: "diceInfo",
                    dice: roomList[roomIndex].dice
                };
                break;
            case "broadcast": // game operation to be broadcast to all players in room
                console.log("broadcast info");
                rplmsg = rcvmsg;
                break;
            case "endGame": // game over, close room
                console.log("end game");
                removeRoomByIndex(roomIndex);
                break;
        }
        // broadcast room info whenever updated
        console.log("broadcase to room " + roomList[roomIndex].roomID);
        for(let i=0; i<roomList[roomIndex].roomPlayerNumber; i++){
            roomList[roomIndex].roomCients[i].send(JSON.stringify(rplmsg));
        }
    });

    ws.on('close', function() {
        // Handle connection close
        console.log('Server side: connection lost');
        for(let i=0; i<roomList.length; i++){
            if(roomList[i].roomCients.includes(ws)){
                const disconnectIndex = roomList[i].roomCients.indexOf(ws);
                console.log('this client was in room ' + roomList[i].roomID);
                if(roomList[i].roomPlayerNumber == 1) { // the only person left, delete room
                    console.log('no more players in room ' + roomList[i].roomID + ', delete it');
                    removeRoomByIndex(i);
                } else {
                    roomList[i].roomPlayerNumber--;
                    roomList[i].roomCients.splice(disconnectIndex, 1);
                    console.log('remove player from room ' + roomList[i].roomID);
                    // already on table, remove it
                    if(roomList[i].playerClients.includes(ws)){
                        const tableIndex = roomList[i].playerClients.indexOf(ws);
                        roomList[i].playerClients.splice(tableIndex, 1);
                        roomList[i].playerName.splice(tableIndex, 1);
                        roomList[i].playerNumber--;
                        console.log('remove player from table too');
                    }
                    var rplmsg = {
                        type: "roomInfo",
                        playerNumber: roomList[i].playerNumber,
                        playerName: roomList[i].playerName
                    };
                    // broadcast to the remaining players in room
                    console.log("broadcase to room " + roomList[i].roomID);
                    for(let player=0 ;player<roomList[i].roomPlayerNumber; player++){
                        roomList[i].roomCients[player].send(JSON.stringify(rplmsg));
                    }
                }
            }
        }
    });
});

function checkRoomExist(roomID) {
    if(roomIDList.includes(roomID)) {return true;}
    else {return false;}
}

function addRoom(roomID) {
    roomIDList.push(roomID);
    roomList.push(new gameRoom(roomID));
}

function removeRoomByIndex(roomIndex) {
    roomIDList.splice(roomIndex, 1);
    roomList.splice(roomIndex, 1);
}

function shuffleDeck(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function gameInit(room){
    room.majorTask[0] = Math.floor(Math.random() * 4);
    room.majorTask[1] = Math.floor(Math.random() * 4);
    room.majorTask[2] = Math.floor(Math.random() * 4);
    room.royalTask[0] = Math.floor(Math.random() * 4);
    room.royalTask[1] = Math.floor(Math.random() * 4);
    room.royalTask[2] = Math.floor(Math.random() * 4);
    shuffleDeck(room.guestDeck);
    shuffleDeck(room.serverDeck);
}

function rollDice(room){
    room.dice = [0, 0, 0, 0, 0, 0];
    // console.log("dice number " + (room.playerNumber * 2 + 6));
    // Add more dices for fun
    console.log("dice number " + (room.playerNumber * 2 + 10));
    for(let i=0; i<(room.playerNumber * 2 + 6); i++){
        room.dice[Math.floor(Math.random() * 6)]++;
    }
}
