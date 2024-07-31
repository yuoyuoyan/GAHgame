var playerNames = JSON.parse(decodeURIComponent(document.cookie));
const skipPrepare = 1;
const debugState = 1;

// init game info and draw background
window.onload = gameOn;
const game = new Game(playerNames.length, playerNames, 1);

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

// test plan
// 1. First guest invitation and room preparation, done
// 2. all actions, done
// 3. room bonus, done
// 4. major tasks, done
// 5. all servers
// 6. all guests
// 7. royal tasks

function gameOn() {
    // skip the first guest round
    if(skipPrepare) {
        for(let i=0; i<4; i++){
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
        game.currPlayer = 0;
        if(debugState) {
            // test major task
            // game.majorTask0 = 0;
            // game.majorTask1 = 0;
            // game.majorTask2 = 0;
            // test royal task
            // game.alertType = 7;
            // game.mainRound = 6;
            // game.royalTask0 = 1;
            // game.royalTask1 = 3;
            // game.royalTask2 = 3;
            // game.players[game.currPlayer].royalResult = 0;
            // game.players[game.currPlayer].updateAlertCanvas(alertContext);
            // test room closure and bonus
            // game.players[game.currPlayer].hotel.roomPrepare(0,3);
            // game.players[game.currPlayer].hotel.roomPrepare(0,4);
            // game.players[game.currPlayer].hotel.roomPrepare(1,0);
            // game.players[game.currPlayer].hotel.roomPrepare(1,1);
            // game.players[game.currPlayer].hotel.roomPrepare(1,2);
            // game.players[game.currPlayer].hotel.roomPrepare(1,3);
            // game.players[game.currPlayer].hotel.roomPrepare(1,4);
            // game.players[game.currPlayer].hotel.roomPrepare(2,0);
            // game.players[game.currPlayer].hotel.roomPrepare(2,1);
            // game.players[game.currPlayer].hotel.roomPrepare(2,2);
            // game.players[game.currPlayer].hotel.roomPrepare(2,3);
            // game.players[game.currPlayer].hotel.roomPrepare(2,4);
            // game.players[game.currPlayer].hotel.roomPrepare(3,0);
            // game.players[game.currPlayer].hotel.roomPrepare(3,1);
            // game.players[game.currPlayer].hotel.roomPrepare(3,4);
            // game.players[game.currPlayer].hotel.roomClose(0,0);
            // game.players[game.currPlayer].hotel.roomClose(0,1);
            // game.players[game.currPlayer].hotel.roomClose(0,2);
            // game.players[game.currPlayer].hotel.roomClose(0,3);
            // game.players[game.currPlayer].hotel.roomClose(0,4);
            // game.players[game.currPlayer].hotel.roomClose(1,0);
            // game.players[game.currPlayer].hotel.roomClose(1,1);
            // game.players[game.currPlayer].hotel.roomClose(1,2);
            // game.players[game.currPlayer].hotel.roomClose(1,3);
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
            // game.players[game.currPlayer].serverHired.push(new Server(0));
            // game.players[game.currPlayer].serverHired.push(new Server(1));
            // game.players[game.currPlayer].serverHired.push(new Server(2));
            // game.players[game.currPlayer].serverHired.push(new Server(3));
            // game.players[game.currPlayer].serverHired.push(new Server(4));
            // game.players[game.currPlayer].serverHired.push(new Server(5));
            // game.players[game.currPlayer].numServerHired = 6;
            // game.players[game.currPlayer].calculateFinalGamePoint();
            // test guest bonus
            // game.players[game.currPlayer].hotel.addGuestToTable(25);
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
