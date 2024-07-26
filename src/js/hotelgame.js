var playerNames = JSON.parse(decodeURIComponent(document.cookie));

// init game info and draw background
window.onload = gameInit;

function gameInit() {
    // set random seed
    const now = new Date().getTime();
    console.log("number of players from cookie: " + playerNames.length);
    // player0Context.font = "20px Arial";
    // player0Context.fillText("player number: " + playerNames.length, 0, 0);
    const game = new Game(playerNames.length, playerNames, 1);
    game.updateGuestCanvas(guestContext);
}

