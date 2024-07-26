const guestCanvas  = document.getElementById("guestboard");
const guestContext  = guestCanvas .getContext("2d");

const guestBoardImg = document.getElementById("guestBoardImg");
const majorTaskA0Img = document.getElementById("majorTaskA0Img");
const majorTaskA1Img = document.getElementById("majorTaskA1Img");
const majorTaskA2Img = document.getElementById("majorTaskA2Img");
const majorTaskA3Img = document.getElementById("majorTaskA3Img");
const majorTaskB0Img = document.getElementById("majorTaskB0Img");
const majorTaskB1Img = document.getElementById("majorTaskB1Img");
const majorTaskB2Img = document.getElementById("majorTaskB2Img");
const majorTaskB3Img = document.getElementById("majorTaskB3Img");
const majorTaskC0Img = document.getElementById("majorTaskC0Img");
const majorTaskC1Img = document.getElementById("majorTaskC1Img");
const majorTaskC2Img = document.getElementById("majorTaskC2Img");
const majorTaskC3Img = document.getElementById("majorTaskC3Img");
const royalTaskA0Img = document.getElementById("royalTaskA0Img");
const royalTaskA1Img = document.getElementById("royalTaskA1Img");
const royalTaskA2Img = document.getElementById("royalTaskA2Img");
const royalTaskA3Img = document.getElementById("royalTaskA3Img");
const royalTaskB0Img = document.getElementById("royalTaskB0Img");
const royalTaskB1Img = document.getElementById("royalTaskB1Img");
const royalTaskB2Img = document.getElementById("royalTaskB2Img");
const royalTaskB3Img = document.getElementById("royalTaskB3Img");
const royalTaskC0Img = document.getElementById("royalTaskC0Img");
const royalTaskC1Img = document.getElementById("royalTaskC1Img");
const royalTaskC2Img = document.getElementById("royalTaskC2Img");
const royalTaskC3Img = document.getElementById("royalTaskC3Img");
var guestImg = [];
guestImg.push(document.getElementById("guest0Img"));
guestImg.push(document.getElementById("guest1Img"));
guestImg.push(document.getElementById("guest2Img"));
guestImg.push(document.getElementById("guest3Img"));
guestImg.push(document.getElementById("guest4Img"));
guestImg.push(document.getElementById("guest5Img"));
guestImg.push(document.getElementById("guest6Img"));
guestImg.push(document.getElementById("guest7Img"));
guestImg.push(document.getElementById("guest8Img"));
guestImg.push(document.getElementById("guest9Img"));
guestImg.push(document.getElementById("guest10Img"));
guestImg.push(document.getElementById("guest11Img"));
guestImg.push(document.getElementById("guest12Img"));
guestImg.push(document.getElementById("guest13Img"));
guestImg.push(document.getElementById("guest14Img"));
guestImg.push(document.getElementById("guest15Img"));
guestImg.push(document.getElementById("guest16Img"));
guestImg.push(document.getElementById("guest17Img"));
guestImg.push(document.getElementById("guest18Img"));
guestImg.push(document.getElementById("guest19Img"));
guestImg.push(document.getElementById("guest20Img"));
guestImg.push(document.getElementById("guest21Img"));
guestImg.push(document.getElementById("guest22Img"));
guestImg.push(document.getElementById("guest23Img"));
guestImg.push(document.getElementById("guest24Img"));
guestImg.push(document.getElementById("guest25Img"));
guestImg.push(document.getElementById("guest26Img"));
guestImg.push(document.getElementById("guest27Img"));
guestImg.push(document.getElementById("guest28Img"));
guestImg.push(document.getElementById("guest29Img"));
guestImg.push(document.getElementById("guest30Img"));
guestImg.push(document.getElementById("guest31Img"));
guestImg.push(document.getElementById("guest32Img"));
guestImg.push(document.getElementById("guest33Img"));
guestImg.push(document.getElementById("guest34Img"));
guestImg.push(document.getElementById("guest35Img"));
guestImg.push(document.getElementById("guest36Img"));
guestImg.push(document.getElementById("guest37Img"));
guestImg.push(document.getElementById("guest38Img"));
guestImg.push(document.getElementById("guest39Img"));
guestImg.push(document.getElementById("guest40Img"));
guestImg.push(document.getElementById("guest41Img"));
guestImg.push(document.getElementById("guest42Img"));
guestImg.push(document.getElementById("guest43Img"));
guestImg.push(document.getElementById("guest44Img"));
guestImg.push(document.getElementById("guest45Img"));
guestImg.push(document.getElementById("guest46Img"));
guestImg.push(document.getElementById("guest47Img"));
guestImg.push(document.getElementById("guest48Img"));
guestImg.push(document.getElementById("guest49Img"));
guestImg.push(document.getElementById("guest50Img"));
guestImg.push(document.getElementById("guest51Img"));
guestImg.push(document.getElementById("guest52Img"));
guestImg.push(document.getElementById("guest53Img"));
guestImg.push(document.getElementById("guest54Img"));
guestImg.push(document.getElementById("guest55Img"));
guestImg.push(document.getElementById("guest56Img"));
guestImg.push(document.getElementById("guest57Img"));


