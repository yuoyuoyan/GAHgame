var playerNames = JSON.parse(decodeURIComponent(document.cookie));

// init game info and draw background
window.onload = gameOn;
const game = new Game(playerNames.length, playerNames, 1);

function gameOn() {
    game.updateGuestCanvas(guestContext);
    game.updateActionCanvas(actionContext);
    for(let i=0; i<game.playerNumber; i++){
        game.players[i].updatePlayerCanvas(game.players[i].context);
    }
    game.players[0].hotel.updateHotelCanvas(hotelContext);
    game.players[0].updateServerCanvas(serverContext);
}
