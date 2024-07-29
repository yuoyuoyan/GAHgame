var playerNames = JSON.parse(decodeURIComponent(document.cookie));

// init game info and draw background
window.onload = gameOn;
const game = new Game(playerNames.length, playerNames, 1);

const skipPrepare = 1;

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
            game.players[game.currPlayer].addServerToHand(0);
            game.rollDice();
        }
        game.currPlayer = 0;
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
