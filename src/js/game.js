// Main game class definition
class Game{
    constructor(playerNumber, playerName, standardHotel) {
        // init top info
        console.log("new game!!")
        this.playerNumber = playerNumber;
        // console.log("number of player: " + this.playerNumber);
        this.diceNumber = playerNumber * 2 + 6;
        // console.log("number of dice: " + this.diceNumber);
        this.majorTask0 = Math.floor(Math.random() * 4);
        // console.log("major task 1: " + majorTaskDescription[0][this.majorTask0]);
        this.majorTask1 = Math.floor(Math.random() * 4);
        // console.log("major task 2: " + majorTaskDescription[1][this.majorTask1]);
        this.majorTask2 = Math.floor(Math.random() * 4);
        // console.log("major task 3: " + majorTaskDescription[2][this.majorTask2]);
        this.majorTask0Comp = [-1, -1, -1];
        this.majorTask1Comp = [-1, -1, -1];
        this.majorTask2Comp = [-1, -1, -1];
        this.royalTask0 = Math.floor(Math.random() * 4);
        // console.log("royal task 1: " + royalTaskDescription[0][this.royalTask0]);
        this.royalTask1 = Math.floor(Math.random() * 4);
        // console.log("royal task 2: " + royalTaskDescription[1][this.royalTask1]);
        this.royalTask2 = Math.floor(Math.random() * 4);
        // console.log("royal task 3: " + royalTaskDescription[2][this.royalTask2]);
        this.mainRound = 0;
        // console.log("main round: " + this.mainRound);
        this.miniRound = 0;
        this.actionPoint = [0, 0, 0, 0, 0, 0];
        this.actionHighLightFlag = false;
        this.actionHighLight = [0, 0, 0, 0, 0, 0];
        this.guestHighLightFlag = false;
        this.guestHighLight = [0, 0, 0, 0, 0];

        // init guest deck and server deck
        this.guestDeck = Array.from({length: 58}, (_, i) => i);
        this.serverDeck = Array.from({length: 48}, (_, i) => i);
        this.shuffleDeck(this.guestDeck);
        this.shuffleDeck(this.serverDeck);

        // take first 5 guests in queue
        this.guestInQueue = [];
        for(let i=0; i<5; i++){
            this.guestInQueue.push(this.guestDeck[this.guestDeck.length-1]);
            // console.log("guest " + i + " in queue: " + guestNameByID[this.guestInQueue[i]]);
            // console.log("bonus: " + guestDescriptionByID[this.guestInQueue[i]]);
            this.guestDeck.pop();
        }

        // draw everything on guest board
        this.updateGuestCanvas(guestContext);

        // draw everything on action board
        this.updateActionCanvas(actionContext);

        // init player info
        this.players = [];
        for(let i=0; i<playerNumber; i++) {
            if(standardHotel){
                this.players.push(new Player(i, playerName[i], 0));
            } else {
                this.players.push(new Player(i, playerName[i], Math.floor(Math.random() * 4) + 1 ));
            }
        }
        switch(playerNumber){ // assign mini rounds
            case 2: 
            this.players[0].miniTurn = [1, 4];
            this.players[1].miniTurn = [2, 3];
            this.players[0].updatePlayerCanvas(this.players[0].context);
            this.players[1].updatePlayerCanvas(this.players[1].context);
            break;
            case 3: 
            this.players[0].miniTurn = [1, 6];
            this.players[1].miniTurn = [2, 5];
            this.players[2].miniTurn = [3, 4];
            this.players[0].updatePlayerCanvas(this.players[0].context);
            this.players[1].updatePlayerCanvas(this.players[1].context);
            this.players[2].updatePlayerCanvas(this.players[2].context);
            break;
            case 4: 
            this.players[0].miniTurn = [1, 8];
            this.players[1].miniTurn = [2, 7];
            this.players[2].miniTurn = [3, 6];
            this.players[3].miniTurn = [4, 5];
            this.players[0].updatePlayerCanvas(this.players[0].context);
            this.players[1].updatePlayerCanvas(this.players[1].context);
            this.players[2].updatePlayerCanvas(this.players[2].context);
            this.players[3].updatePlayerCanvas(this.players[3].context);
            break;
        }
        for(let k=0; k<6; k++) { // draw first 6 servers
            for(let i=0; i<playerNumber; i++) {
                this.players[i].addServerToHand(this.serverDeck[this.serverDeck.length-1]);
                // console.log("player " + playerName[i] + " draw a server ID: " + this.serverDeck[this.serverDeck.length-1]);
                this.serverDeck.pop();
            }
        }
        for(let i=0; i<playerNumber; i++) {
            this.players[i].updateServerCanvas(serverContext);
        }

        // listen to canvas click
        guestCanvas.addEventListener("click", this.handleGuestClick);
        actionCanvas.addEventListener("click", this.handleActionClick);
        hotelCanvas.addEventListener("click", this.handleHotelClick);
        serverCanvas.addEventListener("click", this.handleServerClick);
        alertCanvas.addEventListener("click", this.handleAlertClick);
        player0Canvas.addEventListener("click", this.handlePlayer0Click);
        player1Canvas.addEventListener("click", this.handlePlayer1Click);
        player2Canvas.addEventListener("click", this.handlePlayer2Click);
        player3Canvas.addEventListener("click", this.handlePlayer3Click);

        // place the first player to start
        this.currPlayer = 0;
        this.players[0].turnFlag = true;
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
        // hightlight marked guests
        guestXoffset = 36;
        if(this.guestHighLightFlag){
            for(let i=0; i<5; i++){
                if(this.guestHighLight[i]) {
                    context.strokeStyle = "red";
                    context.lineWidth = 5;
                    context.strokeRect(guestXoffset, guestYoffset, guestWidth, guestHeight);
                }
                guestXoffset += 182;
            }
        }
    }

