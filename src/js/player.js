const player0Canvas = document.getElementById("player0board");
const player1Canvas = document.getElementById("player1board");
const player2Canvas = document.getElementById("player2board");
const player3Canvas = document.getElementById("player3board");
const player0Context = player0Canvas.getContext("2d");
const player1Context = player1Canvas.getContext("2d");
const player2Context = player2Canvas.getContext("2d");
const player3Context = player3Canvas.getContext("2d");
const detailCanvas = document.getElementById("detailboard");
const detailContext = detailCanvas.getContext("2d");

const gamePointTokenImg = document.getElementById("gamePointTokenImg");
const royalTokenImg = document.getElementById("royalTokenImg");
const brownImg = document.getElementById("brownImg");
const whiteImg = document.getElementById("whiteImg");
const redImg = document.getElementById("redImg");
const blackImg = document.getElementById("blackImg");
const dice1Img = document.getElementById("dice1Img");
const dice2Img = document.getElementById("dice2Img");
const dice3Img = document.getElementById("dice3Img");
const dice4Img = document.getElementById("dice4Img");
const dice5Img = document.getElementById("dice5Img");
const dice6Img = document.getElementById("dice6Img");

// Player class definition
class Player{
    constructor(playerID, playerName, hotelID) {
        // init player basic info
        this.playerID = playerID;
        this.playerName = playerName;
        switch(this.playerID){
            case 0: this.canvas = player0Canvas; this.context = player0Context; this.markerColor = "blue"; break;
            case 1: this.canvas = player1Canvas; this.context = player1Context; this.markerColor = "red"; break;
            case 2: this.canvas = player2Canvas; this.context = player2Context; this.markerColor = "yellow"; break;
            case 3: this.canvas = player3Canvas; this.context = player3Context; this.markerColor = "grey"; break;
        }
        this.turnFlag = false; // assert when it's this player's turn
        this.miniTurn = [0, 0];
        this.diceTaken = [-1, -1];
        this.opInvite = true;
        this.opAction = true;
        this.opServe = true;
        this.opCheckout = false;
        this.gamePoint = 0;
        this.royalPoint = 0;
        this.hotelID = hotelID;
        this.brown = 1;
        this.white = 1;
        this.red = 1;
        this.black = 1;
        this.money = 10;
        this.numServerOnHand = 0;
        this.numServerHired = 0;
        this.serverOnHand = []; // empty hand at first, waiting for top to give servers
        this.serverHired = [];
        this.numGuestOnTable = 0;
        this.guestOnTable = [];
        this.hotel = new Hotel(hotelID); // prepare hotel
        // draw the detail board
        this.updatePlayerCanvas();
    }

