var playerNames = JSON.parse(decodeURIComponent(document.cookie));

// init game info and draw background
window.onload = gameOn;
const game = new Game(playerNames.length, playerNames, 1);

const skipPrepare = 1;
const debugState = 1;

function gameOn() {
    // debug
    // game.players[0].updateAlertCanvas(alertContext, 4);
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
            // add something special
            // game.players[game.currPlayer].addServerToHand(26);
            game.rollDice();
        }
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
            // game.players[game.currPlayer].serverHired.push(new Server(32));
            // game.players[game.currPlayer].numServerHired = 1;
            // game.players[game.currPlayer].calculateFinalGamePoint();
            // test guest bonus
            game.players[game.currPlayer].hotel.addGuestToTable(25);
            game.players[game.currPlayer].hotel.satisfyGuest(1);
        }
    }
    
    // normal start
    game.updateGuestCanvas(guestContext);
    game.updateActionCanvas(actionContext);
    for(let i=0; i<game.playerNumber; i++){
        game.players[i].updatePlayerCanvas(game.players[i].context);
    }
    game.players[0].hotel.updateHotelCanvas(hotelContext);
    game.players[0].updateServerCanvas(serverContext);
}
