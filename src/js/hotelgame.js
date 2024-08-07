// var playerNames = JSON.parse(decodeURIComponent(document.cookie));
const skipPrepare = 0;
const debugState = 0;

// init game info and draw background
// window.onload = gameOn;
// const game = new Game(playerNames.length, playerNames, 1);

// listen to canvas click
guestCanvas.addEventListener("click",   handleGuestClickWrap);
actionCanvas.addEventListener("click",  handleActionClickWrap);
hotelCanvas.addEventListener("click",   handleHotelClickWrap);
serverCanvas.addEventListener("click",  handleServerClickWrap);
alertCanvas.addEventListener("click",   handleAlertClickWrap);
player0Canvas.addEventListener("click", handlePlayer0ClickWrap);
player1Canvas.addEventListener("click", handlePlayer1ClickWrap);
player2Canvas.addEventListener("click", handlePlayer2ClickWrap);
player3Canvas.addEventListener("click", handlePlayer3ClickWrap);
logCanvas.addEventListener("click",     handleRestartWrap);

// test plan
// 1. First guest invitation and room preparation, done
// 2. all actions, done
// 3. room bonus, done
// 4. major tasks, done
// 5. all servers, done
// 6. all guests, done
// 7. royal tasks, done

function gameOn() {
    // skip the first guest round
    if(skipPrepare) {
        for(let i=0; i<game.playerNumber; i++){
            game.currPlayer = i;
            game.players[game.currPlayer].firstGuestTurn = false;
            game.players[game.currPlayer].hotel.addGuestToTable(game.guestInQueue[4]);
            game.takeOneGuestFromQueue(4);
            game.players[game.currPlayer].hotel.roomPrepare(0, 0);
            game.players[game.currPlayer].hotel.roomPrepare(0, 1);
            game.players[game.currPlayer].hotel.roomPrepare(0, 2);
            game.players[game.currPlayer].hotel.roomToPrepare = 0;
            game.players[game.currPlayer].hotel.firstThreeRoom = false;
            game.players[game.currPlayer].hotel.roomHighLightFlag = false;
            game.players[game.currPlayer].checkOpStatus();
        }
        game.rollDice();
        // game.currPlayer = 0;
        if(debugState) {
            // test major task
            // game.majorTask0 = 2;
            // game.majorTask1 = 0;
            // game.majorTask2 = 0;
            // test royal task
            game.mainRound = 6;
            // game.miniRound = 2*game.playerNumber-1;
            game.currPlayer = 0;
            // game.royalTask0 = 0;
            // game.royalTask1 = 3;
            game.royalTask2 = 1;
            game.players[game.currPlayer].royalPoint = 10;
            // game.players[game.currPlayer].gamePoint = 20;
            // game.players[game.currPlayer].royalResult = 0;
            // game.players[game.currPlayer].updateAlertCanvas(alertContext);
            // test room closure and bonus
            // game.players[game.currPlayer].hotel.roomPrepare(0,0);
            // game.players[game.currPlayer].hotel.roomPrepare(0,1);
            // game.players[game.currPlayer].hotel.roomPrepare(0,2);
            game.players[game.currPlayer].hotel.roomPrepare(0,3);
            game.players[game.currPlayer].hotel.roomPrepare(0,4);
            game.players[game.currPlayer].hotel.roomPrepare(1,0);
            game.players[game.currPlayer].hotel.roomPrepare(1,1);
            game.players[game.currPlayer].hotel.roomPrepare(1,2);
            game.players[game.currPlayer].hotel.roomPrepare(1,3);
            game.players[game.currPlayer].hotel.roomPrepare(1,4);
            // game.players[game.currPlayer].hotel.roomPrepare(2,0);
            // game.players[game.currPlayer].hotel.roomPrepare(2,1);
            // game.players[game.currPlayer].hotel.roomPrepare(2,2);
            // game.players[game.currPlayer].hotel.roomPrepare(2,3);
            // game.players[game.currPlayer].hotel.roomPrepare(2,4);
            // game.players[game.currPlayer].hotel.roomPrepare(3,0);
            // game.players[game.currPlayer].hotel.roomPrepare(3,1);
            // game.players[game.currPlayer].hotel.roomPrepare(3,4);
            game.players[game.currPlayer].hotel.roomClose(0,0);
            game.players[game.currPlayer].hotel.roomClose(0,1);
            game.players[game.currPlayer].hotel.roomClose(0,2);
            game.players[game.currPlayer].hotel.roomClose(0,3);
            game.players[game.currPlayer].hotel.roomClose(0,4);
            game.players[game.currPlayer].hotel.roomClose(1,0);
            game.players[game.currPlayer].hotel.roomClose(1,1);
            game.players[game.currPlayer].hotel.roomClose(1,2);
            game.players[game.currPlayer].hotel.roomClose(1,3);
            // game.players[game.currPlayer].hotel.roomClose(1,4);
            // game.players[game.currPlayer].hotel.roomClose(2,0);
            // game.players[game.currPlayer].hotel.roomClose(2,1);
            // game.players[game.currPlayer].hotel.roomClose(2,2);
            // game.players[game.currPlayer].hotel.roomClose(2,3);
            // game.players[game.currPlayer].hotel.roomClose(2,4);
            // game.players[game.currPlayer].hotel.roomClose(3,0);
            // game.players[game.currPlayer].hotel.roomClose(3,1);
            // game.players[game.currPlayer].hotel.roomClose(3,4);
            // test server effect
            // for(let i=0; i<6; i++){
            //     game.players[game.currPlayer].hireServer(0);
            // }
            game.players[game.currPlayer].addServerToHandDebug(13);
            // game.players[game.currPlayer].hireServer(game.players[game.currPlayer].numServerOnHand-1);
            // test guest bonus
            // game.players[game.currPlayer].hotel.addGuestToTable(57);
            // game.players[game.currPlayer].hotel.satisfyGuest(1);
            // test alert canvas
            // game.players[game.currPlayer].atSelectFood = 2;
            // game.alertType = 7;
            // game.players[game.currPlayer].updateAlertCanvas(alertContext);
        }
    }
    
    // normal start
    game.updateAllCanvas();
}

