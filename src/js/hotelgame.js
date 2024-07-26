var playerNames = JSON.parse(decodeURIComponent(document.cookie));

// init game info and draw background
window.onload = gameInit;

function gameInit() {
    // set random seed
    const now = new Date().getTime();
    console.log("number of players from cookie: " + playerNames.length);
    const game = new Game(playerNames.length, playerNames, 0);
}

