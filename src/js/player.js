const player0Canvas = document.getElementById("player0board");
const player1Canvas = document.getElementById("player1board");
const player2Canvas = document.getElementById("player2board");
const player3Canvas = document.getElementById("player3board");
const player0Context = player0Canvas.getContext("2d");
const player1Context = player1Canvas.getContext("2d");
const player2Context = player2Canvas.getContext("2d");
const player3Context = player3Canvas.getContext("2d");
const serverCanvas = document.getElementById("serverboard");
const serverContext = serverCanvas.getContext("2d");

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

var serverImg = [];
serverImg.push(document.getElementById("server0Img"));
serverImg.push(document.getElementById("server1Img"));
serverImg.push(document.getElementById("server2Img"));
serverImg.push(document.getElementById("server3Img"));
serverImg.push(document.getElementById("server4Img"));
serverImg.push(document.getElementById("server5Img"));
serverImg.push(document.getElementById("server6Img"));
serverImg.push(document.getElementById("server7Img"));
serverImg.push(document.getElementById("server8Img"));
serverImg.push(document.getElementById("server9Img"));
serverImg.push(document.getElementById("server10Img"));
serverImg.push(document.getElementById("server11Img"));
serverImg.push(document.getElementById("server12Img"));
serverImg.push(document.getElementById("server13Img"));
serverImg.push(document.getElementById("server14Img"));
serverImg.push(document.getElementById("server15Img"));
serverImg.push(document.getElementById("server16Img"));
serverImg.push(document.getElementById("server17Img"));
serverImg.push(document.getElementById("server18Img"));
serverImg.push(document.getElementById("server19Img"));
serverImg.push(document.getElementById("server20Img"));
serverImg.push(document.getElementById("server21Img"));
serverImg.push(document.getElementById("server22Img"));
serverImg.push(document.getElementById("server23Img"));
serverImg.push(document.getElementById("server24Img"));
serverImg.push(document.getElementById("server25Img"));
serverImg.push(document.getElementById("server26Img"));
serverImg.push(document.getElementById("server27Img"));
serverImg.push(document.getElementById("server28Img"));
serverImg.push(document.getElementById("server29Img"));
serverImg.push(document.getElementById("server30Img"));
serverImg.push(document.getElementById("server31Img"));
serverImg.push(document.getElementById("server32Img"));
serverImg.push(document.getElementById("server33Img"));
serverImg.push(document.getElementById("server34Img"));
serverImg.push(document.getElementById("server35Img"));
serverImg.push(document.getElementById("server36Img"));
serverImg.push(document.getElementById("server37Img"));
serverImg.push(document.getElementById("server38Img"));
serverImg.push(document.getElementById("server39Img"));
serverImg.push(document.getElementById("server40Img"));
serverImg.push(document.getElementById("server41Img"));
serverImg.push(document.getElementById("server42Img"));
serverImg.push(document.getElementById("server43Img"));
serverImg.push(document.getElementById("server44Img"));
serverImg.push(document.getElementById("server45Img"));
serverImg.push(document.getElementById("server46Img"));
serverImg.push(document.getElementById("server47Img"));

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
        this.serverOnHandCanvasIdx = 0;
        this.serverHired = [];
        this.serverHiredCanvasIdx = 0;
        this.numGuestOnTable = 0;
        this.guestOnTable = [];
        this.hotel = new Hotel(hotelID); // prepare hotel
        // draw the player board
        this.updatePlayerCanvas(this.context);
        // draw the server board
        this.updateServerCanvas(serverContext);
    }

    updateServerCanvas(context) {
        // Server on hands
        context.font="20px verdana";
        context.shadowColor="white";
        context.shadowBlur=2;
        context.lineWidth=2;
        context.strokeText("员工手牌", 25, 25);
        context.shadowBlur=0;
        context.fillStyle="black";
        context.fillText("员工手牌", 25, 25);

        // draw the remaining of prev card if any
        var   serverXoffset = -105;
        var   serverYoffset = 35;
        const serverWidth = 160;
        const serverHeight = 240;
        if(this.serverOnHandCanvasIdx>0 && this.numServerOnHand>0) { 
            context.drawImage(serverImg[this.serverOnHand[this.serverOnHandCanvasIdx-1].serverID], serverXoffset, serverYoffset, serverWidth, serverHeight);
            // draw the left triangle to indicate
            context.beginPath();
            context.moveTo(0, 105);
            context.lineTo(25,130);
            context.lineTo(25,80);
            context.fillStyle='black';
            context.fill();
        }
        
        // draw 3 server cards if any
        for(let i=0; i<3; i++){
            if(this.serverOnHandCanvasIdx + i < this.numServerOnHand){
                serverXoffset+=170;
                context.drawImage(serverImg[this.serverOnHand[this.serverOnHandCanvasIdx+i].serverID], serverXoffset, serverYoffset, serverWidth, serverHeight);
            }
        }

        // draw the remaining of next card if any
        if(this.serverOnHandCanvasIdx + 3 < this.numServerOnHand) {
            serverXoffset+=170;
            context.drawImage(serverImg[this.serverOnHand[this.serverOnHandCanvasIdx+3].serverID], serverXoffset, serverYoffset, serverWidth, serverHeight);
            // draw the right triangle to indicate
            context.beginPath();
            context.moveTo(640,105);
            context.lineTo(615,130);
            context.lineTo(615,80);
            context.fillStyle='black';
            context.fill();
        }

        // Server hired
        context.font="20px verdana";
        context.shadowColor="white";
        context.shadowBlur=2;
        context.lineWidth=2;
        context.strokeText("已雇佣员工", 25, 300);
        context.shadowBlur=0;
        context.fillStyle="black";
        context.fillText("已雇佣员工", 25, 300);

        // draw the remaining of prev card if any
        serverXoffset = -105;
        serverYoffset += 275;
        console.log("num server hired: " + this.numServerHired);
        if(this.serverHiredCanvasIdx>0 && this.numServerHired>0) { 
            context.drawImage(serverImg[this.serverHired[this.serverHiredCanvasIdx-1].serverID], serverXoffset, serverYoffset, serverWidth, serverHeight);
            // draw the left triangle to indicate
            context.beginPath();
            context.moveTo(0, 105+275);
            context.lineTo(25,130+275);
            context.lineTo(25,80+275);
            context.fillStyle='black';
            context.fill();
        }
        
        // draw 3 server cards if any
        for(let i=0; i<3; i++){
            if(this.serverHiredCanvasIdx + i < this.numServerHired){
                serverXoffset+=170;
                context.drawImage(serverImg[this.serverHired[this.serverHiredCanvasIdx+i].serverID], serverXoffset, serverYoffset, serverWidth, serverHeight);
            }
        }

        // draw the remaining of next card if any
        if(this.serverHiredCanvasIdx + 3 < this.numServerHired) {
            serverXoffset+=170;
            context.drawImage(serverImg[this.serverHired[this.serverHiredCanvasIdx+3].serverID], serverXoffset, serverYoffset, serverWidth, serverHeight);
            // draw the right triangle to indicate
            context.beginPath();
            context.moveTo(640,105+275);
            context.lineTo(615,130+275);
            context.lineTo(615,80+275);
            context.fillStyle='black';
            context.fill();
        }
    }

    updatePlayerCanvas(context) {
        // markers first
        const markerXoffset = 25;
        const markerYoffset = 25;
        const markerRadius = 10;
        context.fillStyle = this.markerColor;
        context.beginPath();
        context.arc(markerXoffset, markerYoffset, markerRadius, 0, 2 * Math.PI);
        context.fill();
        // draw the check mark if it's this player's turn
        if(this.blackturnFlag){
            context.lineWidth = 5;
            context.beginPath();
            context.moveTo(15, 20);
            context.lineTo(25, 30);
            context.lineTo(35, 10);
            context.strokeStyle = 'black';
            context.stroke();
        }

        // player name
        const nameXoffset = 50;
        const nameYoffset = 30;
        context.font="20px verdana";
        context.shadowColor="white";
        context.shadowBlur=2;
        context.lineWidth=2;
        context.strokeText(this.playerName.substring(0, 16), nameXoffset, nameYoffset);
        context.shadowBlur=0;
        context.fillStyle="black";
        context.fillText(this.playerName.substring(0, 16), nameXoffset, nameYoffset);

        // mini round status
        var   miniRoundXoffset = nameXoffset+150;
        var   miniRoundYoffset = 5;
        var   miniRoundWidth = 80;
        var   miniRoundHeight = 40;
        context.fillStyle = '#446516';
        context.strokeStyle = 'black';
        context.strokeRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
        context.fillRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
        
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
            context.drawImage(diceImg, miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
        } else { // draw the mini turn number
            context.fillStyle = '#446516';
            context.strokeStyle = 'black';
            context.strokeRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
            context.fillRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);

            context.shadowColor="black";
            context.shadowBlur=4;
            context.lineWidth=4;
            context.strokeText(this.miniTurn[0], miniRoundXoffset+13, miniRoundYoffset+22);
            context.shadowBlur=0;
            context.fillStyle="white";
            context.fillText(this.miniTurn[0], miniRoundXoffset+13, miniRoundYoffset+22);
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
            context.drawImage(diceImg, miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
        } else { // draw the mini turn number
            context.fillStyle = '#446516';
            context.strokeStyle = 'black';
            context.strokeRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
            context.fillRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);

            context.shadowColor="black";
            context.shadowBlur=4;
            context.lineWidth=4;
            context.strokeText(this.miniTurn[1], miniRoundXoffset+13, miniRoundYoffset+22);
            context.shadowBlur=0;
            context.fillStyle="white";
            context.fillText(this.miniTurn[1], miniRoundXoffset+13, miniRoundYoffset+22);
        }

        // game point
        var   gamePointXoffset = miniRoundXoffset+50;
        var   gamePointYoffset = 5;
        const gamePointWidth = 30;
        const gamePointHeigh = 40;
        context.drawImage(gamePointTokenImg, gamePointXoffset, gamePointYoffset, gamePointWidth, gamePointHeigh);
        gamePointXoffset += 40;
        gamePointYoffset = 30;
        context.shadowColor="white";
        context.shadowBlur=2;
        context.lineWidth=2;
        context.strokeText(this.gamePoint, gamePointXoffset, gamePointYoffset);
        context.shadowBlur=0;
        context.fillStyle="black";
        context.fillText(this.gamePoint, gamePointXoffset, gamePointYoffset);

        // royal point
        var   royalPointXoffset = gamePointXoffset+20;
        var   royalPointYoffset = 5;
        const royalPointWidth = 30;
        const royalPointHeigh = 40;
        context.drawImage(royalTokenImg, royalPointXoffset, royalPointYoffset, royalPointWidth, royalPointHeigh);
        royalPointXoffset += 40;
        royalPointYoffset = 30;
        context.shadowColor="white";
        context.shadowBlur=2;
        context.lineWidth=2;
        context.strokeText(this.royalPoint, royalPointXoffset, royalPointYoffset);
        context.shadowBlur=0;
        context.fillStyle="black";
        context.fillText(this.royalPoint, royalPointXoffset, royalPointYoffset);

        // kichen status
        // brown
        var   foodXoffset = royalPointXoffset+30;
        var   foodYoffset = 5;
        const foodWidth = 30;
        const foodHeigh = 30;
        context.drawImage(brownImg, foodXoffset, foodYoffset, foodWidth, foodHeigh);
        foodXoffset += 40;
        foodYoffset = 30;
        context.shadowColor="white";
        context.shadowBlur=2;
        context.lineWidth=2;
        context.strokeText(this.brown, foodXoffset, foodYoffset);
        context.shadowBlur=0;
        context.fillStyle="black";
        context.fillText(this.brown, foodXoffset, foodYoffset);

        // white
        foodXoffset += 30;
        foodYoffset = 5;
        context.drawImage(whiteImg, foodXoffset, foodYoffset, foodWidth, foodHeigh);
        foodXoffset += 40;
        foodYoffset = 30;
        context.shadowColor="white";
        context.shadowBlur=2;
        context.lineWidth=2;
        context.strokeText(this.white, foodXoffset, foodYoffset);
        context.shadowBlur=0;
        context.fillStyle="black";
        context.fillText(this.white, foodXoffset, foodYoffset);

        // red
        foodXoffset += 30;
        foodYoffset = 5;
        context.drawImage(redImg, foodXoffset, foodYoffset, foodWidth, foodHeigh);
        foodXoffset += 40;
        foodYoffset = 30;
        context.shadowColor="white";
        context.shadowBlur=2;
        context.lineWidth=2;
        context.strokeText(this.red, foodXoffset, foodYoffset);
        context.shadowBlur=0;
        context.fillStyle="black";
        context.fillText(this.red, foodXoffset, foodYoffset);

        // black
        foodXoffset += 30;
        foodYoffset = 5;
        context.drawImage(blackImg, foodXoffset, foodYoffset, foodWidth, foodHeigh);
        foodXoffset += 40;
        foodYoffset = 30;
        context.shadowColor="white";
        context.shadowBlur=2;
        context.lineWidth=2;
        context.strokeText(this.black, foodXoffset, foodYoffset);
        context.shadowBlur=0;
        context.fillStyle="black";
        context.fillText(this.black, foodXoffset, foodYoffset);

        // operation if it's this player's turn, including invite, action, serve, and checkout
        var   opXoffset = foodXoffset+30;
        var   opYoffset = 10;
        const opWidth = 40;
        const opHeigh = 20;
        if(this.turnFlag){
            if(this.opInvite){
                context.fillStyle = 'white';
            } else {
                context.fillStyle = 'grey';
            }
            context.strokeStyle = 'black';
            context.strokeRect(opXoffset, opYoffset, opWidth, opHeigh);
            context.fillRect(opXoffset, opYoffset, opWidth, opHeigh);
            context.font="15px Arial";
            context.fillStyle="black";
            context.fillText("邀请", opXoffset+6, opYoffset+15);

            opXoffset += 45;
            if(this.opAction){
                context.fillStyle = 'white';
            } else {
                context.fillStyle = 'grey';
            }
            context.strokeStyle = 'black';
            context.strokeRect(opXoffset, opYoffset, opWidth, opHeigh);
            context.fillRect(opXoffset, opYoffset, opWidth, opHeigh);
            context.font="15px Arial";
            context.fillStyle="black";
            context.fillText("取骰", opXoffset+6, opYoffset+15);

            opXoffset += 45;
            if(this.opServe){
                context.fillStyle = 'white';
            } else {
                context.fillStyle = 'grey';
            }
            context.strokeStyle = 'black';
            context.strokeRect(opXoffset, opYoffset, opWidth, opHeigh);
            context.fillRect(opXoffset, opYoffset, opWidth, opHeigh);
            context.font="15px Arial";
            context.fillStyle="black";
            context.fillText("上菜", opXoffset+6, opYoffset+15);

            opXoffset += 45;
            if(this.opCheckout){
                context.fillStyle = 'white';
            } else {
                context.fillStyle = 'grey';
            }
            context.strokeStyle = 'black';
            context.strokeRect(opXoffset, opYoffset, opWidth, opHeigh);
            context.fillRect(opXoffset, opYoffset, opWidth, opHeigh);
            context.font="15px Arial";
            context.fillStyle="black";
            context.fillText("结算", opXoffset+6, opYoffset+15);
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
        this.serverOnHand.push(new Server(serverID));
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