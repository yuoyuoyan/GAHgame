// Main game class definition
class Game{
    constructor(playerNumber, playerName, standardHotel) {
        // init top info
        console.log("new game!!")
        this.playerNumber = playerNumber;
        // console.log("number of player: " + this.playerNumber);
        this.playerName = playerName;
        this.standardHotel = standardHotel;
        this.diceNumber = playerNumber * 2 + 6;
        // console.log("number of dice: " + this.diceNumber);
        this.majorTask0 = Math.floor(Math.random() * 4);
        // console.log("major task 1: " + majorTaskDescription[0][this.majorTask0]);
        this.majorTask1 = Math.floor(Math.random() * 4);
        // console.log("major task 2: " + majorTaskDescription[1][this.majorTask1]);
        this.majorTask2 = Math.floor(Math.random() * 4);
        // console.log("major task 3: " + majorTaskDescription[2][this.majorTask2]);
        this.majorTaskComp = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
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
        // alert type depends on game phase
        this.alertType = 0;

        // init guest deck and server deck
        this.guestDeck = Array.from({length: 58}, (_, i) => i);
        this.serverDeck = Array.from({length: 48}, (_, i) => i);
        this.shuffleDeck(this.guestDeck);
        this.shuffleDeck(this.serverDeck);

        // take first 5 guests in queue
        this.guestInQueue = [];
        for(let i=0; i<5; i++){
            this.guestInQueue.push(this.guestDeck.at(-1));
            // console.log("guest " + i + " in queue: " + guestNameByID[this.guestInQueue[i]]);
            // console.log("bonus: " + guestDescriptionByID[this.guestInQueue[i]]);
            this.guestDeck.pop();
        }

        // init player info
        this.players = [];

        for(let i=0; i<this.playerNumber; i++) { // construct players
            if(this.standardHotel){
                this.players.push(new Player(this, i, this.playerName[i], 0));
            } else {
                this.players.push(new Player(this, i, this.playerName[i], Math.floor(Math.random() * 4) + 1 ));
            }
        }
        switch(this.playerNumber){ // assign mini rounds
            case 2: 
            this.players[0].miniTurn = [1, 4];
            this.players[1].miniTurn = [2, 3];
            break;
            case 3: 
            this.players[0].miniTurn = [1, 6];
            this.players[1].miniTurn = [2, 5];
            this.players[2].miniTurn = [3, 4];
            break;
            case 4: 
            this.players[0].miniTurn = [1, 8];
            this.players[1].miniTurn = [2, 7];
            this.players[2].miniTurn = [3, 6];
            this.players[3].miniTurn = [4, 5];
            break;
        }
        for(let k=0; k<6; k++) { // draw first 6 servers
            for(let i=0; i<this.playerNumber; i++) {
                this.players[i].addServerToHand(this.serverDeck.at(-1));
                // console.log("player " + playerName[i] + " draw a server ID: " + this.serverDeck.at(-1));
                this.serverDeck.pop();
            }
        }
        
        // place the first player to start
        this.currPlayer = 0;
        console.log("current player: " + this.playerName[this.currPlayer]);
        // draw canvas
        this.updateAllCanvas();
    }

    updateAllCanvas(){
        this.updateGuestCanvas(guestContext);
        this.updateActionCanvas(actionContext);
        for(let i=0; i<this.playerNumber; i++){
            this.players[i].checkOpStatus();
            this.players[i].updatePlayerCanvas(this.players[i].context);
        }
        this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
        this.players[this.currPlayer].updateServerCanvas(serverContext);
        this.players[this.currPlayer].updateAlertCanvas(alertContext, this.alertType);
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
        if(this.currPlayer!=0){
            console.log("Not player 0 turn");
            return;
        }
        // turn to player class
        console.log("player 0 canvas clicked");
        this.players[0].handlePlayerClick(event);
    }

    handlePlayer1Click(event) {
        // check if this players turn first
        if(this.currPlayer!=1){
            console.log("Not player 1 turn");
            return;
        }
        // turn to player class
        console.log("player 1 canvas clicked");
        this.players[1].handlePlayerClick(event);
    }

    handlePlayer2Click(event) {
        // check if this players exist and its turn
        if(this.playerNumber < 3 || this.currPlayer!=2){
            console.log("Not player 2 turn");
            return;
        }
        // turn to player class
        console.log("player 2 canvas clicked");
        this.players[2].handlePlayerClick(event);
    }

    handlePlayer3Click(event) {
        // check if this players turn first
        if(this.playerNumber < 4 || this.currPlayer!=3){
            console.log("Not player 3 turn");
            return;
        }
        // turn to player class
        console.log("player 3 canvas clicked");
        this.players[3].handlePlayerClick(event);
    }