    updatePlayerCanvas() {
        // markers first
        const markerXoffset = 25;
        const markerYoffset = 25;
        const markerRadius = 10;
        this.context.fillStyle = this.markerColor;
        this.context.beginPath();
        this.context.arc(markerXoffset, markerYoffset, markerRadius, 0, 2 * Math.PI);
        this.context.fill();
        // draw the check mark if it's this player's turn
        if(this.turnFlag){
            this.context.lineWidth = 5;
            this.context.beginPath();
            this.context.moveTo(15, 20);
            this.context.lineTo(25, 30);
            this.context.lineTo(35, 10);
            this.context.strokeStyle = 'black';
            this.context.stroke();
        }

        // player name
        const nameXoffset = 50;
        const nameYoffset = 30;
        this.context.font="20px verdana";
        this.context.shadowColor="white";
        this.context.shadowBlur=2;
        this.context.lineWidth=2;
        this.context.strokeText(this.playerName.substring(0, 16), nameXoffset, nameYoffset);
        this.context.shadowBlur=0;
        this.context.fillStyle="black";
        this.context.fillText(this.playerName.substring(0, 16), nameXoffset, nameYoffset);

        // mini round status
        var   miniRoundXoffset = nameXoffset+150;
        var   miniRoundYoffset = 5;
        var   miniRoundWidth = 80;
        var   miniRoundHeight = 40;
        this.context.fillStyle = '#446516';
        this.context.strokeStyle = 'black';
        this.context.strokeRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
        this.context.fillRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
        
        var   miniRoundXoffset = nameXoffset+152;
        var   miniRoundYoffset = 8;
        var   miniRoundWidth = 34;
        var   miniRoundHeight = 34;
        if(this.diceTaken[0] != -1){ // draw the dice
            var diceImg = dice1Img;
            switch(this.diceTaken[0]){
                case 1: diceImg = dice1Img; break;
                case 2: diceImg = dice2Img; break;
                case 3: diceImg = dice3Img; break;
                case 4: diceImg = dice4Img; break;
                case 5: diceImg = dice5Img; break;
                case 6: diceImg = dice6Img; break;
            }
            this.context.drawImage(diceImg, miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
        } else { // draw the mini turn number
            this.context.fillStyle = '#446516';
            this.context.strokeStyle = 'black';
            this.context.strokeRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
            this.context.fillRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);

            this.context.shadowColor="black";
            this.context.shadowBlur=4;
            this.context.lineWidth=4;
            this.context.strokeText(this.miniTurn[0], miniRoundXoffset+13, miniRoundYoffset+22);
            this.context.shadowBlur=0;
            this.context.fillStyle="white";
            this.context.fillText(this.miniTurn[0], miniRoundXoffset+13, miniRoundYoffset+22);
        }

        var   miniRoundXoffset = nameXoffset+192;
        var   miniRoundYoffset = 8;
        var   miniRoundWidth = 34;
        var   miniRoundHeight = 34;
        if(this.diceTaken[0] != -1){ // draw the dice
            var diceImg = dice1Img;
            switch(this.diceTaken[1]){
                case 1: diceImg = dice1Img; break;
                case 2: diceImg = dice2Img; break;
                case 3: diceImg = dice3Img; break;
                case 4: diceImg = dice4Img; break;
                case 5: diceImg = dice5Img; break;
                case 6: diceImg = dice6Img; break;
            }
            this.context.drawImage(diceImg, miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
        } else { // draw the mini turn number
            this.context.fillStyle = '#446516';
            this.context.strokeStyle = 'black';
            this.context.strokeRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
            this.context.fillRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);

            this.context.shadowColor="black";
            this.context.shadowBlur=4;
            this.context.lineWidth=4;
            this.context.strokeText(this.miniTurn[1], miniRoundXoffset+13, miniRoundYoffset+22);
            this.context.shadowBlur=0;
            this.context.fillStyle="white";
            this.context.fillText(this.miniTurn[1], miniRoundXoffset+13, miniRoundYoffset+22);
        }

        // game point
        var   gamePointXoffset = miniRoundXoffset+50;
        var   gamePointYoffset = 5;
        const gamePointWidth = 30;
        const gamePointHeigh = 40;
        this.context.drawImage(gamePointTokenImg, gamePointXoffset, gamePointYoffset, gamePointWidth, gamePointHeigh);
        gamePointXoffset += 40;
        gamePointYoffset = 30;
        this.context.shadowColor="white";
        this.context.shadowBlur=2;
        this.context.lineWidth=2;
        this.context.strokeText(this.gamePoint, gamePointXoffset, gamePointYoffset);
        this.context.shadowBlur=0;
        this.context.fillStyle="black";
        this.context.fillText(this.gamePoint, gamePointXoffset, gamePointYoffset);

        // royal point
        var   royalPointXoffset = gamePointXoffset+20;
        var   royalPointYoffset = 5;
        const royalPointWidth = 30;
        const royalPointHeigh = 40;
        this.context.drawImage(royalTokenImg, royalPointXoffset, royalPointYoffset, royalPointWidth, royalPointHeigh);
        royalPointXoffset += 40;
        royalPointYoffset = 30;
        this.context.shadowColor="white";
        this.context.shadowBlur=2;
        this.context.lineWidth=2;
        this.context.strokeText(this.gamePoint, royalPointXoffset, royalPointYoffset);
        this.context.shadowBlur=0;
        this.context.fillStyle="black";
        this.context.fillText(this.gamePoint, royalPointXoffset, royalPointYoffset);

        // kichen status
        // brown
        var   foodXoffset = royalPointXoffset+30;
        var   foodYoffset = 5;
        const foodWidth = 30;
        const foodHeigh = 30;
        this.context.drawImage(brownImg, foodXoffset, foodYoffset, foodWidth, foodHeigh);
        foodXoffset += 40;
        foodYoffset = 30;
        this.context.shadowColor="white";
        this.context.shadowBlur=2;
        this.context.lineWidth=2;
        this.context.strokeText(this.brown, foodXoffset, foodYoffset);
        this.context.shadowBlur=0;
        this.context.fillStyle="black";
        this.context.fillText(this.brown, foodXoffset, foodYoffset);

        // white
        foodXoffset += 30;
        foodYoffset = 5;
        this.context.drawImage(whiteImg, foodXoffset, foodYoffset, foodWidth, foodHeigh);
        foodXoffset += 40;
        foodYoffset = 30;
        this.context.shadowColor="white";
        this.context.shadowBlur=2;
        this.context.lineWidth=2;
        this.context.strokeText(this.white, foodXoffset, foodYoffset);
        this.context.shadowBlur=0;
        this.context.fillStyle="black";
        this.context.fillText(this.white, foodXoffset, foodYoffset);

        // red
        foodXoffset += 30;
        foodYoffset = 5;
        this.context.drawImage(redImg, foodXoffset, foodYoffset, foodWidth, foodHeigh);
        foodXoffset += 40;
        foodYoffset = 30;
        this.context.shadowColor="white";
        this.context.shadowBlur=2;
        this.context.lineWidth=2;
        this.context.strokeText(this.red, foodXoffset, foodYoffset);
        this.context.shadowBlur=0;
        this.context.fillStyle="black";
        this.context.fillText(this.red, foodXoffset, foodYoffset);

        // black
        foodXoffset += 30;
        foodYoffset = 5;
        this.context.drawImage(blackImg, foodXoffset, foodYoffset, foodWidth, foodHeigh);
        foodXoffset += 40;
        foodYoffset = 30;
        this.context.shadowColor="white";
        this.context.shadowBlur=2;
        this.context.lineWidth=2;
        this.context.strokeText(this.black, foodXoffset, foodYoffset);
        this.context.shadowBlur=0;
        this.context.fillStyle="black";
        this.context.fillText(this.black, foodXoffset, foodYoffset);

        // operation if it's this player's turn, including invite, action, serve, and checkout
        var   opXoffset = foodXoffset+30;
        var   opYoffset = 10;
        const opWidth = 40;
        const opHeigh = 20;
        if(this.turnFlag){
            if(this.opInvite){
                this.context.fillStyle = 'white';
            } else {
                this.context.fillStyle = 'grey';
            }
            this.context.strokeStyle = 'black';
            this.context.strokeRect(opXoffset, opYoffset, opWidth, opHeigh);
            this.context.fillRect(opXoffset, opYoffset, opWidth, opHeigh);
            this.context.font="15px Arial";
            this.context.fillStyle="black";
            this.context.fillText("邀请", opXoffset+6, opYoffset+15);

            opXoffset += 45;
            if(this.opAction){
                this.context.fillStyle = 'white';
            } else {
                this.context.fillStyle = 'grey';
            }
            this.context.strokeStyle = 'black';
            this.context.strokeRect(opXoffset, opYoffset, opWidth, opHeigh);
            this.context.fillRect(opXoffset, opYoffset, opWidth, opHeigh);
            this.context.font="15px Arial";
            this.context.fillStyle="black";
            this.context.fillText("取骰", opXoffset+6, opYoffset+15);

            opXoffset += 45;
            if(this.opServe){
                this.context.fillStyle = 'white';
            } else {
                this.context.fillStyle = 'grey';
            }
            this.context.strokeStyle = 'black';
            this.context.strokeRect(opXoffset, opYoffset, opWidth, opHeigh);
            this.context.fillRect(opXoffset, opYoffset, opWidth, opHeigh);
            this.context.font="15px Arial";
            this.context.fillStyle="black";
            this.context.fillText("上菜", opXoffset+6, opYoffset+15);

            opXoffset += 45;
            if(this.opCheckout){
                this.context.fillStyle = 'white';
            } else {
                this.context.fillStyle = 'grey';
            }
            this.context.strokeStyle = 'black';
            this.context.strokeRect(opXoffset, opYoffset, opWidth, opHeigh);
            this.context.fillRect(opXoffset, opYoffset, opWidth, opHeigh);
            this.context.font="15px Arial";
            this.context.fillStyle="black";
            this.context.fillText("结算", opXoffset+6, opYoffset+15);
        }
    }

