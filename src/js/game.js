// Main game class definition
class Game{
    constructor(playerNumber, playerName, standardHotel) {
        // init top info
        console.log("new game!!")
        this.playerNumber = playerNumber;
        this.playerName = playerName;
        this.gameOver = false;
        this.winner = -1;
        this.standardHotel = standardHotel;
        this.diceNumber = playerNumber * 2 + 6;
        this.majorTask0 = Math.floor(Math.random() * 4);
        this.majorTask1 = Math.floor(Math.random() * 4);
        this.majorTask2 = Math.floor(Math.random() * 4);
        this.majorTaskComp = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
        this.royalTask0 = Math.floor(Math.random() * 4);
        this.royalTask1 = Math.floor(Math.random() * 4);
        this.royalTask2 = Math.floor(Math.random() * 4);
        this.mainRound = 0;
        this.miniRound = 0;
        this.royalRound = false;
        this.actionPoint = [0, 0, 0, 0, 0, 0];
        this.actionHighLightFlag = false;
        this.actionHighLight = [0, 0, 0, 0, 0, 0];
        this.guestHighLightFlag = false;
        this.guestHighLight = [0, 0, 0, 0, 0];
        // log detail
        this.log = ["游戏开始，免费邀请一个客人并原价开三个房间"];
        // alert type depends on game phase
        this.alertType = 0;

        // init guest deck and server deck
        this.guestDeck = Array.from({length: 58}, (_, i) => i);
        this.serverDeck = Array.from({length: 48}, (_, i) => i);
        // this.shuffleDeck(this.guestDeck);
        // this.shuffleDeck(this.serverDeck);

        // take first 5 guests in queue
        this.guestInQueue = [];
        // for(let i=0; i<5; i++){
        //     this.guestInQueue.push(this.guestDeck.at(-1));
        //     this.guestDeck.pop();
        // }

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
        // for(let i=0; i<this.playerNumber; i++) { // draw 6 servers
        //     this.players[i].addServerToHand(6);
        // }
        
        // place the first player to start
        this.currPlayer = 0;
        this.ourPlayer = 0;
        // console.log("current player: " + this.playerName[this.currPlayer]);

        // backup buf in a mini turn, able to undo this turn
        this.turnBkup = {
            // game info
            majorTaskComp0: [],
            majorTaskComp1: [],
            majorTaskComp2: [],
            actionPoint:    [],
            guestDeck:      [],
            serverDeck:     [],
            guestInQueue:   [],
            // player info
            diceTaken:                 [],
            specialRound:              false,
            gamePoint:                 0,
            royalPoint:                0,
            food:                      0,
            brown:                     0,
            white:                     0,
            red:                       0,
            black:                     0,
            foodBuf:                   0,
            brownBuf:                  0,
            whiteBuf:                  0,
            redBuf:                    0,
            blackBuf:                  0,
            money:                     0,
            numServerOnHand:           0,
            numServerHired:            0,
            serverOnHand:              [],
            serverOnHandCanvasIdx:     0,
            serverHired:               [],
            serverHiredCanvasIdx:      0,
            // hotel info
            roomStatus0:              [],
            roomStatus1:              [],
            roomStatus2:              [],
            roomStatus3:              [],
            roomAreaRoom:             [],
            roomClosedNum:            0,
            roomPreparedNum:          0,
            roomColumnClosedNum:      0,
            roomRowClosedNum:         0,
            roomAreaClosedNum:        0,
            roomRedClosedNum:         0,
            roomYellowClosedNum:      0,
            roomBlueClosedNum:        0,
            roomRedPreparedNum:       0,
            roomYellowPreparedNum:    0,
            roomBluePreparedNum:      0,
            numGuestOnTable:          0,
            guestOnTable:             [],
            maxClosedRoomLevel:       0,
            maxPreparedRoomLevel:     0,
            // guest table
            /*
            this.guestSatisfied = false;
            this.guestFoodServed = [];
            this.guestFoodServedNum = 0;
            */
            guestSatisfied0: false,
            guestSatisfied1: false,
            guestSatisfied2: false,
            guestFoodServed0: [],
            guestFoodServed1: [],
            guestFoodServed2: [],
            guestFoodServedNum0: 0,
            guestFoodServedNum1: 0,
            guestFoodServedNum2: 0
        };

        // draw canvas
        this.updateAllCanvas();
    }

    bkupMiniTurn() {
        // var miniTurnInfo = {
            // game info
            this.turnBkup.majorTaskComp0= this.majorTaskComp[0].slice();
            this.turnBkup.majorTaskComp1= this.majorTaskComp[1].slice();
            this.turnBkup.majorTaskComp2= this.majorTaskComp[2].slice();
            this.turnBkup.actionPoint   = this.actionPoint.slice();
            this.turnBkup.guestDeck     = this.guestDeck.slice();
            this.turnBkup.serverDeck    = this.serverDeck.slice();
            this.turnBkup.guestInQueue  = this.guestInQueue.slice();
            // player info
            this.turnBkup.diceTaken              = this.players[this.currPlayer].diceTaken.slice();
            this.turnBkup.specialRound           = this.players[this.currPlayer].specialRound;
            this.turnBkup.gamePoint              = this.players[this.currPlayer].gamePoint;
            this.turnBkup.royalPoint             = this.players[this.currPlayer].royalPoint;
            this.turnBkup.food                   = this.players[this.currPlayer].food;
            this.turnBkup.brown                  = this.players[this.currPlayer].brown;
            this.turnBkup.white                  = this.players[this.currPlayer].white;
            this.turnBkup.red                    = this.players[this.currPlayer].red;
            this.turnBkup.black                  = this.players[this.currPlayer].black;
            this.turnBkup.foodBuf                = this.players[this.currPlayer].foodBuf;
            this.turnBkup.brownBuf               = this.players[this.currPlayer].brownBuf;
            this.turnBkup.whiteBuf               = this.players[this.currPlayer].whiteBuf;
            this.turnBkup.redBuf                 = this.players[this.currPlayer].redBuf;
            this.turnBkup.blackBuf               = this.players[this.currPlayer].blackBuf;
            this.turnBkup.money                  = this.players[this.currPlayer].money;
            this.turnBkup.numServerOnHand        = this.players[this.currPlayer].numServerOnHand;
            this.turnBkup.numServerHired         = this.players[this.currPlayer].numServerHired;
            this.turnBkup.serverOnHand           = this.players[this.currPlayer].serverOnHand.slice();
            this.turnBkup.serverOnHandCanvasIdx  = this.players[this.currPlayer].serverOnHandCanvasIdx;
            this.turnBkup.serverHired            = this.players[this.currPlayer].serverHired.slice();
            this.turnBkup.serverHiredCanvasIdx   = this.players[this.currPlayer].serverHiredCanvasIdx;
            // hotel info
            this.turnBkup.roomStatus0            = this.players[this.currPlayer].hotel.roomStatus[0].slice();
            this.turnBkup.roomStatus1            = this.players[this.currPlayer].hotel.roomStatus[1].slice();
            this.turnBkup.roomStatus2            = this.players[this.currPlayer].hotel.roomStatus[2].slice();
            this.turnBkup.roomStatus3            = this.players[this.currPlayer].hotel.roomStatus[3].slice();
            this.turnBkup.roomAreaRoom           = this.players[this.currPlayer].hotel.roomAreaRoom.slice();
            this.turnBkup.roomClosedNum          = this.players[this.currPlayer].hotel.roomClosedNum;
            this.turnBkup.roomPreparedNum        = this.players[this.currPlayer].hotel.roomPreparedNum;
            this.turnBkup.roomColumnClosedNum    = this.players[this.currPlayer].hotel.roomColumnClosedNum;
            this.turnBkup.roomRowClosedNum       = this.players[this.currPlayer].hotel.roomRowClosedNum;
            this.turnBkup.roomAreaClosedNum      = this.players[this.currPlayer].hotel.roomAreaClosedNum;
            this.turnBkup.roomRedClosedNum       = this.players[this.currPlayer].hotel.roomRedClosedNum;
            this.turnBkup.roomYellowClosedNum    = this.players[this.currPlayer].hotel.roomYellowClosedNum;
            this.turnBkup.roomBlueClosedNum      = this.players[this.currPlayer].hotel.roomBlueClosedNum;
            this.turnBkup.roomRedPreparedNum     = this.players[this.currPlayer].hotel.roomRedPreparedNum;
            this.turnBkup.roomYellowPreparedNum  = this.players[this.currPlayer].hotel.roomYellowPreparedNum;
            this.turnBkup.roomBluePreparedNum    = this.players[this.currPlayer].hotel.roomBluePreparedNum;
            this.turnBkup.numGuestOnTable        = this.players[this.currPlayer].hotel.numGuestOnTable;
            this.turnBkup.guestOnTable           = this.players[this.currPlayer].hotel.guestOnTable.slice();
            this.turnBkup.maxClosedRoomLevel     = this.players[this.currPlayer].hotel.maxClosedRoomLevel;
            this.turnBkup.maxPreparedRoomLevel   = this.players[this.currPlayer].hotel.maxPreparedRoomLevel;
            // guest info
            if(this.players[this.currPlayer].hotel.guestOnTable[0] != null){
                this.turnBkup.guestSatisfied0 = this.players[this.currPlayer].hotel.guestOnTable[0].guestSatisfied;
                this.turnBkup.guestFoodServed0 = this.players[this.currPlayer].hotel.guestOnTable[0].guestFoodServed.slice();
                this.turnBkup.guestFoodServedNum0 = this.players[this.currPlayer].hotel.guestOnTable[0].guestFoodServedNum;
            }
            if(this.players[this.currPlayer].hotel.guestOnTable[1] != null){
                this.turnBkup.guestSatisfied1 = this.players[this.currPlayer].hotel.guestOnTable[1].guestSatisfied;
                this.turnBkup.guestFoodServed1 = this.players[this.currPlayer].hotel.guestOnTable[1].guestFoodServed.slice();
                this.turnBkup.guestFoodServedNum1 = this.players[this.currPlayer].hotel.guestOnTable[1].guestFoodServedNum;
            }
            if(this.players[this.currPlayer].hotel.guestOnTable[2] != null){
                this.turnBkup.guestSatisfied2 = this.players[this.currPlayer].hotel.guestOnTable[2].guestSatisfied;
                this.turnBkup.guestFoodServed2 = this.players[this.currPlayer].hotel.guestOnTable[2].guestFoodServed.slice();
                this.turnBkup.guestFoodServedNum2 = this.players[this.currPlayer].hotel.guestOnTable[2].guestFoodServedNum;
            }
        // };
        // this.turnBkup = miniTurnInfo;
    }

