const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

var roomIDList = [];
var roomList = [];
class gameRoom{
    constructor(roomID) {
        this.roomID = roomID;
        this.playerNumber = 0;
        this.playerName = [];
        this.gameStart = false;
        this.gameOver = false;
        this.winner = -1;
    }

    addPlayer(playerName) {
        this.playerNumber++;
        this.playerName.push(playerName);
    }
}

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        // Handle incoming message
        console.log('Server side: received message ' + message);
        var rcvmsg = JSON.parse(message);
        var rplmsg;
        switch(rcvmsg.type){
            case "enterRoom":
                if(checkRoomExist(rcvmsg.roomID)){ // room exist
                    i = roomIDList.indexOf(rcvmsg.roomID);
                    if(roomList[i].playerNumber == 4){ // full already
                        rplmsg = {
                            type: "roomInfo",
                            playerNumber: -1
                        };
                    }
                    rplmsg = {
                        type: "roomInfo",
                        playerNumber: roomList[i].playerNumber,
                        playerName: roomList[i].playerName
                    };
                } else { // room doesn't exist, open a new room
                    addRoom(rcvmsg.roomID);
                    i = roomIDList.indexOf(rcvmsg.roomID);
                    rplmsg = {
                        type: "roomInfo",
                        playerNumber: roomList[i].playerNumber,
                        playerName: roomList[i].playerName
                    };
                }
                break;
            case "addPlayer":
                i = roomIDList.indexOf(rcvmsg.roomID);
                roomList[i].playerNumber++;
                roomList[i].playerName.push(rcvmsg.name);
                rplmsg = rcvmsg;
                break;
            case "startGame":
                i = roomIDList.indexOf(rcvmsg.roomID);
                roomList[i].gameStart = true;
                break;
        }
        ws.send(JSON.stringify(rplmsg));
    });

    ws.on('close', function() {
        // Handle connection close
        console.log('Server side: connection lost');
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

function removeRoom(roomID) {
    if(checkRoomExist(roomID)){
        const roomIdx = roomIDList.indexOf(roomID);
        roomIDList.splice(roomIdx, 1);
        roomList.splice(roomIdx, 1);
    }
}