    setMiniTurn(turn0, turn1) {
        this.miniTurn = [turn0, turn1];
    }

    setDiceTaken(turn, dice) {
        if(turn<0 || turn>1 || dice<1 || dice>6){ // mini turn can only be 0 or 1
            return;
        } else {
            this.diceTaken[turn] = dice;
        }
    }

    gainGamePoint(value) {
        this.gamePoint += value;
    }

    loseGamePoint(value) {
        this.gamePoint = Math.max(this.gamePoint-value, 0); // cannot below 0
    }

    getGamePoint() {
        return this.gamePoint;
    }

    gainRoyalPoint(value) {
        if(this.royalPoint + value > 13){ // royal overflow to game point
            this.gamePoint += (this.royalPoint + value - 13);
        } else {
            this.royalPoint += value;
        }
    }

    loseRoyalPoint(value) {
        this.royalPoint = Math.max(this.royalPoint-value, 0); // cannot below 0
    }

    getRoyalPoint() {
        return this.royalPoint;
    }

    gainBrown() {
        this.brown++; // one at a time
    }

    loseBrown() {
        this.brown--; // one at a time
    }

    hasBrown() {
        return this.brown >= 0;
    }

    gainWhite() {
        this.white++; // one at a time
    }

    loseWhite() {
        this.white--; // one at a time
    }