/*
// single-player mode, handle click by directly calling function
function handleGuestClickWrap(event){
    game.handleGuestClick(event);
}
function handleActionClickWrap(event){
    game.handleActionClick(event);
}
function handleHotelClickWrap(event) {
    game.handleHotelClick(event);
}
function handleServerClickWrap(event) {
    game.handleServerClick(event);
}
function handleAlertClickWrap(event) {
    game.handleAlertClick(event);
}
function handlePlayer0ClickWrap(event) {
    game.handlePlayer0Click(event);
}
function handlePlayer1ClickWrap(event) {
    game.handlePlayer1Click(event);
}
function handlePlayer2ClickWrap(event) {
    game.handlePlayer2Click(event);
}
function handlePlayer3ClickWrap(event) {
    game.handlePlayer3Click(event);
}
*/

// multi-player mode, handle click by sending event to server and broadcast to everyone including ourself
// can only send out when it's our controlled player's turn
function handleGuestClickWrap(event){
    if(game.currPlayer == game.ourPlayer) {
        var msg = {
            type: "broadcast",
            canvasType: "guest",
            roomID: roomID,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };
        socket.send(JSON.stringify(msg));
    }
}
function handleActionClickWrap(event){
    if(game.currPlayer == game.ourPlayer) {
        var msg = {
            type: "broadcast",
            canvasType: "action",
            roomID: roomID,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };
        socket.send(JSON.stringify(msg));
    }
}
function handleHotelClickWrap(event) {
    if(game.currPlayer == game.ourPlayer) {
        var msg = {
            type: "broadcast",
            canvasType: "hotel",
            roomID: roomID,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };
        socket.send(JSON.stringify(msg));
    }
}
function handleServerClickWrap(event) {
    if(game.currPlayer == game.ourPlayer) {
        var msg = {
            type: "broadcast",
            canvasType: "server",
            roomID: roomID,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };
        socket.send(JSON.stringify(msg));
    }
}
function handleAlertClickWrap(event) {
    if(game.currPlayer == game.ourPlayer) {
        var msg = {
            type: "broadcast",
            canvasType: "alert",
            roomID: roomID,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };
        socket.send(JSON.stringify(msg));
    }
}
function handlePlayer0ClickWrap(event) {
    if(game.currPlayer == game.ourPlayer) {
        var msg = {
            type: "broadcast",
            canvasType: "player0",
            roomID: roomID,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };
        socket.send(JSON.stringify(msg));
    }
}
function handlePlayer1ClickWrap(event) {
    if(game.currPlayer == game.ourPlayer) {
        var msg = {
            type: "broadcast",
            canvasType: "player1",
            roomID: roomID,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };
        socket.send(JSON.stringify(msg));
    }
}
function handlePlayer2ClickWrap(event) {
    if(game.currPlayer == game.ourPlayer) {
        var msg = {
            type: "broadcast",
            canvasType: "player2",
            roomID: roomID,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };
        socket.send(JSON.stringify(msg));
    }
}
function handlePlayer3ClickWrap(event) {
    if(game.currPlayer == game.ourPlayer) {
        var msg = {
            type: "broadcast",
            canvasType: "player3",
            roomID: roomID,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };
        socket.send(JSON.stringify(msg));
    }
}
function handleRestartWrap(event) {
    if(game.currPlayer == game.ourPlayer) {
        var msg = {
            type: "broadcast",
            canvasType: "restart",
            roomID: roomID,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };
        socket.send(JSON.stringify(msg));
    }
}