    restoreMiniTurn() {
        this.log.push(this.playerName[this.currPlayer] + "选择重置本回合");
        // game info
        this.majorTaskComp[0] = this.turnBkup.majorTaskComp0.slice();
        this.majorTaskComp[1] = this.turnBkup.majorTaskComp1.slice();
        this.majorTaskComp[2] = this.turnBkup.majorTaskComp2.slice();
        this.actionPoint = this.turnBkup.actionPoint.slice();
        this.guestDeck = this.turnBkup.guestDeck.slice();
        this.serverDeck = this.turnBkup.serverDeck.slice();
        this.guestInQueue = this.turnBkup.guestInQueue.slice();
        // player info
        this.players[this.currPlayer].royalResult = -1;
        this.players[this.currPlayer].royalResultPending = false;
        this.players[this.currPlayer].royalResultFinish = false;
        this.players[this.currPlayer].diceTaken = this.turnBkup.diceTaken.slice();
        this.players[this.currPlayer].atInvite = false;
        this.players[this.currPlayer].atAction = false;
        this.players[this.currPlayer].atServe = false;
        this.players[this.currPlayer].atCheckout = false;
        this.players[this.currPlayer].atTakeBrownWhite = false;
        this.players[this.currPlayer].atTakeRedBlack = false;
        this.players[this.currPlayer].atPrepareRoom = false;
        this.players[this.currPlayer].atRoyalMoney = false;
        this.players[this.currPlayer].atHireServer = false;
        this.players[this.currPlayer].atTakeMirror = false;
        this.players[this.currPlayer].atSelectFood = 0;
        this.players[this.currPlayer].atTakeBrown = 0;
        this.players[this.currPlayer].atTakeWhite = 0;
        this.players[this.currPlayer].atTakeRed = 0;
        this.players[this.currPlayer].atTakeBlack = 0;
        this.players[this.currPlayer].atRoomToPrepare = 0;
        this.players[this.currPlayer].atRoyal = 0;
        this.players[this.currPlayer].atMoney = 0;
        this.players[this.currPlayer].atHireServerdiscount = [];
        this.players[this.currPlayer].atMirrorDice = 1;
        this.players[this.currPlayer].atMirrorStrength = 0;
        this.players[this.currPlayer].atActionBoost = false;
        this.players[this.currPlayer].freeInviteNum = 0;
        this.players[this.currPlayer].inviteFlag = false;
        this.players[this.currPlayer].actionFlag = false;
        this.players[this.currPlayer].hireNum = 0;
        this.players[this.currPlayer].hireLimitLastThree = false;
        this.players[this.currPlayer].royalPunishSelection = 0;
        this.players[this.currPlayer].loseServerNum = 0;
        this.players[this.currPlayer].loseHiredNum = 0;
        this.players[this.currPlayer].serveFoodNum = 0;
        this.players[this.currPlayer].specialRound = this.turnBkup.specialRound;
        this.players[this.currPlayer].specialRoundFlag = false;
        this.players[this.currPlayer].gamePoint = this.turnBkup.gamePoint;
        this.players[this.currPlayer].royalPoint = this.turnBkup.royalPoint;
        this.players[this.currPlayer].food = this.turnBkup.food;
        this.players[this.currPlayer].brown = this.turnBkup.brown;
        this.players[this.currPlayer].white = this.turnBkup.white;
        this.players[this.currPlayer].red = this.turnBkup.red;
        this.players[this.currPlayer].black = this.turnBkup.black;
        this.players[this.currPlayer].foodBuf = this.turnBkup.foodBuf;
        this.players[this.currPlayer].brownBuf = this.turnBkup.brownBuf;
        this.players[this.currPlayer].whiteBuf = this.turnBkup.whiteBuf;
        this.players[this.currPlayer].redBuf = this.turnBkup.redBuf;
        this.players[this.currPlayer].blackBuf = this.turnBkup.blackBuf;
        this.players[this.currPlayer].money = this.turnBkup.money;
        this.players[this.currPlayer].numServerOnHand = this.turnBkup.numServerOnHand;
        this.players[this.currPlayer].numServerHired = this.turnBkup.numServerHired;
        this.players[this.currPlayer].serverOnHand = this.turnBkup.serverOnHand.slice();
        this.players[this.currPlayer].serverOnHandCanvasIdx = this.turnBkup.serverOnHandCanvasIdx;
        this.players[this.currPlayer].serverHired = this.turnBkup.serverHired.slice();
        this.players[this.currPlayer].serverHiredCanvasIdx = this.turnBkup.serverHiredCanvasIdx;
        this.players[this.currPlayer].serverOnHandHighLightFlag = false;
        this.players[this.currPlayer].serverOnHandHighLight = [];
        this.players[this.currPlayer].serverHiredHighLightFlag = false;
        this.players[this.currPlayer].serverHiredHighLight = [];
        // hotel info
        this.players[this.currPlayer].hotel.roomStatus[0] = this.turnBkup.roomStatus0.slice();
        this.players[this.currPlayer].hotel.roomStatus[1] = this.turnBkup.roomStatus1.slice();
        this.players[this.currPlayer].hotel.roomStatus[2] = this.turnBkup.roomStatus2.slice();
        this.players[this.currPlayer].hotel.roomStatus[3] = this.turnBkup.roomStatus3.slice();
        this.players[this.currPlayer].hotel.roomAreaRoom = this.turnBkup.roomAreaRoom.slice();
        this.players[this.currPlayer].hotel.roomClosedNum = this.turnBkup.roomClosedNum;
        this.players[this.currPlayer].hotel.roomPreparedNum = this.turnBkup.roomPreparedNum;
        this.players[this.currPlayer].hotel.roomColumnClosedNum = this.turnBkup.roomColumnClosedNum;
        this.players[this.currPlayer].hotel.roomRowClosedNum = this.turnBkup.roomRowClosedNum;
        this.players[this.currPlayer].hotel.roomAreaClosedNum = this.turnBkup.roomAreaClosedNum;
        this.players[this.currPlayer].hotel.roomRedClosedNum = this.turnBkup.roomRedClosedNum;
        this.players[this.currPlayer].hotel.roomYellowClosedNum = this.turnBkup.roomYellowClosedNum;
        this.players[this.currPlayer].hotel.roomBlueClosedNum = this.turnBkup.roomBlueClosedNum;
        this.players[this.currPlayer].hotel.roomRedPreparedNum = this.turnBkup.roomRedPreparedNum;
        this.players[this.currPlayer].hotel.roomYellowPreparedNum = this.turnBkup.roomYellowPreparedNum;
        this.players[this.currPlayer].hotel.roomBluePreparedNum = this.turnBkup.roomBluePreparedNum;
        this.players[this.currPlayer].hotel.roomHighLightFlag = this.players[this.currPlayer].firstGuestTurn;
        this.players[this.currPlayer].hotel.numGuestOnTable = this.turnBkup.numGuestOnTable;
        this.players[this.currPlayer].hotel.guestOnTable = this.turnBkup.guestOnTable.slice();
        this.players[this.currPlayer].hotel.firstThreeRoom = this.players[this.currPlayer].firstGuestTurn;
        this.players[this.currPlayer].hotel.roomToPrepare = 0;
        this.players[this.currPlayer].hotel.roomToPrepareDiscount = [];
        this.players[this.currPlayer].hotel.roomToLose = 0;
        this.players[this.currPlayer].hotel.roomToLoseType = [];
        this.players[this.currPlayer].hotel.roomToClose = 0;
        this.players[this.currPlayer].hotel.roomToCloseColor = 0;
        this.players[this.currPlayer].hotel.roomCloseBonus = false;
        this.players[this.currPlayer].hotel.maxClosedRoomLevel = this.turnBkup.maxClosedRoomLevel;
        this.players[this.currPlayer].hotel.maxPreparedRoomLevel = this.turnBkup.maxPreparedRoomLevel;
        this.players[this.currPlayer].hotel.atSelectSatisfiedGuest = false;
        this.players[this.currPlayer].hotel.atSelectUnSatisfiedGuest = false;
        if(this.players[this.currPlayer].firstGuestTurn) {
            this.players[this.currPlayer].hotel.highlightRoomToPrepare(this.players[this.currPlayer].money);
            this.players[this.currPlayer].hotel.highlightRoomToPrepare(this.players[this.currPlayer].money);
            this.players[this.currPlayer].hotel.highlightRoomToPrepare(this.players[this.currPlayer].money);
        }
        // guest info
        if(this.players[this.currPlayer].hotel.guestOnTable[0] != null){
            this.players[this.currPlayer].hotel.guestOnTable[0].guestSatisfied = this.turnBkup.guestSatisfied0;
            this.players[this.currPlayer].hotel.guestOnTable[0].guestFoodServed = this.turnBkup.guestFoodServed0.slice();
            this.players[this.currPlayer].hotel.guestOnTable[0].guestFoodServedNum = this.turnBkup.guestFoodServedNum0;
        }
        if(this.players[this.currPlayer].hotel.guestOnTable[1] != null){
            this.players[this.currPlayer].hotel.guestOnTable[1].guestSatisfied = this.turnBkup.guestSatisfied1;
            this.players[this.currPlayer].hotel.guestOnTable[1].guestFoodServed = this.turnBkup.guestFoodServed1.slice();
            this.players[this.currPlayer].hotel.guestOnTable[1].guestFoodServedNum = this.turnBkup.guestFoodServedNum1;
        }
        if(this.players[this.currPlayer].hotel.guestOnTable[2] != null){
            this.players[this.currPlayer].hotel.guestOnTable[2].guestSatisfied = this.turnBkup.guestSatisfied2;
            this.players[this.currPlayer].hotel.guestOnTable[2].guestFoodServed = this.turnBkup.guestFoodServed2.slice();
            this.players[this.currPlayer].hotel.guestOnTable[2].guestFoodServedNum = this.turnBkup.guestFoodServedNum2;
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

    findNextPlayer() {
        for(let i=0; i<this.playerNumber; i++){
            if(this.players[i].miniTurn[0]==(this.miniRound+1) || this.players[i].miniTurn[1]==(this.miniRound+1)){
                return i;
            }
        }
    }

    clearPlayerRound() {
        this.players[this.currPlayer].moveAllBufToKitchen();
        this.players[this.currPlayer].firstGuestTurn = false;
        this.players[this.currPlayer].atInvite = false;
        this.players[this.currPlayer].atAction = false;
        this.players[this.currPlayer].atServe = false;
        this.players[this.currPlayer].atCheckout = false;
        this.players[this.currPlayer].atTakeBrownWhite = false;
        this.players[this.currPlayer].atTakeRedBlack = false;
        this.players[this.currPlayer].atPrepareRoom = false;
        this.players[this.currPlayer].atRoyalMoney = false;
        this.players[this.currPlayer].atHireServer = false;
        this.players[this.currPlayer].atTakeMirror = false;
        this.players[this.currPlayer].atSelectFood = 0;
        this.players[this.currPlayer].atTakeBrown = 0;
        this.players[this.currPlayer].atTakeWhite = 0;
        this.players[this.currPlayer].atTakeRed = 0;
        this.players[this.currPlayer].atTakeBlack = 0;
        this.players[this.currPlayer].atRoomToPrepare = 0;
        this.players[this.currPlayer].atRoyal = 0;
        this.players[this.currPlayer].atMoney = 0;
        this.players[this.currPlayer].atHireServerdiscount = [];
        this.players[this.currPlayer].atMirrorDice = 1;
        this.players[this.currPlayer].atMirrorStrength = 0;
        this.players[this.currPlayer].atActionBoost = false;
        this.players[this.currPlayer].freeInviteNum = 0;
        this.players[this.currPlayer].inviteFlag = false;
        this.players[this.currPlayer].actionFlag = false;
        this.players[this.currPlayer].hireNum = 0;
        this.players[this.currPlayer].hireLimitLastThree = false;
        this.players[this.currPlayer].royalPunishSelection = 0;
        this.players[this.currPlayer].loseServerNum = 0;
        this.players[this.currPlayer].loseHiredNum = 0;
        this.players[this.currPlayer].serveFoodNum = 0;
        this.players[this.currPlayer].specialRound = false;
        this.players[this.currPlayer].serverOnHandHighLightFlag = false;
        this.players[this.currPlayer].serverHiredHighLightFlag = false;
        this.players[this.currPlayer].hotel.roomHighLightFlag = false;
        this.players[this.currPlayer].hotel.roomToPrepare = 0;
        this.players[this.currPlayer].hotel.roomToPrepareDiscount = [];
        this.players[this.currPlayer].hotel.roomToLose = 0;
        this.players[this.currPlayer].hotel.roomToLoseType = [];
        this.players[this.currPlayer].hotel.roomToClose = 0;
        this.players[this.currPlayer].hotel.atSelectSatisfiedGuest = false;
        this.players[this.currPlayer].hotel.atSelectUnSatisfiedGuest = false;
    }

    nextMiniRound() {
        // First guest invitation is special
        if(this.players[this.currPlayer].firstGuestTurn){
            this.clearPlayerRound();
            if(this.currPlayer == this.playerNumber-1){ // all players complete preparation
                this.currPlayer = 0;
                this.rollDice();
                this.log.push("所有玩家已完成准备，开启正式游戏");
                this.bkupMiniTurn();
            } else {
                this.log.push(this.playerName[this.currPlayer] + "已完成准备，下一位");
                this.currPlayer++;
                this.bkupMiniTurn();
            }
        } else if(this.miniRound == (2*this.playerNumber-1) || this.royalRound) { // end of main round, check royal round first
            this.log.push("大回合" + this.mainRound + "已结束");
            if(!this.royalRound){ // start of royal round, reset curr player first
                this.clearPlayerRound();
                this.currPlayer = 0;
            } else {
                this.clearPlayerRound();
                this.currPlayer++;
            }
            this.royalRound = true;
            // disable all operation other than ending
            if(this.mainRound==2 || this.mainRound==4 || this.mainRound==6) { // check if any players need pause
                var taskDescription;
                switch(this.mainRound){
                    case 2: taskDescription = royalTaskDescription[0][this.royalTask0]; break;
                    case 4: taskDescription = royalTaskDescription[1][this.royalTask1]; break;
                    case 6: taskDescription = royalTaskDescription[2][this.royalTask2]; break;
                }
                this.log.push("进入皇室结算回合，本轮任务" + taskDescription);
                var pauseFlag = false;
                for(let i=this.currPlayer; i<this.playerNumber; i++){
                    pauseFlag = this.royalResult();
                    if(pauseFlag) {
                        this.log.push("等待玩家" + this.playerName[this.currPlayer] + "进行皇室选择");
                        this.bkupMiniTurn();
                        return; // pause and assert alert canvas
                    }
                    this.currPlayer++;
                }
            }

            if(this.mainRound == 6) { // end of entire game
                this.currPlayer = 0;
                this.log.push("计算终局分数");
                this.gameEnd();
                this.updateAllCanvas();
                this.log.push("游戏结束!" + this.players[this.winner].playerName + "获胜!");
                window.alert("游戏结束!" + this.players[this.winner].playerName + "获胜!");
                return;
            } else { // go to next main round
                this.royalRound = false;
                // roll the mini round sequence
                const tmp = this.players[this.playerNumber-1].miniTurn;
                for(let i=this.playerNumber-1; i>0; i--){
                    this.players[i].miniTurn = this.players[i-1].miniTurn;
                }
                this.players[0].miniTurn = tmp;
                this.mainRound++;
                this.miniRound = 0;
                this.log.push("进入大回合" + this.mainRound);
                this.currPlayer = this.findNextPlayer();
                for(let i=0; i<this.playerNumber; i++){
                    this.players[i].diceTaken = [-1, -1];
                }
                this.rollDice();
                // take a food for every per-turn server
                if(this.players[this.currPlayer].hasHiredServer(0)){
                    this.log.push(this.playerName[this.currPlayer] + "获得每回合一个免费的棕色饼干");
                    this.players[this.currPlayer].gainBrown(1);
                }
                if(this.players[this.currPlayer].hasHiredServer(1)){
                    this.log.push(this.playerName[this.currPlayer] + "获得每回合一个免费的白色蛋糕");
                    this.players[this.currPlayer].gainWhite(1);
                }
                if(this.players[this.currPlayer].hasHiredServer(2)){
                    this.log.push(this.playerName[this.currPlayer] + "获得每回合一个免费的红酒");
                    this.players[this.currPlayer].gainRed(1);
                }
                if(this.players[this.currPlayer].hasHiredServer(3)){
                    this.log.push(this.playerName[this.currPlayer] + "获得每回合一个免费的黑咖啡");
                    this.players[this.currPlayer].gainBlack(1);
                }
                this.bkupMiniTurn();
            }
        } else { // normal mini round
            if(this.players[this.currPlayer].specialRoundFlag){ // special round from guest
                this.clearPlayerRound();
                this.log.push(this.playerName[this.currPlayer] + "获得特殊回合，行动不消耗骰子数");
                this.players[this.currPlayer].specialRoundFlag = false;
                this.players[this.currPlayer].specialRound = true;
                this.bkupMiniTurn();
                return;
            }
            // next mini round
            this.clearPlayerRound();
            this.miniRound++;
            this.currPlayer = this.findNextPlayer();
            this.log.push("下一小回合" + this.miniRound + "，玩家为" + this.playerName[this.currPlayer]);
            // take a food for every per-turn server
            if(this.players[this.currPlayer].hasHiredServer(0)){
                this.log.push(this.playerName[this.currPlayer] + "获得每回合一个免费的棕色饼干");
                this.players[this.currPlayer].gainBrown(1);
            }
            if(this.players[this.currPlayer].hasHiredServer(1)){
                this.log.push(this.playerName[this.currPlayer] + "获得每回合一个免费的白色蛋糕");
                this.players[this.currPlayer].gainWhite(1);
            }
            if(this.players[this.currPlayer].hasHiredServer(2)){
                this.log.push(this.playerName[this.currPlayer] + "获得每回合一个免费的红酒");
                this.players[this.currPlayer].gainRed(1);
            }
            if(this.players[this.currPlayer].hasHiredServer(3)){
                this.log.push(this.playerName[this.currPlayer] + "获得每回合一个免费的黑咖啡");
                this.players[this.currPlayer].gainBlack(1);
            }
            this.bkupMiniTurn();
        }
    }

    assertAlert(index) {
        alertCanvas.style.display = 'block'; 
        this.alertType = 7; 
        this.players[index].royalResultPending = true; 
        this.players[index].royalResultFinish = false;
    }

    royalResult() { // handle royal tasks
        // some reward and punishment need selection
        // set flag to show alert canvas when needed, and return it
        const i = this.currPlayer;
        switch(this.mainRound){ // reduce royal first
            case 2: this.players[i].loseRoyal(3); break;
            case 4: this.players[i].loseRoyal(5); break;
            case 6: this.players[i].loseRoyal(7); break;
        }
        if(this.players[i].royalPoint < 1) { // punishment
            this.players[i].royalResult = 0;
            this.log.push(this.playerName[this.currPlayer] + "皇室点数为" + this.players[i].royalPoint + "，进行惩罚");
            // with server 25, always need to check
            if(this.players[i].hasHiredServer(25)){ // 可支付1块钱替代皇家任务惩罚
                this.assertAlert(i);
                return true;
            }
            switch(this.mainRound){
                case 2: 
                    switch(this.royalTask0){
                        case 0: this.assertAlert(i);
                        this.log.push(this.playerName[this.currPlayer] + "失去3块钱或5游戏点数");
                        return true; // 获得3块钱/失去3块钱或5游戏点数
                        case 1: this.players[i].clearKitchen(); 
                        this.log.push(this.playerName[this.currPlayer] + "失去厨房全部食物");
                        return false; // 获得2份任意食物/失去厨房全部食物
                        case 2: this.assertAlert(i);
                        this.log.push(this.playerName[this.currPlayer] + "丢弃2张员工手牌或失去5游戏点数");
                        return true; // 抽3员工打1减3费返还剩余/丢弃2张员工手牌或失去5游戏点数
                        case 3: this.assertAlert(i);
                        this.log.push(this.playerName[this.currPlayer] + "失去最高的准备好的房间或失去5游戏点数");
                        return true; // 免费准备1个房间/失去最高的准备好的房间或失去5游戏点数
                    }
                    break;
                case 4:
                    switch(this.royalTask1){
                        case 0: this.players[i].clearGuestTable(); this.players[i].clearKitchen(); 
                        this.log.push(this.playerName[this.currPlayer] + "失去厨房和客桌上的全部食物");
                        return false; // 获得4种食物各1份/失去厨房和客桌上的全部食物
                        case 1: this.assertAlert(i);
                        this.log.push(this.playerName[this.currPlayer] + "失去5块钱或失去7游戏点数");
                        return true; // 获得5块钱/失去5块钱或失去7游戏点数
                        case 2: this.assertAlert(i);
                        this.log.push(this.playerName[this.currPlayer] + "丢弃3张员工手牌或失去7游戏点数");
                        return true; // 抽3员工打1免费返还剩余/丢弃3张员工手牌或失去7游戏点数
                        case 3: this.assertAlert(i);
                        this.log.push(this.playerName[this.currPlayer] + "失去最高的已入住的2个房间或失去7游戏点数");
                        return true; // 2层以内免费准备1个房间并入住/失去最高的已入住的2个房间或失去7游戏点数
                    }
                    break;
                case 6:
                    switch(this.royalTask2){
                        case 0: this.players[i].loseGamePoint(8);
                        this.log.push(this.playerName[this.currPlayer] + "失去8游戏点数");
                        return false; // 获得8游戏点数/失去8游戏点数
                        case 1: this.players[i].hotel.highlightRoomToLose(true, false, false); this.players[i].hotel.highlightRoomToLose(true, false, false);
                        this.log.push(this.playerName[this.currPlayer] + "失去最高层和次高层各1个已入住房间");
                        return true; // 免费准备1个房间并入住/失去最高层和次高层各1个已入住房间
                        case 2: this.players[i].loseGamePoint(2*this.players[i].numServerHired);
                        this.log.push(this.playerName[this.currPlayer] + "每个已雇佣员工失去2游戏点数");
                        return false; // 每个已雇佣员工获得2游戏点数/每个已雇佣员工失去2游戏点数
                        case 3: this.assertAlert(i);
                        this.log.push(this.playerName[this.currPlayer] + "失去1位已雇佣员工（终局结算优先）或失去10游戏点数");
                        return true; // 免费雇佣1位手牌上的员工/失去1位已雇佣员工（终局结算优先）或失去10游戏点数
                    }
                    break;
            }
        } else if(this.players[i].royalPoint > 2) { // reward
            this.players[i].royalResult = 1;
            this.log.push(this.playerName[this.currPlayer] + "皇室点数为" + this.players[i].royalPoint + "，进行奖励");
            if(this.players[i].hasHiredServer(41)){ //在获得皇室任务奖励时可以获得5游戏点数
                this.players[i].gainGamePoint(5);
                this.log.push(this.playerName[this.currPlayer] + "的员工效果，获得额外5个游戏点数");
            }
            switch(this.mainRound){
                case 2: 
                    switch(this.royalTask0){
                        case 0: // 获得3块钱/失去3块钱或5游戏点数 
                        this.log.push(this.playerName[this.currPlayer] + "获得3块钱");
                        this.players[i].gainMoney(3); return false; 
                        case 1: // 获得2份任意食物/失去厨房全部食物
                        this.log.push(this.playerName[this.currPlayer] + "获得2份任意食物");
                        alertCanvas.style.display = 'block';
                        this.players[i].atSelectFood = 2;
                        this.players[i].atTakeBrown = 2; // default to brown
                        this.players[i].atTakeWhite = 0;
                        this.players[i].atTakeRed = 0;
                        this.players[i].atTakeBlack = 0;
                        this.players[i].royalResultFinish = true; // no need to do anything
                        this.alertType = 6;
                        return true;
                        case 2: // 抽3员工打1减3费返还剩余/丢弃2张员工手牌或失去5游戏点数
                        this.log.push(this.playerName[this.currPlayer] + "抽3员工打1减3费返还剩余");
                        this.players[i].highlightServerToHire(3, true); 
                        this.players[i].royalResultFinish = false; 
                        this.players[i].royalResultPending = true; 
                        return true; 
                        case 3: // 免费准备1个房间/失去最高的准备好的房间或失去5游戏点数
                        this.log.push(this.playerName[this.currPlayer] + "免费准备1个房间");
                        this.players[i].hotel.highlightRoomToPrepare(this.players[i].money, 5); this.players[i].royalResultFinish = false; return true; 
                    }
                    break;
                case 4:
                    switch(this.royalTask1){
                        case 0: this.players[i].gainBrown(1); this.players[i].gainWhite(1); this.players[i].gainRed(1); this.players[i].gainBlack(1);
                        this.log.push(this.playerName[this.currPlayer] + "获得4种食物各1份");
                        return false; // 获得4种食物各1份/失去厨房和客桌上的全部食物
                        case 1: this.players[i].gainMoney(5);
                        this.log.push(this.playerName[this.currPlayer] + "获得5块钱");
                        return false; // 获得5块钱/失去5块钱或失去7游戏点数
                        case 2: 
                        this.players[i].highlightServerToHire(10, true); 
                        this.players[i].royalResultFinish = false;
                        this.players[i].royalResultPending = true; 
                        this.log.push(this.playerName[this.currPlayer] + "抽3员工打1免费返还剩余");
                        return true; // 抽3员工打1免费返还剩余/丢弃3张员工手牌或失去7游戏点数
                        case 3: this.players[i].hotel.highlightRoomToPrepare(this.players[i].money, 5, 1, false, true); this.players[i].royalResultPending = true; this.players[i].royalResultFinish = true;
                        this.log.push(this.playerName[this.currPlayer] + "2层以内免费准备1个房间并入住");
                        return true; // 2层以内免费准备1个房间并入住/失去最高的准备好的2个房间或失去7游戏点数
                    }
                    break;
                case 6:
                    switch(this.royalTask2){
                        case 0: this.players[i].gainGamePoint(8);
                        this.log.push(this.playerName[this.currPlayer] + "获得8游戏点数");
                        return false; // 获得8游戏点数/失去8游戏点数
                        case 1: this.players[i].hotel.highlightRoomToPrepare(this.players[i].money, 5, 3, false, true); this.players[i].royalResultPending = true;  this.players[i].royalResultFinish = true;
                        this.log.push(this.playerName[this.currPlayer] + "免费准备1个房间并入住");
                        return true; // 免费准备1个房间并入住/失去最高层和次高层各1个已入住房间
                        case 2: this.players[i].gainGamePoint(2*this.players[i].numServerHired);
                        this.log.push(this.playerName[this.currPlayer] + "每个已雇佣员工获得2游戏点数");
                        return false; // 每个已雇佣员工获得2游戏点数/每个已雇佣员工失去2游戏点数
                        case 3: this.players[i].highlightServerToHire(10); this.players[i].royalResultPending = true; this.players[i].royalResultFinish = false;
                        this.log.push(this.playerName[this.currPlayer] + "免费雇佣1位手牌上的员工");
                        return true; // 免费雇佣1位手牌上的员工/失去1位已雇佣员工（终局结算优先）或失去10游戏点数
                    }
                    break;
            }
        }
        // no reward or punishment
        this.players[i].royalResult = 2;
        return false;
    }

    gameEnd() {
        // find the winner
        var highestPoint = -1;
        this.gameOver = true;
        for(let i=0; i<this.playerNumber; i++){
            this.players[i].gainGamePoint( this.players[i].calculateFinalGamePoint(true) );
            if(this.players[i].gamePoint >= highestPoint) {
                highestPoint = this.players[i].gamePoint;
                this.winner = i;
            }
        }
    }

    diceServerBonus(value) {
        var serverBonus = 0;
        if(this.players[this.currPlayer].hasHiredServer(11) && (value==2 || value==3)) {//使用色子3或4时获得2游戏点数
            this.log.push(this.playerName[this.currPlayer] + "的员工效果，获得2个游戏点数");
            this.players[this.currPlayer].gainGamePoint(2);
        }
        if(this.players[this.currPlayer].hasHiredServer(12) && (value==0 || value==1)) {//使用色子1或2时加1强度
            this.log.push(this.playerName[this.currPlayer] + "的员工效果，强度加一");
            serverBonus = 1;
        }
        if(this.players[this.currPlayer].hasHiredServer(13) && (value==0 || value==1)) {//使用色子1或2时可以准备一个房间
            this.log.push(this.playerName[this.currPlayer] + "的员工效果，可以原价准备一个房间");
            this.players[this.currPlayer].hotel.highlightRoomToPrepare(this.players[this.currPlayer].money, 0);
        }
        if(this.players[this.currPlayer].hasHiredServer(15) && value==3) {//使用色子4时可以获得4游戏点数
            this.log.push(this.playerName[this.currPlayer] + "的员工效果，获得4个游戏点数");
            this.players[this.currPlayer].gainGamePoint(4);
        }
        if(this.players[this.currPlayer].hasHiredServer(17) && value==4) {//使用色子5时加2强度
            this.log.push(this.playerName[this.currPlayer] + "的员工效果，强度加二");
            serverBonus = 2;
        }
        if(this.players[this.currPlayer].hasHiredServer(18) && value==2) {//使用色子3时获得5游戏点数
            this.log.push(this.playerName[this.currPlayer] + "的员工效果，获得5个游戏点数");
            this.players[this.currPlayer].gainGamePoint(5);
        }
        if(this.players[this.currPlayer].hasHiredServer(19) && value==4) {//使用色子5时获得2皇家点数
            this.log.push(this.playerName[this.currPlayer] + "的员工效果，获得2个皇室点数");
            this.players[this.currPlayer].gainRoyal(2);
        }
        if(this.players[this.currPlayer].hasHiredServer(21) && value==2) {//使用色子3时可以雇佣一位员工
            this.log.push(this.playerName[this.currPlayer] + "的员工效果，可以原价雇佣一位员工");
            this.players[this.currPlayer].highlightServerToHire(0);
        }
        if(this.players[this.currPlayer].hasHiredServer(16) && value==5) {//使用色子6时无需支付费用并且强度加1
            this.log.push(this.playerName[this.currPlayer] + "的员工效果，免费使用骰子6并强度加一");
            serverBonus = 1;
        }
        return serverBonus;
    }

    takeDice(value) {
        // take the dice to show on mini round board
        if(this.miniRound < this.playerNumber) {
            this.players[this.currPlayer].diceTaken[0] = value+1;
        } else {
            this.players[this.currPlayer].diceTaken[1] = value+1;
        }
        // check server bonus if any
        var serverBonus = this.diceServerBonus(value);
        
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
                this.log.push(this.playerName[this.currPlayer] + "的员工效果，免费使用骰子6并强度加一");
                this.players[this.currPlayer].money--; // dice 6 fee exception
            }
            this.players[this.currPlayer].actionTakeMirror(this.actionPoint[5] + serverBonus);
            break;
        }
        if(!this.players[this.currPlayer].specialRound){ // in special bonus round, no dice is taken
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
        // single-player mode
        // this.actionPoint = [0, 0, 0, 0, 0, 0];
        // for(let i=0; i<this.diceNumber; i++){
        //     this.actionPoint[Math.floor(Math.random() * 6)]++;
        // }
        // multi-player mode, only ID 0 to send request
        if(this.ourPlayer == 0){
            var msg = {
                type: "rollDiceReq",
                roomID: roomID
            };
            socket.send(JSON.stringify(msg));
        }
    }

    checkoutServerBonus(guestTableID) {
        if(guestTableID == -1){ // invalid guest ID
            return;
        }
        if(this.players[this.currPlayer].hasHiredServer(4)) { //满足红色客人时获得2块钱
            if(this.players[this.currPlayer].hotel.guestOnTable[guestTableID].guestColor==0){
                this.log.push(this.playerName[this.currPlayer] + "的员工效果，满足红色客人时获得2块钱");
                this.players[this.currPlayer].gainMoney(2);
            }
        }
        if(this.players[this.currPlayer].hasHiredServer(5)) { //满足蓝色客人时获得1皇家点数
            if(this.players[this.currPlayer].hotel.guestOnTable[guestTableID].guestColor==2){
                this.log.push(this.playerName[this.currPlayer] + "的员工效果，满足蓝色客人时获得1皇家点数");
                this.players[this.currPlayer].gainRoyal(1);
            }
        }
        if(this.players[this.currPlayer].hasHiredServer(6)) { //满足黄色客人时获得1块钱
            if(this.players[this.currPlayer].hotel.guestOnTable[guestTableID].guestColor==1){
                this.log.push(this.playerName[this.currPlayer] + "的员工效果，满足黄色客人时获得1块钱");
                this.players[this.currPlayer].gainMoney(1);
            }
        }
        if(this.players[this.currPlayer].hasHiredServer(7)) { //满足绿色客人时获得2游戏点数
            if(this.players[this.currPlayer].hotel.guestOnTable[guestTableID].guestColor===4){
                this.log.push(this.playerName[this.currPlayer] + "的员工效果，满足绿色客人时获得2游戏点数");
                this.players[this.currPlayer].gainGamePoint(2);
            }
        }
        if(this.players[this.currPlayer].hasHiredServer(22)) { //满足客人并入住时可以获得1块钱
            this.log.push(this.playerName[this.currPlayer] + "的员工效果，满足客人并入住时可以获得1块钱");
            this.players[this.currPlayer].gainMoney(1);
        }
        if(this.players[this.currPlayer].hasHiredServer(32)) { //满足食物或饮料需求量为4的客人时获得4游戏点数
            if(this.players[this.currPlayer].hotel.guestOnTable[guestTableID].guestRequirementNum==4){
                this.log.push(this.playerName[this.currPlayer] + "的员工效果，满足食物或饮料需求量为4的客人时获得4游戏点数");
                this.players[this.currPlayer].gainGamePoint(4);
            }
        }
    }

    // ========================================canvas==============================================
    updateAllCanvas(){
        this.updateGuestCanvas(guestContext);
        this.updateActionCanvas(actionContext);
        this.updateLogCanvas(logContext);
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
        const majorTaskWidth   = 160;
        const majorTaskHeight  = 240;
        switch(this.majorTask0) {
            case 0: // major task A0
            // context.drawImage(majorTaskA0Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            context.drawImage(tokenImg, majorTaskA0ImgX, majorTaskA0ImgY, majorTaskWidth, majorTaskHeight, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 1: // major task A1
            // context.drawImage(majorTaskA1Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            context.drawImage(tokenImg, majorTaskA1ImgX, majorTaskA1ImgY, majorTaskWidth, majorTaskHeight, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 2: // major task A2
            // context.drawImage(majorTaskA2Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            context.drawImage(tokenImg, majorTaskA2ImgX, majorTaskA2ImgY, majorTaskWidth, majorTaskHeight, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 3: // major task A3
            // context.drawImage(majorTaskA3Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            context.drawImage(tokenImg, majorTaskA3ImgX, majorTaskA3ImgY, majorTaskWidth, majorTaskHeight, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
        }
        majorTaskXoffset += 160;
        switch(this.majorTask1) {
            case 0: // major task B0
            // context.drawImage(majorTaskB0Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            context.drawImage(tokenImg, majorTaskB0ImgX, majorTaskB0ImgY, majorTaskWidth, majorTaskHeight, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 1: // major task B1
            // context.drawImage(majorTaskB1Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            context.drawImage(tokenImg, majorTaskB1ImgX, majorTaskB1ImgY, majorTaskWidth, majorTaskHeight, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 2: // major task B2
            // context.drawImage(majorTaskB2Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            context.drawImage(tokenImg, majorTaskB2ImgX, majorTaskB2ImgY, majorTaskWidth, majorTaskHeight, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 3: // major task B3
            // context.drawImage(majorTaskB3Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            context.drawImage(tokenImg, majorTaskB3ImgX, majorTaskB3ImgY, majorTaskWidth, majorTaskHeight, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
        }
        majorTaskXoffset += 160;
        switch(this.majorTask2) {
            case 0: // major task C0
            // context.drawImage(majorTaskC0Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            context.drawImage(tokenImg, majorTaskC0ImgX, majorTaskC0ImgY, majorTaskWidth, majorTaskHeight, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 1: // major task C1
            // context.drawImage(majorTaskC1Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            context.drawImage(tokenImg, majorTaskC1ImgX, majorTaskC1ImgY, majorTaskWidth, majorTaskHeight, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 2: // major task C2
            // context.drawImage(majorTaskC2Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            context.drawImage(tokenImg, majorTaskC2ImgX, majorTaskC2ImgY, majorTaskWidth, majorTaskHeight, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
            case 3: // major task C3
            // context.drawImage(majorTaskC3Img, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            context.drawImage(tokenImg, majorTaskC3ImgX, majorTaskC3ImgY, majorTaskWidth, majorTaskHeight, majorTaskXoffset, majorTaskYoffset, majorTaskWidth, majorTaskHeight);
            break;
        }
        // draw major task completion marker
        var   markerXoffset = 50;
        var   markerYoffset = 200;
        const markerRadius = 10;
        var markerColor;
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if(this.majorTaskComp[i][j]!=-1){
                    switch(this.majorTaskComp[i][j]){
                        case 0: markerColor = "blue";   break;
                        case 1: markerColor = "red";    break;
                        case 2: markerColor = "yellow"; break;
                        case 3: markerColor = "grey";   break;
                    }
                    context.fillStyle = markerColor;
                    context.beginPath();
                    context.arc(markerXoffset, markerYoffset, markerRadius, 0, 2 * Math.PI);
                    context.fill();
                }
                markerXoffset+=53;
            }
        }
        // draw royal tasks
        var   royalTaskXoffset = 620;
        var   royalTaskYoffset = 115;
        const royalTaskWidth   = 80;
        const royalTaskHeight  = 120;
        switch(this.royalTask0) {
            case 0: // royal task A0
            // context.drawImage(royalTaskA0Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            context.drawImage(tokenImg, royalTaskA0ImgX, royalTaskA0ImgY, royalTaskWidth, royalTaskHeight, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 1: // royal task A1
            // context.drawImage(royalTaskA1Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            context.drawImage(tokenImg, royalTaskA1ImgX, royalTaskA1ImgY, royalTaskWidth, royalTaskHeight, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 2: // royal task A2
            // context.drawImage(royalTaskA2Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            context.drawImage(tokenImg, royalTaskA2ImgX, royalTaskA2ImgY, royalTaskWidth, royalTaskHeight, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 3: // royal task A3
            // context.drawImage(royalTaskA3Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            context.drawImage(tokenImg, royalTaskA3ImgX, royalTaskA3ImgY, royalTaskWidth, royalTaskHeight, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
        }
        royalTaskXoffset += 120;
        switch(this.royalTask1) {
            case 0: // royal task B0
            // context.drawImage(royalTaskB0Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            context.drawImage(tokenImg, royalTaskB0ImgX, royalTaskB0ImgY, royalTaskWidth, royalTaskHeight, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 1: // royal task B1
            // context.drawImage(royalTaskB1Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            context.drawImage(tokenImg, royalTaskB1ImgX, royalTaskB1ImgY, royalTaskWidth, royalTaskHeight, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 2: // royal task B2
            // context.drawImage(royalTaskB2Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            context.drawImage(tokenImg, royalTaskB2ImgX, royalTaskB2ImgY, royalTaskWidth, royalTaskHeight, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 3: // royal task B3
            // context.drawImage(royalTaskB3Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            context.drawImage(tokenImg, royalTaskB3ImgX, royalTaskB3ImgY, royalTaskWidth, royalTaskHeight, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
        }
        royalTaskXoffset += 120;
        switch(this.royalTask2) {
            case 0: // royal task C0
            // context.drawImage(royalTaskC0Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            context.drawImage(tokenImg, royalTaskC0ImgX, royalTaskC0ImgY, royalTaskWidth, royalTaskHeight, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 1: // royal task C1
            // context.drawImage(royalTaskC1Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            context.drawImage(tokenImg, royalTaskC1ImgX, royalTaskC1ImgY, royalTaskWidth, royalTaskHeight, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 2: // royal task C2
            // context.drawImage(royalTaskC2Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            context.drawImage(tokenImg, royalTaskC2ImgX, royalTaskC2ImgY, royalTaskWidth, royalTaskHeight, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
            case 3: // royal task C3
            // context.drawImage(royalTaskC3Img, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            context.drawImage(tokenImg, royalTaskC3ImgX, royalTaskC3ImgY, royalTaskWidth, royalTaskHeight, royalTaskXoffset, royalTaskYoffset, royalTaskWidth, royalTaskHeight);
            break;
        }
        // draw royal point markers
        for(let i=0; i<this.playerNumber; i++){
            markerYoffset = 290 + i*5;
            if(this.players[i].royalPoint >=1 && this.players[i].royalPoint<3){
                markerXoffset = 110 + this.players[i].royalPoint*60;
            } else if(this.players[i].royalPoint >=3) {
                markerXoffset = 150 + this.players[i].royalPoint*52;
            } else {
                markerXoffset = 70;
            }
            switch(i){
                case 0: markerColor = "blue";   break;
                case 1: markerColor = "red";    break;
                case 2: markerColor = "yellow"; break;
                case 3: markerColor = "grey";   break;
            }
            context.fillStyle = markerColor;
            context.beginPath();
            context.arc(markerXoffset, markerYoffset, markerRadius, 0, 2 * Math.PI);
            context.fill();
        }
        // draw main round token
        context.globalAlpha = 0.5;
        context.fillStyle = 'rgb(42,255,0)';
        context.fillRect(512+60*this.mainRound, 50, 56, 56);
        context.globalAlpha = 1;
        // draw guests in queue
        var   guestXoffset = 36;
        var   guestYoffset = 350;
        const guestWidth   = 160;
        const guestHeight  = 240;
        for(let i=0; i<this.guestInQueue.length; i++){
            // context.drawImage(guestImg[this.guestInQueue[i]], guestXoffset, guestYoffset, guestWidth, guestHeight);
            context.drawImage(guestAllImg, guestWidth*(this.guestInQueue[i]%10), guestHeight*(Math.floor(this.guestInQueue[i]/10)), guestWidth, guestHeight, guestXoffset, guestYoffset, guestWidth, guestHeight);
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
        // context.drawImage(actionBoardImg, 0, 0);
        context.drawImage(tokenImg, actionBoardImgX, actionBoardImgY, 960, 160, 0, 0, 960, 160);
        // draw the action dice number
        var   numberXoffset = 75;
        var   numberYoffset = 25;
        context.font="30px verdana";
        for(let i=0; i<6; i++){
            context.shadowColor="white";
            context.shadowBlur=5;
            context.lineWidth=2;
            context.strokeStyle = "white";
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

    textCanvas(context, string, offsetX, offsetY, font) {
        if (font === undefined || font === null){
            context.font="20px verdana";
        } else {
            context.font=font;
        }
        context.shadowColor="white";
        context.shadowBlur=2;
        context.lineWidth=2;
        context.strokeStyle = "white";
        context.strokeText(string, offsetX, offsetY);
        context.shadowBlur=0;
        context.fillStyle="black";
        context.fillText(string, offsetX, offsetY);
    }

    updateLogCanvas(context) {
        // clear canvas first
        context.clearRect(0, 0, 960, 400);
        var logXoffset = 20;
        var logYoffset = 20;
        // only print the last 9 logs
        var countPrint = 9;
        for(let i=this.log.length-1; i>=0; i--){
            this.textCanvas(context, this.log[i], logXoffset, logYoffset + countPrint*40);
            countPrint--;
            if(countPrint==0){
                break;
            }
        }
        // the miniturn restart button
        this.textCanvas(context, "重置本回合：", logXoffset+820, logYoffset);
        context.drawImage(restartImg, logXoffset+890, logYoffset, 50, 50);
    }
    // ========================================canvas==============================================

    
    // ========================================click handle==============================================
    handleRestart(event) {
        if(event.offsetX >= 910 && event.offsetX <= 960 && event.offsetY >= 20 && event.offsetY <= 70){
            console.log("restart clicked");
            this.restoreMiniTurn();
        }
        this.updateAllCanvas();
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
        if((!this.players[this.currPlayer].atInvite && this.players[this.currPlayer].freeInviteNum == 0) || this.players[this.currPlayer].hotel.numGuestOnTable>=3){
            console.log("current player is not inviting");
        } else {
            var guestSelected = -1;
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
                   !this.players[this.currPlayer].firstGuestTurn && 
                   this.players[this.currPlayer].freeInviteNum == 0){ // exceptions for invitation fee
                    this.players[this.currPlayer].money -= (guestSelected<3)?(3-guestSelected):0;
                }
                this.takeOneGuestFromQueue(guestSelected);
                if(this.players[this.currPlayer].freeInviteNum>0) { // free invitation not considered
                    this.players[this.currPlayer].freeInviteNum--;
                    // hotel full, end inviting immediately
                    if(this.players[this.currPlayer].hotel.numGuestOnTable==3){this.guestHighLightFlag = false;this.players[this.currPlayer].freeInviteNum=0;}
                    if(this.players[this.currPlayer].freeInviteNum==0){this.guestHighLightFlag = false;}
                } else if(this.players[this.currPlayer].atInvite) {
                    this.players[this.currPlayer].atInvite = false;
                    this.guestHighLightFlag = false;
                    this.players[this.currPlayer].inviteFlag = true;
                }
            }
        }
        this.updateAllCanvas();
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
                    if(i!=5 || this.players[this.currPlayer].money > 0 || this.players[this.currPlayer].hasHiredServer(16)){
                        this.takeDice(i);
                    } else {
                        continue;
                    }
                    this.actionHighLightFlag = false;
                    for(let i=0; i<6; i++){
                        this.actionHighLight[i] = 0;
                    }
                    this.players[this.currPlayer].atAction = false;
                    break;
                }
                blockXoffset += 159;
            }
        }
        this.updateAllCanvas();
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
                        this.players[this.currPlayer].hotel.roomToPrepare--;
                        this.players[this.currPlayer].hotel.roomToPrepareDiscount.pop();
                        if(this.players[this.currPlayer].hotel.roomToPrepare == 0){ // finished all three rooms
                            this.players[this.currPlayer].hotel.roomHighLightFlag = false;
                            this.players[this.currPlayer].hotel.firstThreeRoom = false;
                        }
                        this.players[this.currPlayer].hotel.highlightRoomToPrepare(10, 10, 3, true);
                    } else if(this.players[this.currPlayer].hotel.roomToPrepare>0 && this.players[this.currPlayer].hotel.roomHighLight[floor][col]){
                        console.log("prepare room at floor " + floor + " col " + col);
                        // prepare selected room, check money
                        if(this.players[this.currPlayer].royalResultPending) { // corner case is the royal task reward, directly close it if possible
                            if(this.players[this.currPlayer].hotel.roomStatus[floor][col]==-1) { // royal task B&C directly close room, A only prepare room
                                this.players[this.currPlayer].hotel.roomPrepare(floor, col);
                            }
                            if(this.mainRound > 2) { // royal task B&C
                                this.players[this.currPlayer].hotel.roomClose(floor, col);
                            }
                            this.players[this.currPlayer].royalResultPending = false;
                        } else {
                            this.players[this.currPlayer].hotel.roomPrepare(floor, col);
                        }
                        if(!((this.players[this.currPlayer].hasHiredServer(8) && this.players[this.currPlayer].hotel.roomColor[floor][col]==2) ||   //免费准备蓝色房间
                            (this.players[this.currPlayer].hasHiredServer(9) && this.players[this.currPlayer].hotel.roomColor[floor][col]==0) ||  //免费准备红色房间
                            (this.players[this.currPlayer].hasHiredServer(10) && this.players[this.currPlayer].hotel.roomColor[floor][col]==1))     //免费准备黄色房间
                        ){ // exceptions to pay preparation fee
                            this.log.push(this.playerName[this.currPlayer] + "的员工效果，免费准备该房间");
                            if(this.players[this.currPlayer].hotel.roomToPrepareDiscount.length > 0){
                                this.players[this.currPlayer].loseMoney( Math.max(floor-this.players[this.currPlayer].hotel.roomToPrepareDiscount.at(-1), 0) );
                            } else {
                                this.players[this.currPlayer].loseMoney(floor);
                            }
                        }
                        this.players[this.currPlayer].hotel.roomToPrepare--;
                        this.players[this.currPlayer].hotel.roomToPrepareDiscount.pop();
                        if(this.players[this.currPlayer].hotel.roomToPrepare == 0){ // finished rooms
                            this.players[this.currPlayer].royalResultFinish = true;
                            this.players[this.currPlayer].hotel.roomHighLightFlag = false;
                        } else {
                            this.players[this.currPlayer].hotel.highlightRoomToPrepare(this.players[this.currPlayer].money, this.players[this.currPlayer].hotel.roomToPrepareDiscount.at(-1),3,true);
                        }
                    } else if(this.players[this.currPlayer].hotel.roomToClose>0 && this.players[this.currPlayer].hotel.roomHighLight[floor][col]){
                        console.log("checkout room at floor " + floor + " col " + col);
                        // close selected room, take guest bonus if any
                        this.players[this.currPlayer].hotel.roomClose(floor, col);
                        if(!this.players[this.currPlayer].hotel.roomCloseBonus) {
                            this.checkoutServerBonus(this.players[this.currPlayer].hotel.roomToCloseGuestTableID);
                            // remove guest from table, needed before bonus
                            this.players[this.currPlayer].hotel.removeGuestFromTable(this.players[this.currPlayer].hotel.roomToCloseGuestTableID);
                            this.players[this.currPlayer].guestBonus(this.players[this.currPlayer].hotel.roomToCloseGuestID);
                        } else {
                            this.players[this.currPlayer].hotel.roomCloseBonus = false;
                        }
                        this.players[this.currPlayer].hotel.roomToClose--;
                        if(this.players[this.currPlayer].hotel.roomToClose == 0 && this.players[this.currPlayer].hotel.roomToPrepare == 0){ // sometimes guest bonus need to highlight rooms
                            this.players[this.currPlayer].hotel.roomHighLightFlag = false;
                        }
                    } else if(this.players[this.currPlayer].hotel.roomToLose>0 && this.players[this.currPlayer].hotel.roomHighLight[floor][col]){
                        console.log("lose room at floor " + floor + " col " + col);
                        this.players[this.currPlayer].hotel.roomLose(floor, col);
                        this.players[this.currPlayer].hotel.roomToLose--;
                        this.players[this.currPlayer].hotel.roomToLoseType.pop();
                        if(this.players[this.currPlayer].hotel.roomToLose == 0){
                            // lose room only happens at royal task punishment
                            this.players[this.currPlayer].royalResultFinish = true;
                            this.players[this.currPlayer].hotel.roomHighLightFlag = false;
                        } else {
                            // update room highlight if not finished
                            switch(this.players[this.currPlayer].hotel.roomToLoseType.at(-1)){
                                case 0: this.players[this.currPlayer].hotel.highlightRoomToLose(true, false, true, true); break;
                                case 1: this.players[this.currPlayer].hotel.highlightRoomToLose(false, true, true, true); break;
                                case 2: this.players[this.currPlayer].hotel.highlightRoomToLose(true, false, true, false); break;
                                case 3: this.players[this.currPlayer].hotel.highlightRoomToLose(false, true, true, false); break;
                            }
                        }
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
                    this.players[this.currPlayer].hotel.guestOnTable[i].guestSatisfied &&
                    this.players[this.currPlayer].hotel.hasPreparedRoom(this.players[this.currPlayer].hotel.guestOnTable[i].guestColor)){
                    console.log("satisfied guest " + i + " is clicked");
                    // start picking the room to close
                    this.players[this.currPlayer].hotel.atSelectSatisfiedGuest = false;
                    this.players[this.currPlayer].hotel.highlightRoomToCheckout(false, 1, 
                        this.players[this.currPlayer].hotel.guestOnTable[i].guestColor, 
                        this.players[this.currPlayer].hotel.guestOnTable[i].guestID, 
                        this.players[this.currPlayer].hotel.guestOnTable[i].guestTableID);
                } else if(this.players[this.currPlayer].hotel.atSelectUnSatisfiedGuest &&
                    !this.players[this.currPlayer].hotel.guestOnTable[i].guestSatisfied){
                    this.players[this.currPlayer].hotel.atSelectUnSatisfiedGuest = false;
                    this.players[this.currPlayer].hotel.satisfyGuest(i);
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
                        !this.players[this.currPlayer].hotel.guestOnTable[i].guestFoodServed[j]){
                        var serveKichenFlag = false;
                        var serveBufFlag = false;
                        switch(this.players[this.currPlayer].hotel.guestOnTable[i].guestRequirement[j]){
                            case 0: // need brown
                            serveKichenFlag = this.players[this.currPlayer].hasBrownKitchen() && this.players[this.currPlayer].serveFoodNum>0;
                            serveBufFlag = this.players[this.currPlayer].hasBrownBuf();
                            if(serveBufFlag){this.players[this.currPlayer].loseBrownBuf();}
                            else if(serveKichenFlag){this.players[this.currPlayer].loseBrownKitchen();}
                            break;
                            case 1: // need white
                            serveKichenFlag = this.players[this.currPlayer].hasWhiteKitchen() && this.players[this.currPlayer].serveFoodNum>0; 
                            serveBufFlag = this.players[this.currPlayer].hasWhiteBuf(); 
                            if(serveBufFlag){this.players[this.currPlayer].loseWhiteBuf();}
                            else if(serveKichenFlag){this.players[this.currPlayer].loseWhiteKitchen();}
                            break;
                            case 2: // need red
                            serveKichenFlag = this.players[this.currPlayer].hasRedKitchen() && this.players[this.currPlayer].serveFoodNum>0; 
                            serveBufFlag = this.players[this.currPlayer].hasRedBuf(); 
                            if(serveBufFlag){this.players[this.currPlayer].loseRedBuf();}
                            else if(serveKichenFlag){this.players[this.currPlayer].loseRedKitchen();}
                            break;
                            case 3: // need black
                            serveKichenFlag = this.players[this.currPlayer].hasBlackKitchen() && this.players[this.currPlayer].serveFoodNum>0; 
                            serveBufFlag = this.players[this.currPlayer].hasBlackBuf(); 
                            if(serveBufFlag){this.players[this.currPlayer].loseBlackBuf();}
                            else if(serveKichenFlag){this.players[this.currPlayer].loseBlackKitchen();}
                            break;
                        }
                        
                        if(serveKichenFlag){
                            console.log("served a food from kichen to guest " + this.players[this.currPlayer].hotel.guestOnTable[i].guestTableID);
                            this.players[this.currPlayer].serveFoodNum--;
                            if(this.players[this.currPlayer].serveFoodNum==0){
                                this.players[this.currPlayer].atServe = false;
                            }
                        } else if(serveBufFlag){
                            console.log("served a food from buffer to guest " + this.players[this.currPlayer].hotel.guestOnTable[i].guestTableID);
                        }
                        // update guest status
                        if(serveKichenFlag || serveBufFlag){
                            this.players[this.currPlayer].hotel.guestOnTable[i].guestFoodServed[j] = 1;
                            this.players[this.currPlayer].hotel.guestOnTable[i].guestFoodServedNum++;
                            this.players[this.currPlayer].hotel.guestOnTable[i].guestSatisfied = 
                                (this.players[this.currPlayer].hotel.guestOnTable[i].guestRequirementNum == 
                                this.players[this.currPlayer].hotel.guestOnTable[i].guestFoodServedNum);
                        }
                    }
                    foodYoffset += 28;
                }
            }           
            foodXoffset += 182;
            foodYoffset = 618;
        }
        this.updateAllCanvas();
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
                console.log("brown increase selected");
            } else if(event.offsetX>=175 && event.offsetX<=225 && event.offsetY>=45 && event.offsetY<=65){ // decrease brown
                if(this.players[this.currPlayer].atTakeBrown > 0){
                    this.players[this.currPlayer].atTakeBrown--;
                }
                this.alertType = 6;
                console.log("brown decrease selected");
            } else if(event.offsetX>=325 && event.offsetX<=375 && event.offsetY>=15 && event.offsetY<=35){ // increase white
                if( (this.players[this.currPlayer].atTakeBrown + this.players[this.currPlayer].atTakeWhite + 
                    this.players[this.currPlayer].atTakeRed + this.players[this.currPlayer].atTakeBlack) < this.players[this.currPlayer].atSelectFood){
                    this.players[this.currPlayer].atTakeWhite++;
                }
                console.log("brown increase selected");
            } else if(event.offsetX>=325 && event.offsetX<=375 && event.offsetY>=45 && event.offsetY<=65){ // decrease white
                if(this.players[this.currPlayer].atTakeWhite > 0){
                    this.players[this.currPlayer].atTakeWhite--;
                }
                console.log("brown decrease selected");
            } else if(event.offsetX>=175 && event.offsetX<=225 && event.offsetY>=90 && event.offsetY<=110){ // increase red
                if( (this.players[this.currPlayer].atTakeBrown + this.players[this.currPlayer].atTakeWhite + 
                    this.players[this.currPlayer].atTakeRed + this.players[this.currPlayer].atTakeBlack) < this.players[this.currPlayer].atSelectFood){
                    this.players[this.currPlayer].atTakeRed++;
                }
                console.log("brown increase selected");
            } else if(event.offsetX>=175 && event.offsetX<=225 && event.offsetY>=120 && event.offsetY<=140){ // decrease red
                if(this.players[this.currPlayer].atTakeRed > 0){
                    this.players[this.currPlayer].atTakeRed--;
                }
                console.log("brown decrease selected");
            } else if(event.offsetX>=325 && event.offsetX<=375 && event.offsetY>=90 && event.offsetY<=110){ // increase black
                if( (this.players[this.currPlayer].atTakeBrown + this.players[this.currPlayer].atTakeWhite + 
                    this.players[this.currPlayer].atTakeRed + this.players[this.currPlayer].atTakeBlack) < this.players[this.currPlayer].atSelectFood){
                    this.players[this.currPlayer].atTakeBlack++;
                }
                console.log("brown increase selected");
            } else if(event.offsetX>=325 && event.offsetX<=375 && event.offsetY>=120 && event.offsetY<=140){ // decrease black
                if(this.players[this.currPlayer].atTakeBlack > 0){
                    this.players[this.currPlayer].atTakeBlack--;
                }
                console.log("brown decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atSelectFood = 0;
                this.players[this.currPlayer].gainBrown(this.players[this.currPlayer].atTakeBrown);
                this.players[this.currPlayer].gainWhite(this.players[this.currPlayer].atTakeWhite);
                this.players[this.currPlayer].gainRed(this.players[this.currPlayer].atTakeRed);
                this.players[this.currPlayer].gainBlack(this.players[this.currPlayer].atTakeBlack);
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
                }
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase brown
                if(this.players[this.currPlayer].atTakeWhite > 0){
                    this.players[this.currPlayer].atTakeBrown++;
                    this.players[this.currPlayer].atTakeWhite--;
                }
                console.log("brown increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease brown
                if(this.players[this.currPlayer].atTakeBrown > 0 && this.players[this.currPlayer].atTakeBrown > this.players[this.currPlayer].atTakeWhite + 1){
                    this.players[this.currPlayer].atTakeBrown--;
                    this.players[this.currPlayer].atTakeWhite++;
                }
                console.log("brown decrease selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=90 && event.offsetY<=110){ // increase white
                if(this.players[this.currPlayer].atTakeBrown > 0 && this.players[this.currPlayer].atTakeBrown > this.players[this.currPlayer].atTakeWhite + 1){
                    this.players[this.currPlayer].atTakeBrown--;
                    this.players[this.currPlayer].atTakeWhite++;
                }
                console.log("white increase selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=120 && event.offsetY<=140){ // decrease white
                if(this.players[this.currPlayer].atTakeWhite > 0){
                    this.players[this.currPlayer].atTakeBrown++;
                    this.players[this.currPlayer].atTakeWhite--;
                }
                console.log("white decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atTakeBrownWhite = false;
                this.players[this.currPlayer].gainBrown(this.players[this.currPlayer].atTakeBrown);
                this.players[this.currPlayer].gainWhite(this.players[this.currPlayer].atTakeWhite);
                this.players[this.currPlayer].atAction = false;
                this.players[this.currPlayer].actionFlag = true;
                this.players[this.currPlayer].atActionBoost = false;
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
                }
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase red
                if(this.players[this.currPlayer].atTakeBlack > 0){
                    this.players[this.currPlayer].atTakeRed++;
                    this.players[this.currPlayer].atTakeBlack--;
                }
                console.log("red increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease red
                if(this.players[this.currPlayer].atTakeRed > 0 && this.players[this.currPlayer].atTakeRed > this.players[this.currPlayer].atTakeBlack + 1){
                    this.players[this.currPlayer].atTakeRed--;
                    this.players[this.currPlayer].atTakeBlack++;
                }
                console.log("red decrease selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=90 && event.offsetY<=110){ // increase black
                if(this.players[this.currPlayer].atTakeRed > 0 && this.players[this.currPlayer].atTakeRed > this.players[this.currPlayer].atTakeBlack + 1){
                    this.players[this.currPlayer].atTakeRed--;
                    this.players[this.currPlayer].atTakeBlack++;
                }
                console.log("black increase selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=120 && event.offsetY<=140){ // decrease black
                if(this.players[this.currPlayer].atTakeBlack > 0){
                    this.players[this.currPlayer].atTakeRed++;
                    this.players[this.currPlayer].atTakeBlack--;
                }
                console.log("black decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atTakeRedBlack = false;
                this.players[this.currPlayer].gainRed(this.players[this.currPlayer].atTakeRed);
                this.players[this.currPlayer].gainBlack(this.players[this.currPlayer].atTakeBlack);
                this.players[this.currPlayer].atAction = false;
                this.players[this.currPlayer].actionFlag = true;
                this.players[this.currPlayer].atActionBoost = false;
                console.log("confirm selected");
            }
        } else if(this.players[this.currPlayer].atPrepareRoom){
            var roomTmp = (this.players[this.currPlayer].atMirrorStrength > 0) ? this.players[this.currPlayer].atMirrorStrength+(this.players[this.currPlayer].atActionBoost?1:0) :
                this.actionPoint[2]+1+(this.players[this.currPlayer].atActionBoost?1:0);
            if(event.offsetX>=20 && event.offsetX<=120 && event.offsetY>=90 && event.offsetY<=140){ // boost
                if(this.players[this.currPlayer].money>0){
                    console.log("boost selected");
                    if(this.players[this.currPlayer].atActionBoost){
                        this.players[this.currPlayer].money++;
                        this.players[this.currPlayer].atRoomToPrepare--;
                        this.players[this.currPlayer].atActionBoost = false;
                    } else {
                        this.players[this.currPlayer].money--;
                        this.players[this.currPlayer].atRoomToPrepare++;
                        this.players[this.currPlayer].atActionBoost = true;
                    }
                }
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase room number
                if(this.players[this.currPlayer].atRoomToPrepare < roomTmp){
                    this.players[this.currPlayer].atRoomToPrepare++;
                }
                console.log("room increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease room number
                if(this.players[this.currPlayer].atRoomToPrepare > 0){
                    this.players[this.currPlayer].atRoomToPrepare--;
                }
                console.log("room decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atPrepareRoom = false;
                for(let i=0; i<this.players[this.currPlayer].atRoomToPrepare; i++){
                    this.players[this.currPlayer].hotel.highlightRoomToPrepare(this.players[this.currPlayer].money, 0);
                }
                this.players[this.currPlayer].atAction = false;
                this.players[this.currPlayer].actionFlag = true;
                this.players[this.currPlayer].atActionBoost = false;
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
                }
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase royal
                if(this.players[this.currPlayer].atMoney > 0 && !this.players[this.currPlayer].hasHiredServer(14)){
                    this.players[this.currPlayer].atRoyal++;
                    this.players[this.currPlayer].atMoney--;
                }
                console.log("royal increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease royal
                if(this.players[this.currPlayer].atRoyal > 0 && !this.players[this.currPlayer].hasHiredServer(14)){
                    this.players[this.currPlayer].atRoyal--;
                    this.players[this.currPlayer].atMoney++;
                }
                console.log("royal decrease selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=90 && event.offsetY<=110){ // increase money
                if(this.players[this.currPlayer].atRoyal > 0 && !this.players[this.currPlayer].hasHiredServer(14)){
                    this.players[this.currPlayer].atRoyal--;
                    this.players[this.currPlayer].atMoney++;
                }
                console.log("money increase selected");
            } else if(event.offsetX>=375 && event.offsetX<=425 && event.offsetY>=120 && event.offsetY<=140){ // decrease money
                if(this.players[this.currPlayer].atMoney > 0 && !this.players[this.currPlayer].hasHiredServer(14)){
                    this.players[this.currPlayer].atRoyal++;
                    this.players[this.currPlayer].atMoney--;
                }
                console.log("money decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atRoyalMoney = false;
                this.players[this.currPlayer].gainRoyal(this.players[this.currPlayer].atRoyal);
                this.players[this.currPlayer].gainMoney(this.players[this.currPlayer].atMoney);
                this.players[this.currPlayer].atAction = false;
                this.players[this.currPlayer].actionFlag = true;
                this.players[this.currPlayer].atActionBoost = false;
                console.log("confirm selected");
            }
        } else if(this.players[this.currPlayer].atHireServer){
            if(event.offsetX>=20 && event.offsetX<=120 && event.offsetY>=90 && event.offsetY<=140){ // boost
                if(this.players[this.currPlayer].money>0){
                    console.log("boost selected");
                    if(this.players[this.currPlayer].atActionBoost){
                        this.players[this.currPlayer].money++;
                        this.players[this.currPlayer].atHireServerdiscount[this.players[this.currPlayer].atHireServerdiscount.length-1]--;
                        this.players[this.currPlayer].atActionBoost = false;
                    } else {
                        this.players[this.currPlayer].money--;
                        this.players[this.currPlayer].atHireServerdiscount[this.players[this.currPlayer].atHireServerdiscount.length-1]++;
                        this.players[this.currPlayer].atActionBoost = true;
                    }
                }
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atHireServer = false;
                this.players[this.currPlayer].highlightServerToHire(this.players[this.currPlayer].atHireServerdiscount.at(-1));
                this.players[this.currPlayer].atAction = false;
                this.players[this.currPlayer].actionFlag = true;
                this.players[this.currPlayer].atActionBoost = false;
                console.log("confirm selected");
            }
            
        } else if(this.players[this.currPlayer].atTakeMirror){
            if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=90 && event.offsetY<=110){ // increase dice
                if(this.players[this.currPlayer].atMirrorDice < 5){
                    this.players[this.currPlayer].atMirrorDice++;
                }
                console.log("brown increase selected");
            } else if(event.offsetX>=225 && event.offsetX<=275 && event.offsetY>=120 && event.offsetY<=140){ // decrease dice
                if(this.players[this.currPlayer].atMirrorDice > 1){
                    this.players[this.currPlayer].atMirrorDice--;
                }
                console.log("brown decrease selected");
            } else if(event.offsetX>=200 && event.offsetX<=300 && event.offsetY>=170 && event.offsetY<=210){ // confirm
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].atTakeMirror = false;
                // check server bonus if any
                var serverBonus = this.diceServerBonus(this.players[this.currPlayer].atMirrorDice-1);
                switch(this.players[this.currPlayer].atMirrorDice){
                    case 1: this.players[this.currPlayer].actionTakeBrownWhite(this.players[this.currPlayer].atMirrorStrength + serverBonus); break;
                    case 2: this.players[this.currPlayer].actionTakeRedBlack(this.players[this.currPlayer].atMirrorStrength + serverBonus); break;
                    case 3: this.players[this.currPlayer].actionPrepareRoom(this.players[this.currPlayer].atMirrorStrength + serverBonus); break;
                    case 4: this.players[this.currPlayer].actionTakeRoyalMoney(this.players[this.currPlayer].atMirrorStrength + serverBonus); break;
                    case 5: this.players[this.currPlayer].actionHireServer(this.players[this.currPlayer].atMirrorStrength + serverBonus); break;
                }
                this.players[this.currPlayer].atAction = false;
                this.players[this.currPlayer].atActionBoost = false;
                console.log("confirm selected");
            }
        } else if(this.players[this.currPlayer].royalResultPending){ // royal punishment selection
            if(event.offsetX>=50 && event.offsetX<=100 && event.offsetY>=30 && event.offsetY<=70){
                this.players[this.currPlayer].royalPunishSelection = 0;
            } else if(event.offsetX>=50 && event.offsetX<=100 && event.offsetY>=100 && event.offsetY<=150){
                if( (this.mainRound==2 && this.royalTask0==1) || (this.mainRound==4 && this.royalTask1==0 ) || (this.mainRound==6 && (this.royalTask2==0 || this.royalTask2==1 || this.royalTask2==2)) ){
                    console.log("No this option in this royal task");
                } else {
                    this.players[this.currPlayer].royalPunishSelection = 1;
                }
            } else if(event.offsetX>=50 && event.offsetX<=100 && event.offsetY>=170 && event.offsetY<=210){
                if(this.players[this.currPlayer].hasHiredServer(25) && this.players[this.currPlayer].hasMoney(1)){
                    this.players[this.currPlayer].royalPunishSelection = 2;
                }
            } else if(event.offsetX>=350 && event.offsetX<=450 && event.offsetY>=100 && event.offsetY<=140){
                alertCanvas.style.display = 'none';
                this.players[this.currPlayer].royalResultPending = false;
                this.players[this.currPlayer].royalResultExecute();
                console.log("confirm selected");
            }
        }
        this.updateAllCanvas();
    }

    handleServerClick(event) {
        console.log("server canvas clicked");
        // left roll server on hand
        if(event.offsetX>=0 && event.offsetX<=25 && event.offsetY>=80 && event.offsetY<=130 && this.players[this.currPlayer].serverOnHandCanvasIdx>0){
            console.log("sever on hand left roll clicked");
            this.players[this.currPlayer].serverOnHandCanvasIdx--;
        } // right roll server on hand
        else if(event.offsetX>=615 && event.offsetX<=640 && event.offsetY>=80 && event.offsetY<=130 && this.players[this.currPlayer].serverOnHandCanvasIdx<(this.players[this.currPlayer].numServerOnHand-3)) {
            console.log("sever on hand right roll clicked");
            this.players[this.currPlayer].serverOnHandCanvasIdx++;
        } // left roll server hired  this.triangleCanvas(context, 0, 380, 25, 405, 25, 355);
        if(event.offsetX>=0 && event.offsetX<=25 && event.offsetY>=355 && event.offsetY<=405 && this.players[this.currPlayer].serverHiredCanvasIdx>0){
            console.log("sever hired left roll clicked");
            this.players[this.currPlayer].serverHiredCanvasIdx--;
        } // right roll server hired  this.triangleCanvas(context, 640, 380, 615, 405, 615, 355);
        else if(event.offsetX>=615 && event.offsetX<=640 && event.offsetY>=355 && event.offsetY<=405 && this.players[this.currPlayer].serverHiredCanvasIdx<(this.players[this.currPlayer].numServerHired-3)) {
            console.log("sever hired right roll clicked");
            this.players[this.currPlayer].serverHiredCanvasIdx++;
        } 
        else{
            for(let i=0; i<3; i++){ // server on hand hire or lose
                if(this.players[this.currPlayer].serverOnHandCanvasIdx + i < this.players[this.currPlayer].numServerOnHand){
                    const serverIdx = this.players[this.currPlayer].serverOnHandCanvasIdx + i;
                    if(event.offsetX>=(65+170*i) && event.offsetX<=(225+170*i) && event.offsetY>=35 && event.offsetY<=275 && 
                        this.players[this.currPlayer].serverOnHandHighLight[serverIdx]){
                        if(this.players[this.currPlayer].hireNum) {
                            console.log("hire server " + serverIdx);
                            // if(this.players[this.currPlayer].serverOnHand[serverIdx].serverCost > this.players[this.currPlayer].atHireServerdiscount.at(-1)) {
                                this.players[this.currPlayer].money -= Math.max((this.players[this.currPlayer].serverOnHand[serverIdx].serverCost - this.players[this.currPlayer].atHireServerdiscount.at(-1)), 0);
                                this.players[this.currPlayer].atHireServerdiscount.pop();
                            // }
                            this.players[this.currPlayer].hireNum--;
                            this.players[this.currPlayer].hireServer(serverIdx);
                            if(this.players[this.currPlayer].hireLimitLastThree){ // draw 3 hire 1 senario, put back the reset
                                this.serverDeck.unshift(this.players[this.currPlayer].serverOnHand.at(-1));
                                this.serverDeck.unshift(this.players[this.currPlayer].serverOnHand.at(-1));
                                this.players[this.currPlayer].removeServerOnHand(this.players[this.currPlayer].numServerOnHand-1);
                                this.players[this.currPlayer].removeServerOnHand(this.players[this.currPlayer].numServerOnHand-1);
                                // this.shuffleDeck(this.serverDeck);
                            }
                            if(this.players[this.currPlayer].royalResultPending){ // royal task reward
                                this.players[this.currPlayer].royalResultPending = false;
                                this.players[this.currPlayer].royalResultFinish = true;
                            }
                            if(this.players[this.currPlayer].hireNum==0){
                                this.players[this.currPlayer].serverOnHandHighLightFlag = false;
                            }
                        } else if(this.players[this.currPlayer].loseServerNum) {
                            console.log("lose server " + serverIdx);
                            this.players[this.currPlayer].loseServerNum--;
                            this.players[this.currPlayer].removeServerOnHand(serverIdx);
                            if(this.players[this.currPlayer].loseServerNum==0){
                                // lose server only happens at royal task punishment
                                this.players[this.currPlayer].royalResultFinish = true;
                                this.players[this.currPlayer].serverOnHandHighLightFlag = false;
                            }
                        }
                        
                    }
                }
            }
            for(let i=0; i<3; i++) { // lose hired server at royal task punishment
                if(this.players[this.currPlayer].serverHiredCanvasIdx + i < this.players[this.currPlayer].numServerHired){
                    const serverIdx = this.players[this.currPlayer].serverOnHandCanvasIdx + i;
                    if(event.offsetX>=(65+170*i) && event.offsetX<=(225+170*i) && event.offsetY>=310 && event.offsetY<=550 && 
                        this.players[this.currPlayer].serverHiredHighLight[serverIdx]){
                        if(this.players[this.currPlayer].loseHiredNum) {
                            console.log("lose hired server " + serverIdx);
                            this.players[this.currPlayer].loseHiredNum--;
                            this.players[this.currPlayer].removeHiredServer(serverIdx);
                            if(this.players[this.currPlayer].loseHiredNum==0){
                                // lose server only happens at royal task punishment
                                this.players[this.currPlayer].royalResultFinish = true;
                                this.players[this.currPlayer].serverHiredHighLightFlag = false;
                            }
                        }
                        
                    }
                }
            }
        }
        this.updateAllCanvas();
    }
    // ========================================click handle==============================================
}