    hasWhite() {
        return this.white >= 0;
    }

    gainRed() {
        this.red++; // one at a time
    }

    loseRed() {
        this.red--; // one at a time
    }

    hasRed() {
        return this.red >= 0;
    }

    gainBlack() {
        this.black++; // one at a time
    }

    loseBlack() {
        this.black--; // one at a time
    }

    hasBlack() {
        return this.black >= 0;
    }

    clearKitchen() {
        this.brown = 0;
        this.white = 0;
        this.red = 0;
        this.black = 0;
    }

    hasMoney(value) {
        return this.money >= value;
    }

    gainMoney(value) {
        this.money += value;
    }

    loseMoney(value) {
        this.money -= value;
    }

    addServerToHand(serverID) {
        this.numServerOnHand++;
        this.serverOnHand.push(serverID);
    }

    removeServerFromHand() {
        this.numServerOnHand--;
        this.serverOnHand.pop();
    }

    hireServer(serverIndex) {
        if(serverIndex >= this.serverOnHand.length){ // overflow
            return;
        }

        this.serverHired.push(this.serverOnHand[serverIndex]);
        this.numServerHired++;
        this.serverOnHand.splice(serverIndex, 1); // remove this server on hand
        this.numServerOnHand--;
    }

    removeHiredServer(serverIndex) {
        if(serverIndex >= this.serverHired.length){ // overflow
            return;
        }

        this.serverHired.splice(serverIndex, 1); // remove this hired server
        this.numServerHired--;
    }

    hasHiredServer(serverID) {
        for(let i=0; i<this.serverHired.length; i++){
            if(this.serverHired[i].serverID == serverID){
                return true;
            }
        }
        return false;
    }
}