    handleGuestClick(event) {
        console.log("guest canvas clicked");
        if(!this.players[this.currPlayer].atInvite && this.players[this.currPlayer].freeInviteNum == 0 && this.players[this.currPlayer].hotel.numGuestOnTable<3){
            console.log("current player is not inviting");
        } else {
            var guestSelected = -1;
            this.players[this.currPlayer].atInvite = false;
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
                this.players[this.currPlayer].hotel.addGuestToTable(this.guestInQueue[guestSelected]);
                if(!this.players[this.currPlayer].hasHiredServer(24) && 
                   !this.players[this.currPlayer].hotel.firstThreeRoom && 
                   this.players[this.currPlayer].freeInviteNum == 0){ // exceptions for invitation fee
                    this.players[this.currPlayer].money -= (guestSelected<3)?(3-guestSelected):0;
                }
                this.takeOneGuestFromQueue(guestSelected);
                if(this.players[this.currPlayer].freeInviteNum>0 && this.players[this.currPlayer].hotel.numGuestOnTable<3) { // free invitation not considered
                    this.players[this.currPlayer].freeInviteNum--;
                } else {
                    this.guestHighLightFlag = false;
                    this.players[this.currPlayer].inviteFlag = false;
                    this.players[this.currPlayer].freeInviteNum = 0;
                }
                this.players[this.currPlayer].checkOpStatus();
                this.updateGuestCanvas(guestContext);
                this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
                this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
            }
        }
    }

    handleActionClick(event) {
        console.log("action canvas clicked");
        if(this.players[this.currPlayer].atAction){
            var   blockXoffset = 30;
            var   blockYoffset = 30;
            const blockWidth = 100;
            const blockHeight = 120;
            for(let i=0; i<6; i++){
                if(event.offsetX >= blockXoffset && event.offsetX < blockXoffset+blockWidth && event.offsetY >= blockYoffset && event.offsetY < blockYoffset+blockHeight){
                    console.log("action " + i + " is selected");
                    if(this.actionPoint[i]==0){
                        console.log("no more dice here");
                        break;
                    }
                    if(i!=6 || this.players[this.currPlayer].money > 0){
                        this.takeDice(i);
                    } else {
                        continue;
                    }
                    this.actionHighLightFlag = false;
                    for(let i=0; i<6; i++){
                        this.actionHighLight[i] = 0;
                    }
                    this.updateActionCanvas(actionContext);
                    this.players[this.currPlayer].atAction = false;
                    this.players[this.currPlayer].checkOpStatus();
                    this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                    break;
                }
                blockXoffset += 159;
            }
        }
    }

    handleHotelClick(event) {
        console.log("hotel canvas clicked");
        // first guest invite stage, prepare 3 rooms
        // otherwise depend on the action point
        for(let floor=0; floor<4; floor++){
            for(let col=0; col<5; col++){
                if(event.offsetX >= (60+115*col) && event.offsetX < (60+115*col+115) && event.offsetY >= (120+120*(3-floor)) && event.offsetY < (120+120*(3-floor)+120)) {
                    console.log("hotel room at floor " + floor + " col " + col + " is clicked");
                    if(this.players[this.currPlayer].hotel.firstThreeRoom && this.players[this.currPlayer].hotel.roomHighLight[floor][col]){
                        // prepare selected room, no need to worry about money
                        this.players[this.currPlayer].hotel.roomPrepare(floor, col);
                        this.players[this.currPlayer].loseMoney(floor);
                        if(this.players[this.currPlayer].hotel.roomPreparedNum == 3){ // finished all three rooms
                            this.players[this.currPlayer].hotel.roomHighLightFlag = false;
                            this.players[this.currPlayer].hotel.firstThreeRoom = false;
                        }
                        this.players[this.currPlayer].hotel.highlightRoomToPrepare(10);
                        this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
                        this.players[this.currPlayer].checkOpStatus();
                        this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                    } else if(this.players[this.currPlayer].hotel.roomToPrepare>0 && this.players[this.currPlayer].hotel.roomHighLight[floor][col]){
                        console.log("prepare room at floor " + floor + " col " + col);
                        // prepare selected room, check money
                        this.players[this.currPlayer].hotel.roomPrepare(floor, col);
                        if(!((this.players[this.currPlayer].hasHiredServer(8) && this.players[this.currPlayer].hotel.roomColor[floor][col]==2) ||   //免费准备蓝色房间
                            (this.players[this.currPlayer].hasHiredServer(9) && this.players[this.currPlayer].hotel.roomColor[floor][col]==0) ||  //免费准备红色房间
                            (this.players[this.currPlayer].hasHiredServer(10) && this.players[this.currPlayer].hotel.roomColor[floor][col]==1))     //免费准备黄色房间
                        ){ // exceptions to pay preparation fee
                            if(this.players[this.currPlayer].hotel.roomToPrepareDiscount.length > 0){
                                this.players[this.currPlayer].loseMoney( Math.min(floor-this.players[this.currPlayer].hotel.roomToPrepareDiscount.at(-1), 0) );
                            } else {
                                this.players[this.currPlayer].loseMoney(floor);
                            }
                            this.players[this.currPlayer].hotel.roomToPrepareDiscount.pop();
                        }
                        if(this.players[this.currPlayer].hotel.roomToPrepare == 1){ // finished rooms
                            this.players[this.currPlayer].hotel.roomHighLightFlag = false;
                        }
                        this.players[this.currPlayer].hotel.highlightRoomToPrepare(this.players[this.currPlayer].money);
                        this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
                        this.players[this.currPlayer].checkOpStatus();
                        this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                        this.players[this.currPlayer].hotel.roomToPrepare--;
                    } else if(this.players[this.currPlayer].hotel.roomToClose>0 && this.players[this.currPlayer].hotel.roomHighLight[floor][col]){
                        console.log("checkout room at floor " + floor + " col " + col);
                        // close selected room, take guest bonus if any
                        this.players[this.currPlayer].hotel.roomClose(floor, col);
                        if(!this.players[this.currPlayer].hotel.roomCloseBonus) {
                            this.checkoutServerBonus(this.players[this.currPlayer].hotel.roomToCloseGuestTableID);
                            this.players[this.currPlayer].guestBonus(this.players[this.currPlayer].hotel.roomToCloseGuestID);
                            // remove guest from table (to coffin lmao)
                            this.players[this.currPlayer].hotel.removeGuestFromTable(this.players[this.currPlayer].hotel.roomToCloseGuestTableID);
                        } else {
                            this.players[this.currPlayer].hotel.roomCloseBonus = false;
                        }
                        this.players[this.currPlayer].hotel.roomToClose--;
                        if(this.players[this.currPlayer].hotel.roomToClose == 0){
                            this.players[this.currPlayer].hotel.roomHighLightFlag = false;
                        }
                        this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
                        this.players[this.currPlayer].checkOpStatus();
                        this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                    }
                }
            }
        }
        // pick guests to checkout
        var   guestXoffset = 36;
        var   guestYoffset = 610;
        const guestWidth   = 160;
        const guestHeight  = 240;
        for(let i=0; i<3; i++){
            if(this.players[this.currPlayer].hotel.guestOnTable[i] != null && 
                event.offsetX>=guestXoffset && event.offsetX<=(guestXoffset+guestWidth) && event.offsetY>=guestYoffset && event.offsetY<=(guestYoffset+guestHeight)) {
                if(this.players[this.currPlayer].hotel.atSelectSatisfiedGuest &&
                    this.players[this.currPlayer].hotel.guestOnTable[i].guestSatisfied){
                    console.log("satisfied guest " + i + " is clicked");
                    // start picking the room to close
                    this.players[this.currPlayer].hotel.atSelectSatisfiedGuest = false;
                    this.players[this.currPlayer].hotel.highlightRoomToCheckout(this.players[this.currPlayer].hotel.guestOnTable[i].guestColor);
                    this.players[this.currPlayer].hotel.roomHighLightFlag = true;
                    this.players[this.currPlayer].hotel.roomToClose = 1;
                    this.players[this.currPlayer].hotel.roomToCloseColor = this.players[this.currPlayer].hotel.guestOnTable[i].guestColor;
                    this.players[this.currPlayer].hotel.roomToCloseGuestID = this.players[this.currPlayer].hotel.guestOnTable[i].guestID;
                    this.players[this.currPlayer].hotel.roomToCloseGuestTableID = this.players[this.currPlayer].hotel.guestOnTable[i].guestTableID;
                    this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
                } else if(this.players[this.currPlayer].hotel.atSelectUnSatisfiedGuest &&
                    !this.players[this.currPlayer].hotel.guestOnTable[i].guestSatisfied){
                    this.players[this.currPlayer].hotel.atSelectUnSatisfiedGuest = false;
                    this.players[this.currPlayer].hotel.satisfyGuest(i);
                    this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
                    this.players[this.currPlayer].checkOpStatus();
                    this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                }
                
                
            }
            guestXoffset += 182;
        }
        // serve food to guests on tables
        var   foodXoffset = 40;
        var   foodYoffset = 618;
        const foodWidth   = 30;
        const foodHeight  = 28;
        for(let i=0; i<3; i++){
            if(this.players[this.currPlayer].hotel.guestOnTable[i] != null) {
                for(let j=0; j<this.players[this.currPlayer].hotel.guestOnTable[i].guestRequirement.length; j++){
                    if(event.offsetX>=foodXoffset && event.offsetX<=(foodXoffset+foodWidth) && event.offsetY>=foodYoffset && event.offsetY<=(foodYoffset+foodHeight)) {
                        console.log("guest table " + i + " food " + j + " is clicked");
                    }
                    if(event.offsetX>=foodXoffset && event.offsetX<=(foodXoffset+foodWidth) && event.offsetY>=foodYoffset && event.offsetY<=(foodYoffset+foodHeight) &&
                        !this.players[this.currPlayer].hotel.guestOnTable[i].guestFoodServed[j] &&
                        this.players[this.currPlayer].atServe){
                        var serveFlag = false;
                        switch(this.players[this.currPlayer].hotel.guestOnTable[i].guestRequirement[j]){
                            case 0: // need brown
                            serveFlag = this.players[this.currPlayer].hasBrown();
                            if(serveFlag){
                                this.players[this.currPlayer].loseBrown();
                            }
                            break;
                            case 1: // need white
                            serveFlag = this.players[this.currPlayer].hasWhite(); 
                            if(serveFlag){
                                this.players[this.currPlayer].loseWhite();
                            }
                            break;
                            case 2: // need red
                            serveFlag = this.players[this.currPlayer].hasRed(); 
                            if(serveFlag){
                                this.players[this.currPlayer].loseRed();
                            }
                            break;
                            case 3: // need black
                            serveFlag = this.players[this.currPlayer].hasBlack(); 
                            if(serveFlag){
                                this.players[this.currPlayer].loseBlack();
                            }
                            break;
                        }
                        
                        if(serveFlag){
                            console.log("served a food to guest " + this.players[this.currPlayer].hotel.guestOnTable[i].guestTableID);
                            this.players[this.currPlayer].serveFoodNum--;
                            this.players[this.currPlayer].hotel.guestOnTable[i].guestFoodServed[j] = 1;
                            this.players[this.currPlayer].hotel.guestOnTable[i].guestFoodServedNum++;
                            this.players[this.currPlayer].hotel.guestOnTable[i].guestSatisfied = 
                                (this.players[this.currPlayer].hotel.guestOnTable[i].guestRequirementNum == 
                                this.players[this.currPlayer].hotel.guestOnTable[i].guestFoodServedNum);
                            if(this.players[this.currPlayer].serveFoodNum==0){
                                this.players[this.currPlayer].atServe = false;
                            }
                            this.players[this.currPlayer].checkOpStatus();
                        }

                        this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                        this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
                    }
                    foodYoffset += 28;
                }
            }           
            foodXoffset += 182;
            foodYoffset = 618;
        }
    }

    handleAlertClick(event) {
        console.log("alert canvas clicked");
        if(this.players[this.currPlayer].atSelectFood>0) { // pick any kinds of food
            if(event.offsetX>=175 && event.offsetX<=225 && event.offsetY>=15 && event.offsetY<=35){ // increase brown
                if( (this.players[this.currPlayer].atTakeBrown + this.players[this.currPlayer].atTakeWhite + 
                    this.players[this.currPlayer].atTakeRed + this.players[this.currPlayer].atTakeBlack) < this.players[this.currPlayer].atSelectFood){
                    this.players[this.currPlayer].atTakeBrown++;
                }
                this.alertType = 6;
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 6);
                console.log("brown increase selected");
            } else if(event.offsetX>=175 && event.offsetX<=225 && event.offsetY>=45 && event.offsetY<=65){ // decrease brown
                if(this.players[this.currPlayer].atTakeBrown > 0){
                    this.players[this.currPlayer].atTakeBrown--;
                }
                this.alertType = 6;
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 6);
                console.log("brown decrease selected");
            } else if(event.offsetX>=325 && event.offsetX<=375 && event.offsetY>=15 && event.offsetY<=35){ // increase white
                if( (this.players[this.currPlayer].atTakeBrown + this.players[this.currPlayer].atTakeWhite + 
                    this.players[this.currPlayer].atTakeRed + this.players[this.currPlayer].atTakeBlack) < this.players[this.currPlayer].atSelectFood){
                    this.players[this.currPlayer].atTakeWhite++;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 6);
                console.log("brown increase selected");
            } else if(event.offsetX>=325 && event.offsetX<=375 && event.offsetY>=45 && event.offsetY<=65){ // decrease white
                if(this.players[this.currPlayer].atTakeWhite > 0){
                    this.players[this.currPlayer].atTakeWhite--;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 6);
                console.log("brown decrease selected");
            } else if(event.offsetX>=175 && event.offsetX<=225 && event.offsetY>=90 && event.offsetY<=110){ // increase red
                if( (this.players[this.currPlayer].atTakeBrown + this.players[this.currPlayer].atTakeWhite + 
                    this.players[this.currPlayer].atTakeRed + this.players[this.currPlayer].atTakeBlack) < this.players[this.currPlayer].atSelectFood){
                    this.players[this.currPlayer].atTakeRed++;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 6);
                console.log("brown increase selected");
            } else if(event.offsetX>=175 && event.offsetX<=225 && event.offsetY>=120 && event.offsetY<=140){ // decrease red
                if(this.players[this.currPlayer].atTakeRed > 0){
                    this.players[this.currPlayer].atTakeRed--;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 6);
                console.log("brown decrease selected");
            } else if(event.offsetX>=325 && event.offsetX<=375 && event.offsetY>=90 && event.offsetY<=110){ // increase black
                if( (this.players[this.currPlayer].atTakeBrown + this.players[this.currPlayer].atTakeWhite + 
                    this.players[this.currPlayer].atTakeRed + this.players[this.currPlayer].atTakeBlack) < this.players[this.currPlayer].atSelectFood){
                    this.players[this.currPlayer].atTakeBlack++;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 6);
                console.log("brown increase selected");
            } else if(event.offsetX>=325 && event.offsetX<=375 && event.offsetY>=120 && event.offsetY<=140){ // decrease black
                if(this.players[this.currPlayer].atTakeBlack > 0){
                    this.players[this.currPlayer].atTakeBlack--;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 6);
                console.log("brown decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atSelectFood = 0;
                this.players[this.currPlayer].gainBrown(this.players[this.currPlayer].atTakeBrown);
                this.players[this.currPlayer].gainWhite(this.players[this.currPlayer].atTakeWhite);
                this.players[this.currPlayer].gainRed(this.players[this.currPlayer].atTakeRed);
                this.players[this.currPlayer].gainBlack(this.players[this.currPlayer].atTakeBlack);
                this.players[this.currPlayer].checkOpStatus();
                this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                console.log("confirm selected");
            }
        } else if(this.players[this.currPlayer].atTakeBrownWhite){
            if(event.offsetX>=20 && event.offsetX<=120 && event.offsetY>=90 && event.offsetY<=140){ // boost
                if(this.players[this.currPlayer].money>0){
                    console.log("boost selected");
                    if(this.players[this.currPlayer].atActionBoost){
                        this.players[this.currPlayer].money++;
                        if(this.players[this.currPlayer].atTakeBrown==this.players[this.currPlayer].atTakeWhite){
                            this.players[this.currPlayer].atTakeWhite--;
                        } else {
                            this.players[this.currPlayer].atTakeBrown--;
                        }
                        this.players[this.currPlayer].atActionBoost = false;
                    } else {
                        this.players[this.currPlayer].money--;
                        this.players[this.currPlayer].atTakeBrown++;
                        this.players[this.currPlayer].atActionBoost = true;
                    }
                    this.players[this.currPlayer].updateAlertCanvas(alertContext, 0);
                    this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                }
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase brown
                if(this.players[this.currPlayer].atTakeWhite > 0){
                    this.players[this.currPlayer].atTakeBrown++;
                    this.players[this.currPlayer].atTakeWhite--;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 0);
                console.log("brown increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease brown
                if(this.players[this.currPlayer].atTakeBrown > 0 && this.players[this.currPlayer].atTakeBrown > this.players[this.currPlayer].atTakeWhite + 1){
                    this.players[this.currPlayer].atTakeBrown--;
                    this.players[this.currPlayer].atTakeWhite++;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 0);
                console.log("brown decrease selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=90 && event.offsetY<=110){ // increase white
                if(this.players[this.currPlayer].atTakeBrown > 0 && this.players[this.currPlayer].atTakeBrown > this.players[this.currPlayer].atTakeWhite + 1){
                    this.players[this.currPlayer].atTakeBrown--;
                    this.players[this.currPlayer].atTakeWhite++;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 0);
                console.log("white increase selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=120 && event.offsetY<=140){ // decrease white
                if(this.players[this.currPlayer].atTakeWhite > 0){
                    this.players[this.currPlayer].atTakeBrown++;
                    this.players[this.currPlayer].atTakeWhite--;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 0);
                console.log("white decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atTakeBrownWhite = false;
                this.players[this.currPlayer].gainBrown(this.players[this.currPlayer].atTakeBrown);
                this.players[this.currPlayer].gainWhite(this.players[this.currPlayer].atTakeWhite);
                this.players[this.currPlayer].atAction = false;
                this.players[this.currPlayer].actionFlag = true;
                this.players[this.currPlayer].atActionBoost = false;
                this.players[this.currPlayer].checkOpStatus();
                this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                console.log("confirm selected");
            }
        } else if(this.players[this.currPlayer].atTakeRedBlack){
            if(event.offsetX>=20 && event.offsetX<=120 && event.offsetY>=90 && event.offsetY<=140){ // boost
                if(this.players[this.currPlayer].money>0){
                    console.log("boost selected");
                    if(this.players[this.currPlayer].atActionBoost){
                        this.players[this.currPlayer].money++;
                        if(this.players[this.currPlayer].atTakeRed==this.players[this.currPlayer].atTakeBlack){
                            this.players[this.currPlayer].atTakeBlack--;
                        } else {
                            this.players[this.currPlayer].atTakeRed--;
                        }
                        this.players[this.currPlayer].atActionBoost = false;
                    } else {
                        this.players[this.currPlayer].money--;
                        this.players[this.currPlayer].atTakeRed++;
                        this.players[this.currPlayer].atActionBoost = true;
                    }
                    this.players[this.currPlayer].updateAlertCanvas(alertContext, 1);
                    this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                }
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase red
                if(this.players[this.currPlayer].atTakeBlack > 0){
                    this.players[this.currPlayer].atTakeRed++;
                    this.players[this.currPlayer].atTakeBlack--;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 1);
                console.log("red increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease red
                if(this.players[this.currPlayer].atTakeRed > 0 && this.players[this.currPlayer].atTakeRed > this.players[this.currPlayer].atTakeBlack + 1){
                    this.players[this.currPlayer].atTakeRed--;
                    this.players[this.currPlayer].atTakeBlack++;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 1);
                console.log("red decrease selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=90 && event.offsetY<=110){ // increase black
                if(this.players[this.currPlayer].atTakeRed > 0 && this.players[this.currPlayer].atTakeRed > this.players[this.currPlayer].atTakeBlack + 1){
                    this.players[this.currPlayer].atTakeRed--;
                    this.players[this.currPlayer].atTakeBlack++;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 1);
                console.log("black increase selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=120 && event.offsetY<=140){ // decrease black
                if(this.players[this.currPlayer].atTakeBlack > 0){
                    this.players[this.currPlayer].atTakeRed++;
                    this.players[this.currPlayer].atTakeBlack--;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 1);
                console.log("black decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atTakeRedBlack = false;
                this.players[this.currPlayer].gainRed(this.players[this.currPlayer].atTakeRed);
                this.players[this.currPlayer].gainBlack(this.players[this.currPlayer].atTakeBlack);
                this.players[this.currPlayer].atAction = false;
                this.players[this.currPlayer].actionFlag = true;
                this.players[this.currPlayer].atActionBoost = false;
                this.players[this.currPlayer].checkOpStatus();
                this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                console.log("confirm selected");
            }
        } else if(this.players[this.currPlayer].atPrepareRoom){
            var roomTmp = this.actionPoint[2]+1+(this.players[this.currPlayer].atActionBoost?1:0);
            if(event.offsetX>=20 && event.offsetX<=120 && event.offsetY>=90 && event.offsetY<=140){ // boost
                if(this.players[this.currPlayer].money>0){
                    console.log("boost selected");
                    if(this.players[this.currPlayer].atActionBoost){
                        this.players[this.currPlayer].money++;
                        this.players[this.currPlayer].atRoomToPrepare--;
                        roomTmp--;
                        this.players[this.currPlayer].atActionBoost = false;
                    } else {
                        this.players[this.currPlayer].money--;
                        this.players[this.currPlayer].atRoomToPrepare++;
                        roomTmp++;
                        this.players[this.currPlayer].atActionBoost = true;
                    }
                    this.players[this.currPlayer].updateAlertCanvas(alertContext, 2);
                    this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                }
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase room number
                if(this.players[this.currPlayer].atRoomToPrepare < roomTmp){
                    this.players[this.currPlayer].atRoomToPrepare++;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 2);
                console.log("room increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease room number
                if(this.players[this.currPlayer].atRoomToPrepare > 0){
                    this.players[this.currPlayer].atRoomToPrepare--;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 2);
                console.log("room decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atPrepareRoom = false;
                this.players[this.currPlayer].hotel.roomToPrepare = this.players[this.currPlayer].atRoomToPrepare;
                this.players[this.currPlayer].hotel.roomHighLightFlag = true;
                this.players[this.currPlayer].hotel.highlightRoomToPrepare(this.players[this.currPlayer].money);
                this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
                this.players[this.currPlayer].atAction = false;
                this.players[this.currPlayer].actionFlag = true;
                this.players[this.currPlayer].atActionBoost = false;
                this.players[this.currPlayer].checkOpStatus();
                this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                console.log("confirm selected");
            }
        } else if(this.players[this.currPlayer].atRoyalMoney){
            if(event.offsetX>=20 && event.offsetX<=120 && event.offsetY>=90 && event.offsetY<=140){ // boost
                if(this.players[this.currPlayer].money>0){
                    console.log("boost selected");
                    if(this.players[this.currPlayer].atActionBoost){
                        this.players[this.currPlayer].gainMoney(1);
                        if(this.players[this.currPlayer].hasHiredServer(14)){
                            this.players[this.currPlayer].atRoyal--;
                            this.players[this.currPlayer].atMoney--;
                        } else {
                            if(this.players[this.currPlayer].atRoyal > 0){
                                this.players[this.currPlayer].atRoyal--
                            } else {
                                this.players[this.currPlayer].atMoney--;
                            }
                        }
                        this.players[this.currPlayer].atActionBoost = false;
                    } else {
                        this.players[this.currPlayer].loseMoney(1);
                        if(this.players[this.currPlayer].hasHiredServer(14)){
                            this.players[this.currPlayer].atMoney++;
                            this.players[this.currPlayer].atRoyal++;
                        } else {
                            this.players[this.currPlayer].atRoyal++;
                        }
                        this.players[this.currPlayer].atActionBoost = true;
                    }
                    this.players[this.currPlayer].updateAlertCanvas(alertContext, 3);
                    this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                }
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase royal
                if(this.players[this.currPlayer].atMoney > 0 && !this.players[this.currPlayer].hasHiredServer(14)){
                    this.players[this.currPlayer].atRoyal++;
                    this.players[this.currPlayer].atMoney--;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 3);
                console.log("royal increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease royal
                if(this.players[this.currPlayer].atRoyal > 0 && !this.players[this.currPlayer].hasHiredServer(14)){
                    this.players[this.currPlayer].atRoyal--;
                    this.players[this.currPlayer].atMoney++;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 3);
                console.log("royal decrease selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=90 && event.offsetY<=110){ // increase money
                if(this.players[this.currPlayer].atRoyal > 0 && !this.players[this.currPlayer].hasHiredServer(14)){
                    this.players[this.currPlayer].atRoyal--;
                    this.players[this.currPlayer].atMoney++;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 3);
                console.log("money increase selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=120 && event.offsetY<=140){ // decrease money
                if(this.players[this.currPlayer].atMoney > 0 && !this.players[this.currPlayer].hasHiredServer(14)){
                    this.players[this.currPlayer].atRoyal++;
                    this.players[this.currPlayer].atMoney--;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 3);
                console.log("money decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atRoyalMoney = false;
                this.players[this.currPlayer].gainRoyal(this.players[this.currPlayer].atRoyal);
                this.players[this.currPlayer].gainMoney(this.players[this.currPlayer].atMoney);
                this.players[this.currPlayer].atAction = false;
                this.players[this.currPlayer].actionFlag = true;
                this.players[this.currPlayer].atActionBoost = false;
                this.players[this.currPlayer].checkOpStatus();
                this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                console.log("confirm selected");
            }
        } else if(this.players[this.currPlayer].atHireServer){
            if(event.offsetX>=20 && event.offsetX<=120 && event.offsetY>=90 && event.offsetY<=140){ // boost
                if(this.players[this.currPlayer].money>0){
                    console.log("boost selected");
                    if(this.players[this.currPlayer].atActionBoost){
                        this.players[this.currPlayer].money++;
                        this.players[this.currPlayer].atHireServerdiscount.at(-1)--;
                        this.players[this.currPlayer].atActionBoost = false;
                    } else {
                        this.players[this.currPlayer].money--;
                        this.players[this.currPlayer].atHireServerdiscount.at(-1)++;
                        this.players[this.currPlayer].atActionBoost = true;
                    }
                    this.players[this.currPlayer].updateAlertCanvas(alertContext, 4);
                    this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                }
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atHireServer = false;
                this.players[this.currPlayer].serverOnHandHighLightFlag = true;
                this.players[this.currPlayer].hireFlag++;
                this.players[this.currPlayer].highlightServerToHire(this.players[this.currPlayer].atHireServerdiscount.at(-1));
                this.players[this.currPlayer].updateServerCanvas(serverContext);
                this.players[this.currPlayer].atAction = false;
                this.players[this.currPlayer].actionFlag = true;
                this.players[this.currPlayer].atActionBoost = false;
                this.players[this.currPlayer].checkOpStatus();
                this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                console.log("confirm selected");
            }
            
        } else if(this.players[this.currPlayer].atTakeMirror){
            if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase dice
                if(this.players[this.currPlayer].atMirrorDice < 6){
                    this.players[this.currPlayer].atMirrorDice++;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 5);
                console.log("brown increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease dice
                if(this.players[this.currPlayer].atMirrorDice > 1){
                    this.players[this.currPlayer].atMirrorDice--;
                }
                this.players[this.currPlayer].updateAlertCanvas(alertContext, 5);
                console.log("brown decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atTakeMirror = false;
                switch(this.players[this.currPlayer].atMirrorDice){
                    case 1: this.players[this.currPlayer].actionTakeBrownWhite(this.players[this.currPlayer].atMirrorStrength); break;
                    case 2: this.players[this.currPlayer].actionTakeRedBlack(this.players[this.currPlayer].atMirrorStrength); break;
                    case 3: this.players[this.currPlayer].actionPrepareRoom(this.players[this.currPlayer].atMirrorStrength); break;
                    case 4: this.players[this.currPlayer].actionTakeRoyalMoney(this.players[this.currPlayer].atMirrorStrength); break;
                    case 5: this.players[this.currPlayer].actionHireServer(this.players[this.currPlayer].atMirrorStrength); break;
                }
                this.players[this.currPlayer].atAction = false;
                this.players[this.currPlayer].atActionBoost = false;
                this.players[this.currPlayer].checkOpStatus();
                this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                console.log("confirm selected");
            }
        }
    }

    handleServerClick(event) {
        console.log("server canvas clicked");
        // left roll
        if(event.offsetX>=0 && event.offsetX<=25 && event.offsetY>=80 && event.offsetY<=130 && this.players[this.currPlayer].serverOnHandCanvasIdx>0){
            console.log("sever on hand left roll clicked");
            this.players[this.currPlayer].serverOnHandCanvasIdx--;
            this.players[this.currPlayer].updateServerCanvas(serverContext);
        } // right roll
        else if(event.offsetX>=615 && event.offsetX<=640 && event.offsetY>=80 && event.offsetY<=130 && this.players[this.currPlayer].serverOnHandCanvasIdx<(this.players[this.currPlayer].numServerOnHand-3)) {
            console.log("sever on hand right roll clicked");
            this.players[this.currPlayer].serverOnHandCanvasIdx++;
            this.players[this.currPlayer].updateServerCanvas(serverContext);
        } // server hire
        else{
            for(let i=0; i<3; i++){
                if(this.players[this.currPlayer].serverOnHandCanvasIdx + i < this.players[this.currPlayer].numServerOnHand){
                    const serverIdx = this.players[this.currPlayer].serverOnHandCanvasIdx + i;
                    if(event.offsetX>=(65+170*i) && event.offsetX<=(225+170*i) && event.offsetY>=35 && event.offsetY<=275 && 
                        this.players[this.currPlayer].hireFlag && this.players[this.currPlayer].serverOnHandHighLight[serverIdx]){
                        console.log("hire server " + serverIdx);
                        if(this.players[this.currPlayer].serverOnHand[serverIdx].serverCost > this.players[this.currPlayer].atHireServerdiscount.at(-1)) {
                            this.players[this.currPlayer].money -= (this.players[this.currPlayer].serverOnHand[serverIdx].serverCost - this.players[this.currPlayer].atHireServerdiscount.at(-1));
                            this.players[this.currPlayer].atHireServerdiscount.pop();
                        }
                        this.players[this.currPlayer].hireFlag--;
                        this.players[this.currPlayer].hireServer(serverIdx);
                        if(this.players[this.currPlayer].hireLimitLastThree){ // draw 3 hire 1 senario, put back the reset
                            this.serverDeck.push(this.players[this.currPlayer].serverOnHand.pop());
                            this.serverDeck.push(this.players[this.currPlayer].serverOnHand.pop());
                            this.shuffleDeck(this.serverDeck);
                        }
                        if(this.players[this.currPlayer].hireFlag==0){
                            this.players[this.currPlayer].serverOnHandHighLightFlag = false;
                            this.players[this.currPlayer].highlightServerToHire(this.players[this.currPlayer].atHireServerdiscount.at(-1));
                        }
                        this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
                        this.players[this.currPlayer].updateServerCanvas(serverContext);
                        this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
                    }
                }
            }
        }
    }

    nextMiniRound() {
        // First guest invitation is special
        if(this.players[this.currPlayer].firstGuestTurn){
            this.players[this.currPlayer].firstGuestTurn = false;
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
            this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
            this.players[this.currPlayer].updateServerCanvas(serverContext);
            this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
        } else { // normal mini round
            this.players[this.currPlayer].inviteFlag = false;
            this.players[this.currPlayer].actionFlag = false;
            this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
            if(this.specialRound){ // special round from guest
                return;
            }
            if(this.miniRound == (2*this.playerNumber-1)) { // end of main round
                if(this.mainRound == 6) { // end of entire game
                    this.gameEnd();
                    window.alert("游戏结束!");
                } else { // next main round
                    this.mainRoundEnd();
                    this.mainRound++;
                    this.miniRound = 0;
                    this.currPlayer = 0;
                    for(let i=0; i<4; i++){
                        this.players[i].diceTaken = [-1, -1];
                        this.players[i].updatePlayerCanvas(this.players[i].context);
                    }
                    this.rollDice();
                }
            } else { // next mini round
                this.miniRound++;
                this.currPlayer = (this.miniRound < this.playerNumber) ? this.miniRound : 2*this.playerNumber-this.miniRound-1;
            }
            // take a food for every per-turn server
            if(this.players[this.currPlayer].hasHiredServer(0)){
                this.players[this.currPlayer].gainBrown(1);
            }
            if(this.players[this.currPlayer].hasHiredServer(1)){
                this.players[this.currPlayer].gainWhite(1);
            }
            if(this.players[this.currPlayer].hasHiredServer(2)){
                this.players[this.currPlayer].gainRed(1);
            }
            if(this.players[this.currPlayer].hasHiredServer(3)){
                this.players[this.currPlayer].gainBlack(1);
            }
            // update all canvas
            this.updateGuestCanvas(guestContext);
            this.players[this.currPlayer].checkOpStatus();
            this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
            this.players[this.currPlayer].updateServerCanvas(serverContext);
            this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
        }
    }

    mainRoundEnd() { // handle royal tasks
        // TODO
        // some reward and punishment need selection
        // set flag to show alert canvas when needed, and return it
        for(let i=0; i<this.playerNumber; i++) {
            switch(this.mainRound){ // reduce royal first
                case 2: this.players[i].loseRoyal(3); break;
                case 4: this.players[i].loseRoyal(5); break;
                case 6: this.players[i].loseRoyal(7); break;
            }
            if(this.players[i].royalPoint < 1) { // punishment
                switch(this.mainRound){
                    case 2: 
                        switch(this.royalTask0){
                            case 0: break; // 获得3块钱/失去3块钱或5游戏点数
                            case 1: break; // 获得2份任意食物/失去厨房全部食物
                            case 2: break; // 抽3员工打1减3费返还剩余/丢弃2张员工手牌或失去5游戏点数
                            case 3: break; // 免费准备1个房间/失去最高的准备好的房间或失去5游戏点数
                        }
                        break;
                    case 4:
                        switch(this.royalTask1){
                            case 0: break; // 获得4种食物各1份/失去厨房和客桌上的全部食物
                            case 1: break; // 获得5块钱/失去5块钱或失去7游戏点数
                            case 2: break; // 抽3员工打1免费返还剩余/丢弃3张员工手牌或失去7游戏点数
                            case 3: break; // 2层以内免费准备2个房间/失去最高的已入住的2个房间或失去7游戏点数
                        }
                        break;
                    case 6:
                        switch(this.royalTask2){
                            case 0: break; // 获得8游戏点数/失去8游戏点数
                            case 1: break; // 免费准备1个房间并入住/失去最高层和次高层各1个已入住房间
                            case 2: break; // 每个已雇佣员工获得2游戏点数/每个已雇佣员工失去2游戏点数
                            case 3: break; // 免费雇佣1位手牌上的员工/失去1位已雇佣员工（终局结算优先）或失去10游戏点数
                        }
                        break;
                }
            } else if(this.players[i].royalPoint > 2) { // reward
                switch(this.mainRound){
                    case 2: 
                        switch(this.royalTask0){
                            case 0: // 获得3块钱/失去3块钱或5游戏点数 
                            this.players[i].gainMoney(3);
                            break; 
                            case 1: // 获得2份任意食物/失去厨房全部食物
                            alertCanvas.style.display = 'block';
                            this.players[i].atSelectFood = 2;
                            this.players[i].atTakeBrown = 2; // default to brown
                            this.players[i].updateAlertCanvas(alertContext, 6);
                            break;
                            case 2: // 抽3员工打1减3费返还剩余/丢弃2张员工手牌或失去5游戏点数
                            this.players[i].addServerToHand(this.serverDeck.at(-1));
                            this.serverDeck.pop();
                            this.players[i].addServerToHand(this.serverDeck.at(-1));
                            this.serverDeck.pop();
                            this.players[i].addServerToHand(this.serverDeck.at(-1));
                            this.serverDeck.pop();
                            this.players[i].serverOnHandHighLightFlag = true;
                            this.players[i].hireFlag++;
                            this.players[i].hireLimitLastThree = true;
                            this.players[i].highlightServerToHire(3);
                            this.players[i].atHireServerdiscount.push(3);
                            break; 
                            case 3: // 免费准备1个房间/失去最高的准备好的房间或失去5游戏点数
                            this.hotel.roomToPrepare = 1;
                            this.hotel.roomHighLightFlag = true;
                            this.hotel.roomToPrepareDiscount.push(5); // free
                            this.hotel.highlightRoomToPrepare(this.players[i].money);
                            break; 
                        }
                        break;
                    case 4:
                        switch(this.royalTask1){
                            case 0: break; // 获得4种食物各1份/失去厨房和客桌上的全部食物
                            case 1: break; // 获得5块钱/失去5块钱或失去7游戏点数
                            case 2: break; // 抽3员工打1免费返还剩余/丢弃3张员工手牌或失去7游戏点数
                            case 3: break; // 2层以内免费准备2个房间/失去最高的已入住的2个房间或失去7游戏点数
                        }
                        break;
                    case 6:
                        switch(this.royalTask2){
                            case 0: break; // 获得8游戏点数/失去8游戏点数
                            case 1: break; // 免费准备1个房间并入住/失去最高层和次高层各1个已入住房间
                            case 2: break; // 每个已雇佣员工获得2游戏点数/每个已雇佣员工失去2游戏点数
                            case 3: break; // 免费雇佣1位手牌上的员工/失去1位已雇佣员工（终局结算优先）或失去10游戏点数
                        }
                        break;
                }
            }
        }
        
    }

    gameEnd() {
        for(let i=0; i<this.playerNumber; i++){
            this.players[i].calculateFinalGamePoint();
        }
    }

    takeDice(value) {
        if(this.miniRound < this.playerNumber) {
            this.players[this.currPlayer].diceTaken[0] = value+1;
        } else {
            this.players[this.currPlayer].diceTaken[1] = value+1;
        }
        this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
        var serverBonus = 0;
        if(this.players[this.currPlayer].hasHiredServer(11) && (value==2 || value==3)) {//使用色子3或4时获得2游戏点数
            this.players[this.currPlayer].gainGamePoint(2);
        }
        if(this.players[this.currPlayer].hasHiredServer(12) && (value==0 || value==1)) {//使用色子1或2时加1强度
            serverBonus = 1;
        }
        if(this.players[this.currPlayer].hasHiredServer(13) && (value==0 || value==1)) {//使用色子1或2时可以准备一个房间
            this.players[this.currPlayer].hotel.roomToPrepare = 1;
            this.players[this.currPlayer].hotel.roomHighLightFlag = true;
            this.players[this.currPlayer].hotel.highlightRoomToPrepare(this.players[this.currPlayer].money);
            this.players[this.currPlayer].hotel.updateHotelCanvas(hotelContext);
        }
        if(this.players[this.currPlayer].hasHiredServer(15) && value==3) {//使用色子4时可以获得4游戏点数
            this.players[this.currPlayer].gainGamePoint(4);
        }
        if(this.players[this.currPlayer].hasHiredServer(17) && value==4) {//使用色子5时加2强度
            serverBonus = 2;
        }
        if(this.players[this.currPlayer].hasHiredServer(18) && value==2) {//使用色子3时获得5游戏点数
            this.players[this.currPlayer].gainGamePoint(5);
        }
        if(this.players[this.currPlayer].hasHiredServer(19) && value==4) {//使用色子5时获得2皇家点数
            this.players[this.currPlayer].gainRoyal(2);
        }
        if(this.players[this.currPlayer].hasHiredServer(21) && value==2) {//使用色子3时可以雇佣一位员工
            this.players[this.currPlayer].serverOnHandHighLightFlag = true;
            this.players[this.currPlayer].hireFlag++;
            this.players[this.currPlayer].highlightServerToHire(0);
            this.players[this.currPlayer].updateServerCanvas(serverContext);
        }
        
        switch(value){
            case 0: // take brown and white
            this.players[this.currPlayer].actionTakeBrownWhite(this.actionPoint[0] + serverBonus);
            break;
            case 1: // take red and black
            this.players[this.currPlayer].actionTakeRedBlack(this.actionPoint[1] + serverBonus);
            break;
            case 2: // prepare rooms
            this.players[this.currPlayer].actionPrepareRoom(this.actionPoint[2]);
            break;
            case 3: // take royal point or money
            this.players[this.currPlayer].actionTakeRoyalMoney(this.actionPoint[3]);
            break;
            case 4: // hire server
            this.players[this.currPlayer].actionHireServer(this.actionPoint[4] + serverBonus);
            break;
            case 5: // mirror an action
            if(!this.players[this.currPlayer].hasHiredServer(16)) {//使用色子6时无需支付费用并且强度加1
                this.players[this.currPlayer].money--; // dice 6 fee exception
            } else {
                serverBonus = 1;
            }
            this.players[this.currPlayer].updatePlayerCanvas(this.players[this.currPlayer].context);
            this.players[this.currPlayer].actionTakeMirror(this.actionPoint[5] + serverBonus);
            break;
        }
        if(!this.specialRound){ // in special bonus round, no dice is taken
            this.actionPoint[value]--;
        }
    }

    takeOneGuestFromQueue(guestSelected) {
        console.log("remove guest " + guestNameByID[this.guestInQueue[guestSelected]] + " from queue");
        this.guestInQueue.splice(guestSelected, 1); // remove this guest from queue
        this.guestInQueue.unshift(this.guestDeck.at(-1));
        this.guestDeck.pop();
        console.log("add guest " + guestNameByID[this.guestInQueue[0]] + " to queue");
    }

    rollDice() {
        console.log("roll dice");
        this.actionPoint = [0, 0, 0, 0, 0, 0];
        for(let i=0; i<this.diceNumber; i++){
            this.actionPoint[Math.floor(Math.random() * 6)]++;
        }
        this.updateActionCanvas(actionContext);
    }

    checkoutServerBonus(guestTableID) {
        if(guestTableID == -1){ // invalid guest ID
            return;
        }
        if(this.players[this.currPlayer].hasHiredServer(4)) { //满足红色客人时获得2块钱
            if(this.players[this.currPlayer].hotel.guestOnTable[guestTableID].guestColor==0){
                this.players[this.currPlayer].gainMoney(2);
            }
        }
        if(this.players[this.currPlayer].hasHiredServer(5)) { //满足蓝色客人时获得1皇家点数
            if(this.players[this.currPlayer].hotel.guestOnTable[guestTableID].guestColor==2){
                this.players[this.currPlayer].gainRoyal(1);
            }
        }
        if(this.players[this.currPlayer].hasHiredServer(6)) { //满足黄色客人时获得1块钱
            if(this.players[this.currPlayer].hotel.guestOnTable[guestTableID].guestColor==1){
                this.players[this.currPlayer].gainMoney(1);
            }
        }
        if(this.players[this.currPlayer].hasHiredServer(7)) { //满足绿色客人时获得2游戏点数
            if(this.players[this.currPlayer].hotel.guestOnTable[guestTableID].guestColor===4){
                this.players[this.currPlayer].gainGamePoint(2);
            }
        }
        if(this.players[this.currPlayer].hasHiredServer(22)) { //满足客人并入住时可以获得1块钱
            this.players[this.currPlayer].gainMoney(1);
        }
        if(this.players[this.currPlayer].hasHiredServer(32)) { //满足食物或饮料需求量为4的客人时获得4游戏点数
            if(this.players[this.currPlayer].hotel.guestOnTable[guestTableID].guestRequirementNum==4){
                this.players[this.currPlayer].gainGamePoint(4);
            }
        }
    }
}