    updateActionCanvas(context){
        context.drawImage(actionBoardImg, 0, 0);
        // draw the action dice number
        var   numberXoffset = 75;
        var   numberYoffset = 25;
        context.font="20px verdana";
        for(let i=0; i<6; i++){
            context.shadowColor="white";
            context.shadowBlur=5;
            context.lineWidth=2;
            context.strokeText(this.actionPoint[i].toString(), numberXoffset, numberYoffset);
            context.shadowBlur=0;
            context.fillStyle="black";
            context.fillText(this.actionPoint[i].toString(), numberXoffset, numberYoffset);
            numberXoffset+=159;
        }
        // highlight actions
        var   blockXoffset = 30;
        var   blockYoffset = 30;
        const blockWidth = 100;
        const blockHeight = 120;
        if(this.actionHighLightFlag){
            for(let i=0; i<6; i++){
                if(this.actionHighLight[i]){
                    context.strokeStyle = "red";
                    context.lineWidth = 5;
                    context.strokeRect(blockXoffset, blockYoffset, blockWidth, blockHeight);
                }
                blockXoffset+=159;
                context.strokeStyle = "white";
            }
        }
    }

    shuffleDeck(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    checkGuestInvite(money) {
        this.guestHighLight[4] = true;
        this.guestHighLight[3] = true;
        this.guestHighLight[2] = money >= 1;
        this.guestHighLight[1] = money >= 2;
        this.guestHighLight[0] = money >= 3;
    }

    handlePlayer0Click(event) {
        // check if this players turn first
        if(!game.players[0].turnFlag){
            console.log("Not player 0 turn");
            return;
        }
        // turn to player class
        console.log("player 0 canvas clicked");
        var statusPlayer = game.players[0].handlePlayerClick(event);
        game.handlePlayerClick(statusPlayer);
    }

    handlePlayer1Click(event) {
        // check if this players turn first
        if(!game.players[1].turnFlag){
            console.log("Not player 1 turn");
            return;
        }
        // turn to player class
        console.log("player 1 canvas clicked");
        var statusPlayer = game.players[1].handlePlayerClick(event);
        game.handlePlayerClick(statusPlayer);
    }

    handlePlayer2Click(event) {
        // check if this players exist and its turn
        if(game.playerNumber < 3 || !game.players[2].turnFlag){
            console.log("Not player 2 turn");
            return;
        }
        // turn to player class
        console.log("player 2 canvas clicked");
        var statusPlayer = game.players[2].handlePlayerClick(event);
        game.handlePlayerClick(statusPlayer);
    }

    handlePlayer3Click(event) {
        // check if this players turn first
        if(game.playerNumber < 4 || !game.players[3].turnFlag){
            console.log("Not player 3 turn");
            return;
        }
        // turn to player class
        console.log("player 3 canvas clicked");
        var statusPlayer = game.players[3].handlePlayerClick(event);
        game.handlePlayerClick(statusPlayer);
    }

    handlePlayerClick(statusPlayer){
        switch(statusPlayer) {
            case 0: return; //nothing
            case 1: // invite
            game.guestHighLightFlag = true;
            if(game.players[0].firstGuestTurn){
                game.checkGuestInvite(10); // make sure all guest available at the first guest
            } else {
                game.checkGuestInvite(game.players[0].money);
            }
            game.updateGuestCanvas(guestContext);
            break;
            case 2: // action
            game.actionHighLightFlag = true;
            for(let i=0; i<6; i++){
                if(game.actionPoint[i]>0){
                    game.actionHighLight[i] = 1;
                }
            }
            game.updateActionCanvas(actionContext);
            break;
            case 3: // serve
            if(game.players[game.currPlayer].money > 0) {
                ;
            }
            break;
            case 4: // checkout
            break;
            case 5: // end turn
            game.nextMiniRound();
            break;
        }
    }

    handleGuestClick(event) {
        console.log("guest canvas clicked");
        if(!game.players[game.currPlayer].atInvite){
            console.log("current player is not inviting");
        } else {
            var guestSelected = -1;
            game.players[game.currPlayer].atInvite = false;
            if(event.offsetX >= 36 && event.offsetX <= 196 && event.offsetY >= 350 && event.offsetY <= 590){
                console.log("guest 5 is selected");
                guestSelected = 0;
            } else if(event.offsetX >= 218 && event.offsetX <= 378 && event.offsetY >= 350 && event.offsetY <= 590) {
                console.log("guest 4 is selected");
                guestSelected = 1;
            } else if(event.offsetX >= 400 && event.offsetX <= 560 && event.offsetY >= 350 && event.offsetY <= 590) {
                console.log("guest 3 is selected");
                guestSelected = 2;
            } else if(event.offsetX >= 582 && event.offsetX <= 742 && event.offsetY >= 350 && event.offsetY <= 590) {
                console.log("guest 2 is selected");
                guestSelected = 3;
            } else if(event.offsetX >= 764 && event.offsetX <= 924 && event.offsetY >= 350 && event.offsetY <= 590) {
                console.log("guest 1 is selected");
                guestSelected = 4;
            }
            // selected a guest to invite
            if(guestSelected >= 0){
                game.guestHighLightFlag = false;
                game.players[game.currPlayer].hotel.addGuestToTable(game.guestInQueue[guestSelected]);
                game.takeOneGuestFromQueue(guestSelected);
                game.updateGuestCanvas(guestContext);
                game.players[game.currPlayer].hotel.updateHotelCanvas(hotelContext);
                game.players[game.currPlayer].inviteFlag = true;
                game.players[game.currPlayer].checkOpStatus();
                game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
            }
        }
    }

    handleActionClick(event) {
        console.log("action canvas clicked");
        if(game.players[game.currPlayer].atAction){
            var   blockXoffset = 30;
            var   blockYoffset = 30;
            const blockWidth = 100;
            const blockHeight = 120;
            for(let i=0; i<6; i++){
                if(event.offsetX >= blockXoffset && event.offsetX < blockXoffset+blockWidth && event.offsetY >= blockYoffset && event.offsetY < blockYoffset+blockHeight){
                    console.log("action " + i + " is selected");
                    if(game.actionPoint[i]==0){
                        console.log("no more dice here");
                        break;
                    }
                    if(i!=6 || game.players[game.currPlayer].money > 0){
                        game.takeDice(i);
                    } else {
                        continue;
                    }
                    game.actionHighLightFlag = false;
                    for(let i=0; i<6; i++){
                        game.actionHighLight[i] = 0;
                    }
                    game.updateActionCanvas(actionContext);
                    game.players[game.currPlayer].atAction = false;
                    game.players[game.currPlayer].checkOpStatus();
                    game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                    break;
                }
                blockXoffset += 159;
            }
        }
    }

    handleHotelClick(event) {
        console.log("hotel canvas clicked");
        // first guest invite stage, prepare 3 rooms
        for(let floor=0; floor<4; floor++){
            for(let col=0; col<5; col++){
                if(event.offsetX >= (60+115*col) && event.offsetX < (60+115*col+115) && event.offsetY >= (120+120*(3-floor)) && event.offsetY < (120+120*(3-floor)+120)) {
                    console.log("hotel room at floor " + floor + " col " + col + " is clicked");
                    if(game.players[game.currPlayer].hotel.firstThreeRoom && game.players[game.currPlayer].hotel.roomHighLight[floor][col]){
                        // prepare selected room, no need to worry about money
                        game.players[game.currPlayer].hotel.roomPrepare(floor, col);
                        game.players[game.currPlayer].loseMoney(floor);
                        if(game.players[game.currPlayer].hotel.roomPreparedNum == 3){ // finished all three rooms
                            game.players[game.currPlayer].hotel.roomHighLightFlag = false;
                            game.players[game.currPlayer].hotel.firstThreeRoom = false;
                        }
                        game.players[game.currPlayer].hotel.highlightRoomToPrepare(10);
                        game.players[game.currPlayer].hotel.updateHotelCanvas(hotelContext);
                        game.players[game.currPlayer].checkOpStatus();
                        game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                    } else if(game.players[game.currPlayer].hotel.roomToPrepare>0 && game.players[game.currPlayer].hotel.roomHighLight[floor][col]){
                        // prepare selected room, check money
                        game.players[game.currPlayer].hotel.roomPrepare(floor, col);
                        game.players[game.currPlayer].loseMoney(floor);
                        if(game.players[game.currPlayer].hotel.roomToPrepare == 1){ // finished rooms
                            game.players[game.currPlayer].hotel.roomHighLightFlag = false;
                        }
                        game.players[game.currPlayer].hotel.highlightRoomToPrepare(game.players[game.currPlayer].money);
                        game.players[game.currPlayer].hotel.updateHotelCanvas(hotelContext);
                        game.players[game.currPlayer].checkOpStatus();
                        game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                        game.players[game.currPlayer].hotel.roomToPrepare--;
                    }
                }
            }
        }
    }

    handleAlertClick(event) {
        console.log("alert canvas clicked");
        if(game.players[game.currPlayer].atTakeBrownWhite){
            if(event.offsetX>=20 && event.offsetX<=120 && event.offsetY>=90 && event.offsetY<=140){ // boost
                if(game.players[game.currPlayer].money>0){
                    console.log("boost selected");
                    if(game.players[game.currPlayer].atActionBoost){
                        game.players[game.currPlayer].money++;
                        if(game.players[game.currPlayer].atTakeBrown==game.players[game.currPlayer].atTakeWhite){
                            game.players[game.currPlayer].atTakeWhite--;
                        } else {
                            game.players[game.currPlayer].atTakeBrown--;
                        }
                        game.players[game.currPlayer].atActionBoost = false;
                    } else {
                        game.players[game.currPlayer].money--;
                        game.players[game.currPlayer].atTakeBrown++;
                        game.players[game.currPlayer].atActionBoost = true;
                    }
                    game.players[game.currPlayer].updateAlertCanvas(alertContext, 0);
                    game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                }
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase brown
                if(game.players[game.currPlayer].atTakeWhite > 0){
                    game.players[game.currPlayer].atTakeBrown++;
                    game.players[game.currPlayer].atTakeWhite--;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 0);
                console.log("brown increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease brown
                if(game.players[game.currPlayer].atTakeBrown > 0 && game.players[game.currPlayer].atTakeBrown > game.players[game.currPlayer].atTakeWhite + 1){
                    game.players[game.currPlayer].atTakeBrown--;
                    game.players[game.currPlayer].atTakeWhite++;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 0);
                console.log("brown decrease selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=90 && event.offsetY<=110){ // increase white
                if(game.players[game.currPlayer].atTakeBrown > 0 && game.players[game.currPlayer].atTakeBrown > game.players[game.currPlayer].atTakeWhite + 1){
                    game.players[game.currPlayer].atTakeBrown--;
                    game.players[game.currPlayer].atTakeWhite++;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 0);
                console.log("white increase selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=120 && event.offsetY<=140){ // decrease white
                if(game.players[game.currPlayer].atTakeWhite > 0){
                    game.players[game.currPlayer].atTakeBrown++;
                    game.players[game.currPlayer].atTakeWhite--;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 0);
                console.log("white decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                game.players[game.currPlayer].atTakeBrownWhite = false;
                game.players[game.currPlayer].gainBrown(game.players[game.currPlayer].atTakeBrown);
                game.players[game.currPlayer].gainWhite(game.players[game.currPlayer].atTakeWhite);
                game.players[game.currPlayer].atAction = false;
                game.players[game.currPlayer].actionFlag = true;
                game.players[game.currPlayer].atActionBoost = false;
                game.players[game.currPlayer].checkOpStatus();
                game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                console.log("confirm selected");
            }
        } else if(game.players[game.currPlayer].atTakeRedBlack){
            if(event.offsetX>=20 && event.offsetX<=120 && event.offsetY>=90 && event.offsetY<=140){ // boost
                if(game.players[game.currPlayer].money>0){
                    console.log("boost selected");
                    if(game.players[game.currPlayer].atActionBoost){
                        game.players[game.currPlayer].money++;
                        if(game.players[game.currPlayer].atTakeRed==game.players[game.currPlayer].atTakeBlack){
                            game.players[game.currPlayer].atTakeBlack--;
                        } else {
                            game.players[game.currPlayer].atTakeRed--;
                        }
                        game.players[game.currPlayer].atActionBoost = false;
                    } else {
                        game.players[game.currPlayer].money--;
                        game.players[game.currPlayer].atTakeRed++;
                        game.players[game.currPlayer].atActionBoost = true;
                    }
                    game.players[game.currPlayer].updateAlertCanvas(alertContext, 1);
                    game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                }
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase red
                if(game.players[game.currPlayer].atTakeBlack > 0){
                    game.players[game.currPlayer].atTakeRed++;
                    game.players[game.currPlayer].atTakeBlack--;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 1);
                console.log("red increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease red
                if(game.players[game.currPlayer].atTakeRed > 0 && game.players[game.currPlayer].atTakeRed > game.players[game.currPlayer].atTakeBlack + 1){
                    game.players[game.currPlayer].atTakeRed--;
                    game.players[game.currPlayer].atTakeBlack++;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 1);
                console.log("red decrease selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=90 && event.offsetY<=110){ // increase black
                if(game.players[game.currPlayer].atTakeRed > 0 && game.players[game.currPlayer].atTakeRed > game.players[game.currPlayer].atTakeBlack + 1){
                    game.players[game.currPlayer].atTakeRed--;
                    game.players[game.currPlayer].atTakeBlack++;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 1);
                console.log("black increase selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=120 && event.offsetY<=140){ // decrease black
                if(game.players[game.currPlayer].atTakeBlack > 0){
                    game.players[game.currPlayer].atTakeRed++;
                    game.players[game.currPlayer].atTakeBlack--;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 1);
                console.log("black decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                game.players[game.currPlayer].atTakeRedBlack = false;
                game.players[game.currPlayer].gainRed(game.players[game.currPlayer].atTakeRed);
                game.players[game.currPlayer].gainBlack(game.players[game.currPlayer].atTakeBlack);
                game.players[game.currPlayer].atAction = false;
                game.players[game.currPlayer].actionFlag = true;
                game.players[game.currPlayer].atActionBoost = false;
                game.players[game.currPlayer].checkOpStatus();
                game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                console.log("confirm selected");
            }
        } else if(game.players[game.currPlayer].atPrepareRoom){
            var roomTmp = game.actionPoint[2]+1+(game.players[game.currPlayer].atActionBoost?1:0);
            if(event.offsetX>=20 && event.offsetX<=120 && event.offsetY>=90 && event.offsetY<=140){ // boost
                if(game.players[game.currPlayer].money>0){
                    console.log("boost selected");
                    if(game.players[game.currPlayer].atActionBoost){
                        game.players[game.currPlayer].money++;
                        game.players[game.currPlayer].atRoomToPrepare--;
                        roomTmp--;
                        game.players[game.currPlayer].atActionBoost = false;
                    } else {
                        game.players[game.currPlayer].money--;
                        game.players[game.currPlayer].atRoomToPrepare++;
                        roomTmp++;
                        game.players[game.currPlayer].atActionBoost = true;
                    }
                    game.players[game.currPlayer].updateAlertCanvas(alertContext, 2);
                    game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                }
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase room number
                if(game.players[game.currPlayer].atRoomToPrepare < roomTmp){
                    game.players[game.currPlayer].atRoomToPrepare++;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 2);
                console.log("room increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease room number
                if(game.players[game.currPlayer].atRoomToPrepare > 0){
                    game.players[game.currPlayer].atRoomToPrepare--;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 2);
                console.log("room decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                game.players[game.currPlayer].atPrepareRoom = false;
                game.players[game.currPlayer].hotel.roomToPrepare = game.players[game.currPlayer].atRoomToPrepare;
                game.players[game.currPlayer].hotel.roomHighLightFlag = true;
                game.players[game.currPlayer].hotel.highlightRoomToPrepare(game.players[game.currPlayer].money);
                game.players[game.currPlayer].hotel.updateHotelCanvas(hotelContext);
                game.players[game.currPlayer].atAction = false;
                game.players[game.currPlayer].actionFlag = true;
                game.players[game.currPlayer].atActionBoost = false;
                game.players[game.currPlayer].checkOpStatus();
                game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                console.log("confirm selected");
            }
        } else if(game.players[game.currPlayer].atRoyalMoney){
            if(event.offsetX>=20 && event.offsetX<=120 && event.offsetY>=90 && event.offsetY<=140){ // boost
                if(game.players[game.currPlayer].money>0){
                    console.log("boost selected");
                    if(game.players[game.currPlayer].atActionBoost){
                        game.players[game.currPlayer].money++;
                        if(game.players[game.currPlayer].atRoyal > 0){
                            game.players[game.currPlayer].atRoyal--;
                        } else {
                            game.players[game.currPlayer].atMoney--;
                        }
                        game.players[game.currPlayer].atActionBoost = false;
                    } else {
                        game.players[game.currPlayer].money--;
                        game.players[game.currPlayer].atRoyal++;
                        game.players[game.currPlayer].atActionBoost = true;
                    }
                    game.players[game.currPlayer].updateAlertCanvas(alertContext, 3);
                    game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                }
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase royal
                if(game.players[game.currPlayer].atMoney > 0){
                    game.players[game.currPlayer].atRoyal++;
                    game.players[game.currPlayer].atMoney--;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 3);
                console.log("royal increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease royal
                if(game.players[game.currPlayer].atRoyal > 0){
                    game.players[game.currPlayer].atRoyal--;
                    game.players[game.currPlayer].atMoney++;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 3);
                console.log("royal decrease selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=90 && event.offsetY<=110){ // increase money
                if(game.players[game.currPlayer].atRoyal > 0){
                    game.players[game.currPlayer].atRoyal--;
                    game.players[game.currPlayer].atMoney++;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 3);
                console.log("money increase selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=120 && event.offsetY<=140){ // decrease money
                if(game.players[game.currPlayer].atMoney > 0){
                    game.players[game.currPlayer].atRoyal++;
                    game.players[game.currPlayer].atMoney--;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 3);
                console.log("money decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                game.players[game.currPlayer].atRoyalMoney = false;
                game.players[game.currPlayer].gainRoyal(game.players[game.currPlayer].atRoyal);
                game.players[game.currPlayer].gainMoney(game.players[game.currPlayer].atMoney);
                game.players[game.currPlayer].atAction = false;
                game.players[game.currPlayer].actionFlag = true;
                game.players[game.currPlayer].atActionBoost = false;
                game.players[game.currPlayer].checkOpStatus();
                game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                console.log("confirm selected");
            }
        } else if(game.players[game.currPlayer].atHireServer){
            if(event.offsetX>=20 && event.offsetX<=120 && event.offsetY>=90 && event.offsetY<=140){ // boost
                if(game.players[game.currPlayer].money>0){
                    console.log("boost selected");
                    if(game.players[game.currPlayer].atActionBoost){
                        game.players[game.currPlayer].money++;
                        game.players[game.currPlayer].atHireServerdiscount--;
                        game.players[game.currPlayer].atActionBoost = false;
                    } else {
                        game.players[game.currPlayer].money--;
                        game.players[game.currPlayer].atHireServerdiscount++;
                        game.players[game.currPlayer].atActionBoost = true;
                    }
                    game.players[game.currPlayer].updateAlertCanvas(alertContext, 4);
                    game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                }
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                game.players[game.currPlayer].atHireServer = false;
                game.players[game.currPlayer].serverOnHandHighLightFlag = true;
                game.players[game.currPlayer].hireFlag = true;
                game.players[game.currPlayer].highlightServerToHire(game.players[game.currPlayer].atHireServerdiscount);
                game.players[game.currPlayer].updateServerCanvas(serverContext);
                game.players[game.currPlayer].atAction = false;
                game.players[game.currPlayer].actionFlag = true;
                game.players[game.currPlayer].atActionBoost = false;
                game.players[game.currPlayer].checkOpStatus();
                game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                console.log("confirm selected");
            }
            
        } else if(game.players[game.currPlayer].atTakeMirror){
            if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase dice
                if(game.players[game.currPlayer].atMirrorDice < 5){
                    game.players[game.currPlayer].atMirrorDice++;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 5);
                console.log("brown increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease dice
                if(game.players[game.currPlayer].atMirrorDice > 0){
                    game.players[game.currPlayer].atMirrorDice--;
                }
                game.players[game.currPlayer].updateAlertCanvas(alertContext, 5);
                console.log("brown decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                game.players[game.currPlayer].atTakeMirror = false;
                switch(game.players[game.currPlayer].atMirrorDice){
                    case 1: game.players[game.currPlayer].actionTakeBrownWhite(game.players[game.currPlayer].atMirrorStrength);
                    case 2: game.players[game.currPlayer].actionTakeRedBlack(game.players[game.currPlayer].atMirrorStrength);
                    case 3: game.players[game.currPlayer].actionPrepareRoom(game.players[game.currPlayer].atMirrorStrength);
                    case 4: game.players[game.currPlayer].actionTakeRoyalMoney(game.players[game.currPlayer].atMirrorStrength);
                    case 5: game.players[game.currPlayer].actionHireServer(game.players[game.currPlayer].atMirrorStrength);
                }
                game.players[game.currPlayer].atAction = false;
                game.players[game.currPlayer].atActionBoost = false;
                game.players[game.currPlayer].checkOpStatus();
                game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                console.log("confirm selected");
            }
        }
    }

    handleServerClick(event) {
        console.log("server canvas clicked");
        // left roll
        if(event.offsetX>=0 && event.offsetX<=25 && event.offsetY>=80 && event.offsetY<=130 && game.players[game.currPlayer].serverOnHandCanvasIdx>0){
            console.log("sever on hand left roll clicked");
            game.players[game.currPlayer].serverOnHandCanvasIdx--;
            game.players[game.currPlayer].updateServerCanvas(serverContext);
        } // right roll
        else if(event.offsetX>=615 && event.offsetX<=640 && event.offsetY>=80 && event.offsetY<=130 && game.players[game.currPlayer].serverOnHandCanvasIdx<(game.players[game.currPlayer].numServerOnHand-3)) {
            console.log("sever on hand right roll clicked");
            game.players[game.currPlayer].serverOnHandCanvasIdx++;
            game.players[game.currPlayer].updateServerCanvas(serverContext);
        } // server hire
        else{
            for(let i=0; i<3; i++){
                if(game.players[game.currPlayer].serverOnHandCanvasIdx + i < game.players[game.currPlayer].numServerOnHand){
                    const serverIdx = game.players[game.currPlayer].serverOnHandCanvasIdx + i;
                    if(event.offsetX>=(65+170*i) && event.offsetX<=(225+170*i) && event.offsetY>=35 && event.offsetY<=275 && 
                        game.players[game.currPlayer].hireFlag && game.players[game.currPlayer].serverOnHandHighLight[serverIdx]){
                        console.log("hire server " + serverIdx);
                        game.players[game.currPlayer].money -= (game.players[game.currPlayer].serverOnHand[serverIdx].serverCost - game.players[game.currPlayer].atHireServerdiscount);
                        game.players[game.currPlayer].hireFlag = false;
                        game.players[game.currPlayer].hireServer(serverIdx);
                        game.players[game.currPlayer].serverOnHandHighLightFlag = false;
                        game.players[game.currPlayer].updatePlayerCanvas(game.players[game.currPlayer].context);
                        game.players[game.currPlayer].updateServerCanvas(serverContext);
                    }
                }
            }
        }
    }

    nextMiniRound() {
        // First guest invitation is special
        if(this.players[this.currPlayer].firstGuestTurn){
            this.players[this.currPlayer].firstGuestTurn = false;
            this.players[this.currPlayer].turnFlag = false;
            this.players[this.currPlayer].inviteFlag = false;
            this.players[this.currPlayer].actionFlag = false;
            this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
            if(this.currPlayer == this.playerNumber-1){ // all players complete preparation
                this.currPlayer = 0;
                this.rollDice();
                this.players[this.currPlayer].checkOpStatus();
            } else {
                this.currPlayer++;
            }
            this.players[this.currPlayer].turnFlag = true;
            this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
            this.players[this.currPlayer].updateServerCanvas(serverContext);
            this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
        } else { // normal mini round
            ;
        }
    }

    nextMainRound() {
        ;
    }

    gameEnd() {
        ;
    }

    takeDice(value) {
        switch(value){
            case 0: // take brown and white
            this.players[this.currPlayer].actionTakeBrownWhite(this.actionPoint[0]);
            break;
            case 1: // take red and black
            this.players[this.currPlayer].actionTakeRedBlack(this.actionPoint[1]);
            break;
            case 2: // prepare rooms
            this.players[this.currPlayer].actionPrepareRoom(this.actionPoint[2]);
            break;
            case 3: // take royal point or money
            this.players[this.currPlayer].actionTakeRoyalMoney(this.actionPoint[3]);
            break;
            case 4: // hire server
            this.players[this.currPlayer].actionHireServer(this.actionPoint[4]);
            break;
            case 5: // mirror an action
            this.players[this.currPlayer].money--;
            this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
            this.players[this.currPlayer].actionTakeMirror(this.actionPoint[5]);
            break;
        }
        this.actionPoint[value]--;
    }

    takeOneGuestFromQueue(guestSelected) {
        console.log("remove guest " + guestNameByID[this.guestInQueue[guestSelected]] + " from queue");
        this.guestInQueue.splice(guestSelected, 1); // remove this guest from queue
        this.guestInQueue.unshift(this.guestDeck[this.guestDeck.length-1]);
        this.guestDeck.pop();
        console.log("add guest " + guestNameByID[this.guestInQueue[0]] + " to queue");
    }

    drawServer(playerID) {
        ;
    }

    rollDice() {
        console.log("roll dice");
        this.actionPoint = [0, 0, 0, 0, 0, 0];
        for(let i=0; i<this.diceNumber; i++){
            this.actionPoint[Math.floor(Math.random() * 6)]++;
        }
        this.updateActionCanvas(actionContext);
    }
}
