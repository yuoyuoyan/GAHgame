var playerNameText = document.getElementById("playerNameText");
var playerButton = document.getElementById("playerButton");
var canvas = document.getElementById("nameboard");
var startButton = document.getElementById("startButton");
var context = canvas.getContext("2d");

// player list
var playerNames = [];

// add new player button
playerNameText.addEventListener("keyup", showNameEnter); // add a player name by type enter

playerButton.addEventListener("click", showNameClick); // add a player name by click button

function showNameEnter(event) {
    if(event.keyCode === 13) {
        showName(playerNameText.value);
        playerNameText.value = "";
    }
}

function showNameClick() {
    showName(playerNameText.value);
    playerNameText.value = "";
}

function showName(name) {
    if (name.trim() === "") {  // Check if the name is empty
        alert("Player name cannot be empty");
        return;
    }

    if (name.length > 64) {  // Check if the name is too long
        alert("Player name too long");
        return;
    }

    if (playerNames.length === 4) {  // Check if there are already 4 players
        alert("Cannot exceed four players");
        return;
    }

    console.log("add a name " + name);
    playerNames.push(name);  // Add the name to the array

    context.font = "20px Arial";
    context.fillText("player " + playerNames.length + ": " + name, 10, 25 + 25 * playerNames.length);
}

// button misc
playerButton.addEventListener("mouseover", () => {
    playerButton.style.cursor = 'pointer';
}); // change cursor style by hovering
playerButton.addEventListener("mouseout", () => {
    playerButton.style.cursor = 'default';
}); // change cursor style by move out

// start the game
startButton.addEventListener("click", startGame);

function startGame() {
    if(playerNames.length <= 0) { // no player
        alert("cannot start game without players");
        return;
    }

    // record player names in cookies and go to game page
    document.cookie = JSON.stringify(playerNames);
    window.location.href = "hotelgame.html";
}

// button misc
startButton.addEventListener("mouseover", () => {
    startButton.style.cursor = 'pointer';
}); // change cursor style by hovering
startButton.addEventListener("mouseout", () => {
    startButton.style.cursor = 'default';
}); // change cursor style by move out