// Main game class definition
class Game{
    constructor(playerNumber, playerName, standardHotel) {
        // init top info
        console.log("new game!!")
        this.playerNumber = playerNumber;
        console.log("number of player: " + this.playerNumber);
        this.diceNumber = playerNumber * 2 + 6;
        console.log("number of dice: " + this.diceNumber);
        this.majorTask0 = Math.floor(Math.random() * 4);
        console.log("major task 1: " + majorTaskDescription[0][this.majorTask0]);
        this.majorTask1 = Math.floor(Math.random() * 4);
        console.log("major task 2: " + majorTaskDescription[1][this.majorTask1]);
        this.majorTask2 = Math.floor(Math.random() * 4);
        console.log("major task 3: " + majorTaskDescription[2][this.majorTask2]);
        this.majorTask0Comp = [-1, -1, -1];
        this.majorTask1Comp = [-1, -1, -1];
        this.majorTask2Comp = [-1, -1, -1];
        this.royalTask0 = Math.floor(Math.random() * 4);
        console.log("royal task 1: " + royalTaskDescription[0][this.royalTask0]);
        this.royalTask1 = Math.floor(Math.random() * 4);
        console.log("royal task 2: " + royalTaskDescription[1][this.royalTask1]);
        this.royalTask2 = Math.floor(Math.random() * 4);
        console.log("royal task 3: " + royalTaskDescription[2][this.royalTask2]);
        this.mainRound = 0;
        console.log("main round: " + this.mainRound);
        this.miniRound = 0;

        // init guest deck and server deck
        this.guestDeck = Array.from({length: 58}, (_, i) => i);
        this.serverDeck = Array.from({length: 48}, (_, i) => i);
        this.shuffleDeck(this.guestDeck);
        this.shuffleDeck(this.serverDeck);

        // take first 5 guests in queue
        this.guestInQueue = [];
        for(let i=0; i<5; i++){
            this.guestInQueue.push(this.guestDeck[this.guestDeck.length-1]);
            console.log("guest " + i + " in queue: " + guestNameByID[this.guestInQueue[i]]);
            console.log("bonus: " + guestDescriptionByID[this.guestInQueue[i]]);
            this.guestDeck.pop();
        }

        // draw everything on guest board
        this.updateGuestCanvas(guestContext);

        // init player info
        // this.players = [];
        // for(let i=0; i<playerNumber; i++) {
        //     if(standardHotel){
        //         players.push(new Player(i, playerName[i], 0));
        //     } else {
        //         players.push(new Player(i, playerName[i], Math.random() % 4));
        //     }
        // }

        // place the first player to start
        this.currPlayer = 0;
        console.log("current player: " + playerName[this.currPlayer]);
    }

    updateGuestCanvas(context){
        // draw base
        context.drawImage(guestBoardImg, 0, 0);
        // draw major tasks
        var   majorTaskXoffset = 25;
        var   majorTaskYoffset = 8;
        const majorTaskWidth   = 150;
        const majorTaskHeight  = 100;
        switch(this.majorTask0) {
            case 0: // major task A0
            context.drawImage(majorTaskA0Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 1: // major task A1
            context.drawImage(majorTaskA1Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 2: // major task A2
            context.drawImage(majorTaskA2Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 3: // major task A3
            context.drawImage(majorTaskA3Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
        }
        majorTaskXoffset += 160;
        switch(this.majorTask1) {
            case 0: // major task B0
            context.drawImage(majorTaskB0Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 1: // major task B1
            context.drawImage(majorTaskB1Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 2: // major task B2
            context.drawImage(majorTaskB2Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 3: // major task B3
            context.drawImage(majorTaskB3Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
        }
        majorTaskXoffset += 160;
        switch(this.majorTask2) {
            case 0: // major task C0
            context.drawImage(majorTaskC0Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 1: // major task C1
            context.drawImage(majorTaskC1Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 2: // major task C2
            context.drawImage(majorTaskC2Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 3: // major task C3
            context.drawImage(majorTaskC3Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
        }
        // draw royal tasks
        var   royalTaskXoffset = 620;
        var   royalTaskYoffset = 115;
        const royalTaskWidth   = 80;
        const royalTaskHeight  = 120;
        switch(this.royalTask0) {
            case 0: // royal task A0
            context.drawImage(royalTaskA0Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 1: // royal task A1
            context.drawImage(royalTaskA1Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 2: // royal task A2
            context.drawImage(royalTaskA2Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 3: // royal task A3
            context.drawImage(royalTaskA3Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
        }
        royalTaskXoffset += 120;
        switch(this.royalTask1) {
            case 0: // royal task B0
            context.drawImage(royalTaskB0Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 1: // royal task B1
            context.drawImage(royalTaskB1Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 2: // royal task B2
            context.drawImage(royalTaskB2Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 3: // royal task B3
            context.drawImage(royalTaskB3Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
        }
        royalTaskXoffset += 120;
        switch(this.royalTask2) {
            case 0: // royal task C0
            context.drawImage(royalTaskC0Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 1: // royal task C1
            context.drawImage(royalTaskC1Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 2: // royal task C2
            context.drawImage(royalTaskC2Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 3: // royal task C3
            context.drawImage(royalTaskC3Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
        }
        // draw main round token
        context.globalAlpha = 0.5;
        context.fillStyle = 'rgb(42,255,0)';
        context.fillRect(512, 50, 56, 56);
        context.globalAlpha = 1;
        // draw guests in queue
        var   guestXoffset = 36;
        var   guestYoffset = 350;
        const guestWidth   = 160;
        const guestHeight  = 240;
        for(let i=0; i<5; i++){
            context.drawImage(guestImg[this.guestInQueue[i]], guestXoffset, guestYoffset, guestWidth, guestHeight);
            guestXoffset += 182;
        }
    }

    shuffleDeck(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    nextMiniRound() {
        ;
    }

    nextMainRound() {
        ;
    }

    gameEnd() {
        ;
    }

    takeDice() {
        ;
    }

    takeGuest() {
        ;
    }

    drawServer() {
        ;
    }
}
