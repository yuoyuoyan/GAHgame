const actionCanvas = document.getElementById("actionboard");
const playerCanvas = document.getElementById("playerboard");
const detailCanvas = document.getElementById("detailboard");
const actionContext = actionCanvas.getContext("2d");
const playerContext = playerCanvas.getContext("2d");
const detailContext = detailCanvas.getContext("2d");

const actionBoardImg = document.getElementById("actionBoardImg");

var playerNames = JSON.parse(decodeURIComponent(document.cookie));

// init game info and draw background
window.onload = gameInit;

function gameInit() {
    // set random seed
    const now = new Date().getTime();
    actionContext.drawImage(actionBoardImg, 0, 0);
    console.log("number of players from cookie: " + playerNames.length);
    playerContext.font = "20px Arial";
    for(let i=0; i<playerNames.length; i++){
        playerContext.fillText("player " + i + ": " + playerNames[i], 10, 25 * i + 25);
    }
    const game = new Game(playerNames.length, playerNames, 1);
    game.updateGuestCanvas(guestContext);
}

