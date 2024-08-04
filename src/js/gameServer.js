const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

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
    }
}

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        // Handle incoming message
        console.log('Server side: received message ' + message);
        var rcvmsg = JSON.parse(message);
        var rplmsg;
        var roomIndex;
        switch(rcvmsg.type){
            case "enterRoom":
                if(checkRoomExist(rcvmsg.roomID)){ // room exist
                    roomIndex = roomIDList.indexOf(rcvmsg.roomID);
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
                roomIndex = roomIDList.indexOf(rcvmsg.roomID);
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
                roomIndex = roomIDList.indexOf(rcvmsg.roomID);
                roomList[roomIndex].gameStart = true;
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