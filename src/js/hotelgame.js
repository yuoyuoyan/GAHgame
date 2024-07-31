var playerNames = JSON.parse(decodeURIComponent(document.cookie));
const skipPrepare = 0;
const debugState = 0;

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

function gameOn() {
    // debug
    // game.alertType = 4;
    // game.players[0].updateAlertCanvas(alertContext);
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
            game.players[game.currPlayer].hotel.firstThreeRoom = false;
            game.players[game.currPlayer].hotel.roomHighLightFlag = false;
            game.players[game.currPlayer].checkOpStatus();
        }
        game.rollDice();
        game.currPlayer = 0;
        if(debugState) {
            // test room closure and bonus
            // game.players[game.currPlayer].hotel.roomPrepare(0,3);
            // game.players[game.currPlayer].hotel.roomPrepare(0,4);
            // game.players[game.currPlayer].hotel.roomPrepare(1,4);
            // game.players[game.currPlayer].hotel.roomPrepare(2,4);
            // game.players[game.currPlayer].hotel.roomPrepare(3,4);
            // game.players[game.currPlayer].hotel.roomClose(0,0);
            // game.players[game.currPlayer].hotel.roomClose(0,1);
            // game.players[game.currPlayer].hotel.roomClose(0,2);
            // game.players[game.currPlayer].hotel.roomClose(0,3);
            // game.players[game.currPlayer].hotel.roomClose(0,4);
            // game.players[game.currPlayer].hotel.roomClose(1,4);
            // game.players[game.currPlayer].hotel.roomClose(2,4);
            // game.players[game.currPlayer].hotel.roomClose(3,4);
            // game.players[game.currPlayer].hotel.roomPrepare(1,3);
            // game.players[game.currPlayer].hotel.roomPrepare(2,3);
            // game.players[game.currPlayer].hotel.roomPrepare(3,3);
            // test server effect
            // const finalServerID = [26, 27, 28, 29, 30, 31, 33, 36, 39, 40, 45, 46, 47];
            // game.players[1].serverHired.push(new Server(45));
            // game.players[2].serverHired.push(new Server(46));
            // game.players[game.currPlayer].serverHired.push(new Server(25));
            // game.players[game.currPlayer].numServerHired = 1;
            // game.players[game.currPlayer].calculateFinalGamePoint();
            // test guest bonus
            // game.players[game.currPlayer].hotel.addGuestToTable(25);
            // game.players[game.currPlayer].hotel.satisfyGuest(1);
            // test alert canvas
            // game.players[game.currPlayer].atSelectFood = 2;
            // game.alertType = 7;
            // game.players[game.currPlayer].updateAlertCanvas(alertContext);
            // test royal task
            // game.alertType = 7;
            // game.mainRound = 6;
            // game.royalTask0 = 1;
            // game.royalTask1 = 3;
            // game.royalTask2 = 3;
            // game.players[game.currPlayer].royalResult = 0;
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
