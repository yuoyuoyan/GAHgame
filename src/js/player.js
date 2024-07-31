// Player class definition
class Player{
    constructor(game, playerID, playerName, hotelID) {
        // init player basic info
        this.game = game;
        this.playerID = playerID;
        this.playerName = playerName;
        console.log("create new player " + this.playerID + " " + this.playerName);
        switch(this.playerID){
            case 0: this.canvas = player0Canvas; this.context = player0Context; this.markerColor = "blue";   /*console.log("link to canvas 0");*/ break;
            case 1: this.canvas = player1Canvas; this.context = player1Context; this.markerColor = "red";    /*console.log("link to canvas 1");*/ break;
            case 2: this.canvas = player2Canvas; this.context = player2Context; this.markerColor = "yellow"; /*console.log("link to canvas 2");*/ break;
            case 3: this.canvas = player3Canvas; this.context = player3Context; this.markerColor = "grey";   /*console.log("link to canvas 3");*/ break;
        }
        this.endFlag = false; // game class wait for this flag to go to next turn
        this.royalResult = -1; // punish 0 reward 1 nothing 2 notyet -1
        this.royalResultPending = false;
        this.royalResultFinish = false;
        this.miniTurn = [-1, -1];
        this.diceTaken = [-1, -1];
        this.firstGuestTurn = true; // whether at the first-guest-picking turn
        this.opInvite = true;
        this.opAction = false;
        this.opServe = false;
        this.opCheckout = false;
        this.opEnd = false;
        this.atInvite = false;
        this.atAction = false;
        this.atServe = false;
        this.atCheckout = false;
        this.atTakeBrownWhite = false;
        this.atTakeRedBlack = false;
        this.atPrepareRoom = false;
        this.atRoyalMoney = false;
        this.atHireServer = false;
        this.atTakeMirror = false;
        this.atSelectFood = 0;
        this.atTakeBrown = 0;
        this.atTakeWhite = 0;
        this.atTakeRed = 0;
        this.atTakeBlack = 0;
        this.atRoomToPrepare = 0;
        this.atRoyal = 0;
        this.atMoney = 0;
        this.atHireServerdiscount = [];
        this.atMirrorDice = 1;
        this.atMirrorStrength = 0;
        this.atActionBoost = false;
        this.freeInviteNum = 0;
        this.inviteFlag = false; // whether already invited this turn
        this.actionFlag = false; // whether already took dice this turn
        this.hireNum = 0;
        this.hireLimitLastThree = false; // only used at draw 3 and hire 1
        this.royalPunishSelection = 0;
        this.loseServerNum = 0;
        this.loseHiredNum = 0;
        this.serveFoodNum = 0;
        this.specialRound = false; // at a special round
        this.specialRoundFlag = false; // about to go to a special round
        this.gamePoint = 0;
        this.royalPoint = 0;
        this.hotelID = hotelID;
        this.food = 4;
        this.brown = 1;
        this.white = 1;
        this.red = 1;
        this.black = 1;
        this.foodBuf = 0;
        this.brownBuf = 0;
        this.whiteBuf = 0;
        this.redBuf = 0;
        this.blackBuf = 0;
        this.money = 10;
        this.numServerOnHand = 0;
        this.numServerHired = 0;
        this.serverOnHand = []; // empty hand at first, waiting for top to give servers
        this.serverOnHandCanvasIdx = 0;
        this.serverHired = [];
        this.serverHiredCanvasIdx = 0;
        this.serverOnHandHighLightFlag = false;
        this.serverOnHandHighLight = [];
        this.serverHiredHighLightFlag = false;
        this.serverHiredHighLight = [];
        this.hotel = new Hotel(this.game, hotelID); // prepare hotel
        // prepare the first three rooms
        this.hotel.highlightRoomToPrepare(this.money);
        this.hotel.highlightRoomToPrepare(this.money);
        this.hotel.highlightRoomToPrepare(this.money);
    }

    checkOpStatus() {
        // check operation availability based on player status
        // No op other than invite available at the first guest picking round
        // In royal round, can only end when the reward or punishment complete
        this.opInvite = this.game.royalRound ? false : !this.inviteFlag;
        this.opAction = this.game.royalRound ? false : (!this.actionFlag && !this.firstGuestTurn);
        this.opServe = this.game.royalRound ? false : ((this.money > 0) && (this.food > 0) && !this.firstGuestTurn && !this.atServe);
        this.opCheckout = false;
        if(!this.firstGuestTurn){
            for(let i=0; i<this.hotel.numGuestOnTable; i++){
                if(this.hotel.guestOnTable[i]!=null && this.hotel.guestOnTable[i].guestSatisfied){
                    this.opCheckout = true;
                }
            }
        }
        if(this.game.royalRound) this.opCheckout = false;
        // first guest round, need to invite a guest and prepare 3 rooms
        if(this.game.royalRound) {
            this.opEnd = this.royalResultFinish;
        } else {
            this.opEnd = this.firstGuestTurn ? (this.inviteFlag && (this.hotel.roomToPrepare == 0)) : this.actionFlag;
        }
    }

    disableAllOp() {
        // turn off all operation buttons
        // when one op selected
        // call checkOpStatus to turn on when op finished
        this.opInvite = false;
        this.opAction = false;
        this.opServe = false;
        this.opCheckout = false;
        this.opEnd = false;
    }

    actionTakeBrownWhite(value) {
        alertCanvas.style.display = 'block';
        this.atTakeBrownWhite = true;
        // default maximum white
        this.atTakeWhite = Math.floor(value/2);
        this.atTakeBrown = value - this.atTakeWhite;
        this.game.alertType = 0;
    }

    actionTakeRedBlack(value) {
        alertCanvas.style.display = 'block';
        this.atTakeRedBlack = true;
        // default maximum black
        this.atTakeBlack = Math.floor(value/2);
        this.atTakeRed = value - this.atTakeBlack;
        this.game.alertType = 1;
    }

    actionPrepareRoom(value) {
        alertCanvas.style.display = 'block';
        this.atPrepareRoom = true;
        this.atRoomToPrepare = value;
        this.game.alertType = 2;
    }

    actionTakeRoyalMoney(value) {
        alertCanvas.style.display = 'block';
        this.atRoyalMoney = true;
        // default maximum royal
        this.atRoyal = value;
        if(this.hasHiredServer(14)){
            this.atMoney = value;
        } else {
            this.atMoney = 0;
        }
        this.game.alertType = 3;
    }

    actionHireServer(value) {
        alertCanvas.style.display = 'block';
        this.atHireServer = true;
        this.serverOnHandHighLightFlag = true;
        // default maximum discount
        this.atHireServerdiscount.push(value);
        this.game.alertType = 4;
    }

    actionTakeMirror(value) {
        alertCanvas.style.display = 'block';
        this.atTakeMirror = true;
        // default dice 1
        this.atMirrorStrength = value;
        this.atMirrorDice = 1;
        this.game.alertType = 5;
    }

    highlightServerToLose(numServer) {
        this.serverOnHandHighLightFlag = true;
        this.loseServerNum=numServer;
        for(let i=0; i<this.serverOnHand.length; i++){
            this.serverOnHandHighLight[i] = 1; // all servers can be lost
        }
    }

    highlightServerToHire(discount, hireLimitLastThree=false) {
        this.serverOnHandHighLightFlag = true;
        this.hireNum++;
        this.atHireServerdiscount.push(discount);
        this.hireLimitLastThree = hireLimitLastThree;
        if(this.hireLimitLastThree) { // draw 3 servers
            this.addServerToHand(3);
        }
        for(let i=0; i<this.serverOnHand.length; i++){
            if(this.hireLimitLastThree) { // at draw 3 hire 1 senario
                this.serverOnHandHighLight[i] = (i>=(this.serverOnHand.length-3) && (this.money+discount) >= this.serverOnHand[i].serverCost) ? 1 : 0;
            } else {
                this.serverOnHandHighLight[i] = ((this.money+discount) >= this.serverOnHand[i].serverCost) ? 1 : 0;
            }
        }
    }

    highlightHiredServerToLose() {
        // only happen at royal task punishment
        // check if this player has final server first
        var hasFinalServer = false;
        for(let i=0; i<this.numServerHired; i++){
            if(this.serverHired[i].serverType == 3){
                hasFinalServer = true;
                break;
            }
        }
        // highlight final server or all hired server if not exist
        this.serverHiredHighLightFlag = ture;
        this.loseHiredNum++;
        for(let i=0; i<this.numServerHired; i++){
            this.serverHiredHighLight[i] = hasFinalServer ? (this.serverHired[i].serverType==3 ? 1 : 0) : 1;
        }
    }

    royalResultExecute() { // execute royal task result after selection, only happens to punishment
        // assert royal result finish if no action needed
        if(this.royalPunishSelection == 2) { // Pay 1 to neglicate the punishment
            this.loseMoney(1);
        } else if(this.royalResult==0) { // punishment
            switch(this.game.mainRound){
                case 2: 
                    switch(this.game.royalTask0){
                        case 0:
                        if(this.royalPunishSelection==0) {
                            this.loseMoney(3);
                        } else if(this.royalPunishSelection==1) {
                            this.loseGamePoint(5);
                        }
                        this.royalResultFinish = true;
                        break; // 失去3块钱或5游戏点数
                        case 1: this.clearKitchen(); 
                        this.royalResultFinish = true;
                        break; // 失去厨房全部食物
                        case 2:
                        if(this.royalPunishSelection==0) {
                            this.highlightServerToLose(2);
                        } else if(this.royalPunishSelection==1) {
                            this.loseGamePoint(5);
                            this.royalResultFinish = true;
                        }
                        break; // 丢弃2张员工手牌或失去5游戏点数
                        case 3:
                        if(this.royalPunishSelection==0) {
                            this.hotel.highlightRoomToLose(true, false, false, false);
                        } else if(this.royalPunishSelection==1) {
                            this.loseGamePoint(5);
                            this.royalResultFinish = true;
                        }
                        break; // 失去最高的准备好的房间或失去5游戏点数
                    }
                    break;
                case 4:
                    switch(this.game.royalTask1){
                        case 0: this.players[i].clearGuestTable(); this.players[i].clearKitchen(); 
                        this.royalResultFinish = true;
                        break; // 失去厨房和客桌上的全部食物
                        case 1:
                        if(this.royalPunishSelection==0) {
                            this.loseMoney(5);
                        } else if(this.royalPunishSelection==1) {
                            this.loseGamePoint(7);
                        }
                        this.royalResultFinish = true;
                        break; // 失去5块钱或失去7游戏点数
                        case 2:
                        if(this.royalPunishSelection==0) {
                            this.highlightServerToLose(3);
                        } else if(this.royalPunishSelection==1) {
                            this.loseGamePoint(7);
                            this.royalResultFinish = true;
                        }
                        break; // 丢弃3张员工手牌或失去7游戏点数
                        case 3:
                        if(this.royalPunishSelection==0) {
                            this.hotel.highlightRoomToLose(true, false, false, false); this.hotel.highlightRoomToLose(true, false, false, false);
                        } else if(this.royalPunishSelection==1) {
                            this.loseGamePoint(7);
                            this.royalResultFinish = true;
                        }
                        break; // 失去最高的准备好的2个房间或失去7游戏点数
                    }
                    break;
                case 6:
                    switch(this.game.royalTask2){
                        case 0: this.players[i].loseGamePoint(8);
                        this.royalResultFinish = true;
                        break; // 失去8游戏点数
                        case 1: this.players[i].hotel.highlightRoomToLose(true, false, false, true); this.players[i].hotel.highlightRoomToLose(false, true, false, true);
                        break; // 失去最高层和次高层各1个已入住房间
                        case 2: this.players[i].loseGamePoint(2*this.players[i].numServerHired);
                        this.royalResultFinish = true;
                        break; // 每个已雇佣员工失去2游戏点数
                        case 3:
                        if(this.royalPunishSelection==0) {
                            this.highlightHiredServerToLose();
                        } else if(this.royalPunishSelection==1) {
                            this.loseGamePoint(10);
                            this.royalResultFinish = true;
                        }
                        break; // 失去1位已雇佣员工（终局结算优先）或失去10游戏点数
                    }
                    break;
            }
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

    gainRoyal(value) {
        if(this.royalPoint + value > 13){ // royal overflow to game point
            this.gamePoint += (this.royalPoint + value - 13);
        } else {
            this.royalPoint += value;
        }
        // check major task A1
        // 积累10点皇室点数
        if(this.game.majorTask0==1 && this.royalPoint >= 10){
            this.gainMajorTaskBonus(0);
        }
    }

    loseRoyal(value) {
        this.royalPoint = Math.max(this.royalPoint-value, 0); // cannot below 0
    }

    getRoyalPoint() {
        return this.royalPoint;
    }

    gainBrown(value) {this.brownBuf+=value; this.foodBuf+=value;}
    loseBrownKitchen() {this.brown--; this.food--;}
    loseBrownBuf() {this.brownBuf--; this.foodBuf--;}
    hasBrownKitchen() {return this.brown > 0;}
    hasBrownBuf() {return this.brownBuf > 0;}

    gainWhite(value) {this.whiteBuf+=value; this.foodBuf+=value;}
    loseWhiteKitchen() {this.white--; this.food--;}
    loseWhiteBuf() {this.whiteBuf--; this.foodBuf--;}
    hasWhiteKitchen() {return this.white > 0;}
    hasWhiteBuf() {return this.whiteBuf > 0;}

    gainRed(value) {this.redBuf+=value; this.foodBuf+=value;}
    loseRedKitchen() {this.red--; this.food--;}
    loseRedBuf() {this.redBuf--; this.foodBuf--;}
    hasRedKitchen() {return this.red > 0;}
    hasRedBuf() {return this.redBuf > 0;}

    gainBlack(value) {this.blackBuf+=value; this.foodBuf+=value;}
    loseBlackKitchen() {this.black--; this.food--;}
    loseBlackBuf() {this.blackBuf--; this.foodBuf--;}
    hasBlackKitchen() {return this.black > 0;}
    hasBlackBuf() {return this.blackBuf > 0;}

    moveAllBufToKitchen(){
        this.brown += this.brownBuf; this.brownBuf = 0;
        this.white += this.whiteBuf; this.whiteBuf = 0;
        this.red += this.redBuf; this.redBuf = 0;
        this.black += this.blackBuf; this.blackBuf = 0;
        this.food += this.foodBuf; this.foodBuf = 0;
    }

    clearKitchen() {
        this.brown = 0;
        this.white = 0;
        this.red = 0;
        this.black = 0;
        this.food = 0;
    }

    clearGuestTable() {
        for(let i=0; i<3; i++){
            if(this.guestOnTable[i]!=null){
                this.guestOnTable[i].guestSatisfied = false;
                this.guestOnTable[i].guestFoodServedNum = 0;
                for(let j=0; j<this.guestOnTable[i].guestRequirementNum; j++){
                    this.guestOnTable[i].guestFoodServed[i] = 0;
                }
            }
        }
    }

    hasMoney(value) {
        return this.money >= value;
    }

    gainMoney(value) {
        this.money += value;
        // check major task A0
        // 积累20块钱
        if(this.game.majorTask0==0 && this.money >= 20){
            this.gainMajorTaskBonus(0);
        }
    }

    loseMoney(value) {
        this.money = Math.max(0, this.money - value);
    }

    gainMajorTaskBonus(taskID) {
        // check if this player is on board already
        // could happen after royal task punishment
        var existFlag = false;
        for(let i=0; i<3; i++){
            if(this.game.majorTaskComp[taskID][i] == this.playerID) {
                existFlag = true;
            }
        }
        if(existFlag) return;
        // normal record
        for(let i=0; i<3; i++){
            if(this.game.majorTaskComp[taskID][i]==-1){
                this.game.majorTaskComp[taskID][i] = this.playerID;
                switch(i){
                    case 0: this.gainGamePoint(15); break;
                    case 1: this.gainGamePoint(10); break;
                    case 2: this.gainGamePoint(5); break;
                }
                break;
            }
        }
    }

    addServerToHand(value) {
        for(let i=0; i<value; i++){
            this.numServerOnHand++;
            this.serverOnHand.push(new Server(this.game.serverDeck.at(-1)));
            this.serverOnHandHighLight.push(1);
            this.game.serverDeck.pop();
        }
    }

    addServerToHandDebug(serverID) { // debug only, force a server card on hand
        this.numServerOnHand++;
        this.serverOnHand.push(new Server(serverID));
        this.serverOnHandHighLight.push(1);
    }

    hireServer(serverIndex) {
        if(serverIndex >= this.serverOnHand.length){ // overflow
            return;
        }

        this.serverHired.push(this.serverOnHand[serverIndex]);
        this.numServerHired++;

        // check major task A2
        // 雇佣6名员工
        if(this.game.majorTask0==2 && this.numServerHired >= 6){
            this.gainMajorTaskBonus(0);
        }

        // activate the bonus of server if it's one turn type
        // also auto fulfill the per-turn server
        if(this.serverOnHand[serverIndex].serverType == 1 || this.serverOnHand[serverIndex].serverType == 0) {
            switch(this.serverOnHand[serverIndex].serverID){
                case 0: //每回合获得一个饼干
                this.gainBrown(1);
                break;
                case 1: //每回合获得一个蛋糕
                this.gainWhite(1);
                break;
                case 2: //每回合获得一个红酒
                this.gainRed(1);
                break;
                case 3: //每回合获得一个咖啡
                this.gainBlack(1);
                break;
                case 20: //一次性获得所有食物或饮料各一份
                this.gainBrown(1);
                this.gainWhite(1);
                this.gainRed(1);
                this.gainBlack(1);
                break;
                case 34: //一次性将两个准备好的房间入住
                this.hotel.highlightRoomToCheckout(true, 2); break;
                case 35: //一次性获得4份红酒
                this.gainRed(4);
                break;
                case 37: //一次性满足一位客人的所有用餐需求
                this.hotel.atSelectUnSatisfiedGuest = true;
                break;
                case 38: //一次性获得4份蛋糕
                this.gainWhite(4);
                break;
                case 42: //一次性获得4份咖啡
                this.gainBlack(4);
                break;
                case 43: //一次性获得4份饼干
                this.gainBrown(4);
                break;
                case 44: //一次性获得3皇家点数
                this.gainRoyal(3);
                break;
            }
        }
        this.serverOnHand.splice(serverIndex, 1); // remove this server on hand
        this.serverOnHandHighLight.splice(serverIndex, 1);
        this.numServerOnHand--;
    }

    removeServerOnHand(serverIndex) {
        if(serverIndex >= this.numServerOnHand){ // overflow
            return;
        }

        this.serverOnHand.splice(serverIndex, 1); // remove this server on hand
        this.numServerOnHand--;
    }

    removeHiredServer(serverIndex) {
        if(serverIndex >= this.numServerHired){ // overflow
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

    calculateFinalGamePoint() { // return the bonus point at the end, not added directly for normal round prediction
        var bonusPoint = 0;
        // server effect
        // the most special, handle first
        var othersFinalServer = [];
        if(this.hasHiredServer(28)){ //最终结算时获得所有其他玩家的结算效果
            for(let i=0; i<this.playerNumber; i++){
                if(i==this.playerID){
                    continue;
                }
                const finalServerID = [26, 27, 29, 30, 31, 33, 36, 39, 40, 45, 46, 47];
                for(let j=0; j<finalServerID.length; j++){
                    if(this.players[i].hasHiredServer(finalServerID[j])) {
                        othersFinalServer.push(finalServerID[j]);
                        // this.serverHired.push(new Server(finalServerID[j]));
                    }
                }
            }
        }

        if(this.hasHiredServer(26) || othersFinalServer.includes(26)){ // 最终结算时每个入住的红房间获得3游戏点数
            bonusPoint += this.hotel.roomRedClosedNum * 3;
            // this.gainGamePoint(this.hotel.roomRedClosedNum * 3);
        }
        if(this.hasHiredServer(27) || othersFinalServer.includes(27)){ //最终结算时每个入住的蓝房间获得3游戏点数
            bonusPoint += this.hotel.roomBlueClosedNum * 3;
            // this.gainGamePoint(this.hotel.roomBlueClosedNum * 3);
        }
        if(this.hasHiredServer(29) || othersFinalServer.includes(29)){ //最终结算时每个入住的黄房间获得3游戏点数
            bonusPoint += this.hotel.roomYellowClosedNum * 3;
            // this.gainGamePoint(this.hotel.roomYellowClosedNum * 3);
        }
        if(this.hasHiredServer(30) || othersFinalServer.includes(30)){ //最终结算时每个入住的房间获得1游戏点数
            bonusPoint += this.hotel.roomClosedNum;
            // this.gainGamePoint(this.hotel.roomClosedNum);
        }
        if(this.hasHiredServer(31) || othersFinalServer.includes(31)){ //最终结算时每个雇佣的员工获得2游戏点数
            bonusPoint += this.numServerHired * 2;
            // this.gainGamePoint(orgHiredServerNum * 2);
        }
        if(this.hasHiredServer(33) || othersFinalServer.includes(33)){ //最终结算时每个准备好或者入住的房间获得1游戏点数
            bonusPoint += (this.hotel.roomClosedNum + this.hotel.roomPreparedNum);
            // this.gainGamePoint(this.hotel.roomClosedNum + this.hotel.roomPreparedNum);
        }
        if(this.hasHiredServer(36) || othersFinalServer.includes(36)){ //最终结算时每个全部入住的区域获得2游戏点数
            bonusPoint += this.hotel.roomAreaClosedNum * 2;
            // this.gainGamePoint(this.hotel.roomAreaClosedNum * 2);
        }
        if(this.hasHiredServer(39) || othersFinalServer.includes(39)){ //最终结算时每个完成的全局任务获得5游戏点数
            for(let i=0; i<3; i++){
                for(let j=0; j<3; j++){
                    if(this.playerID == this.game.majorTaskComp[i][j]){
                        bonusPoint += 5;
                        // this.playerID.gainGamePoint(5);
                    }
                }
            }
        }
        if(this.hasHiredServer(40) || othersFinalServer.includes(40)){ //最终结算时每个剩余的皇室点数获得2游戏点数
            bonusPoint += this.royalPoint * 2;
            // this.gainGamePoint(this.royalPoint * 2);
        }
        if(this.hasHiredServer(45) || othersFinalServer.includes(45)){ //最终结算时每个全部入住的层获得5游戏点数
            bonusPoint += this.hotel.roomRowClosedNum * 5;
            // this.gainGamePoint(this.hotel.roomRowClosedNum * 5);
        }
        if(this.hasHiredServer(46) || othersFinalServer.includes(46)){ //最终结算时每个全部入住的列获得5游戏点数
            bonusPoint += this.hotel.roomColumnClosedNum * 5;
            // this.gainGamePoint(this.hotel.roomColumnClosedNum * 5);
        }
        if(this.hasHiredServer(47) || othersFinalServer.includes(47)){ //最终结算时每个入住的红黄蓝房间组合获得4游戏点数
            bonusPoint += Math.min(this.hotel.roomRedClosedNum, this.hotel.roomBlueClosedNum, this.hotel.roomYellowClosedNum) * 4;
            // this.gainGamePoint(Math.min(this.hotel.roomRedClosedNum, this.hotel.roomBlueClosedNum, this.hotel.roomYellowClosedNum) * 4);
        }

        // room points
        for(let floor=0; floor<4; floor++){
            for(let col=0; col<5; col++){
                if(this.hotel.roomStatus[floor][col] == 1) {
                    bonusPoint += floor+1;
                    // this.gainGamePoint(floor+1);
                }
            }
        }
        // money points
        bonusPoint += this.money;
        // this.gainGamePoint(this.money);
        // food points
        bonusPoint += this.food + this.foodBuf;
        // this.gainGamePoint(this.food + this.foodBuf);

        return bonusPoint;
    }

    guestBonus(guestID) {
        if(guestID==-1){
            console.log("invalid guest ID");
            return;
        }

        // game point
        this.gainGamePoint(guestBonusGamePointByID[guestID]);
        
        // extra bonus
        // point bonus
        switch(guestID) {
            case 4: // 获得1个棕饼干和2块钱
            this.gainMoney(2); break;
            case 5: // 获得1个黑咖啡和2个皇室点数
            this.gainRoyal(2); break;
            case 6: // 获得1个任意食物资源和2块钱
            this.gainMoney(2); break;
            case 12: // 获得1个黑咖啡和3块钱
            this.gainMoney(3); break;
            case 14: // 免费邀请1位客人并获得3个皇室点数
            this.gainRoyal(3); break;
            case 19: // 抽取2张员工到手牌并获得2个皇室点数
            this.gainRoyal(2); break;
            case 20: // 获得3个皇室点数
            this.gainRoyal(3); break;
            case 21: // 获得3块钱
            this.gainMoney(3); break;
            case 22: // 减1费打出1张员工并获得3个皇室点数
            this.gainRoyal(3); break;
            case 26: // 获得1块钱
            this.gainMoney(1); break;
            case 29: // 获得3个皇室点数
            this.gainRoyal(3); break;
            case 30: // 获得1块钱
            this.gainMoney(1); break;
            case 32: // 获得1块钱和1个皇室点数
            this.gainMoney(1); this.gainRoyal(1); break;
            case 34: // 获得1个红酒盒3块钱
            this.gainMoney(3); break;
            case 36: // 获得5块钱
            this.gainMoney(5); break;
            case 37: // 获得3块钱并免费邀请1位客人
            this.gainMoney(3); break;
            case 38: // 获得3块钱
            this.gainMoney(3); break;
            case 40: // 获得3块钱并免费邀请2位客人
            this.gainMoney(3); break;
            case 42: // 获得4块钱
            this.gainMoney(4); break;
            case 43: // 获得1个红酒和3块钱
            this.gainMoney(3); break;
            case 45: // 获得1块钱
            this.gainMoney(1); break;
            case 46: // 获得1个皇室点数
            this.gainRoyal(1); break;
            case 48: // 获得2个皇室点数
            this.gainRoyal(2); break;
            case 51: // 获得4块钱
            this.gainMoney(4); break;
            case 52: // 抽取1张员工到手牌并获得2个皇室点数
            this.gainRoyal(2); break;
            case 53: // 额外关闭1个房间并获得3个皇室点数
            this.gainRoyal(3); break;
            case 54: // 免费邀请1位客人并获得3个皇室点数
            this.gainRoyal(3); break;
            case 55: //额外关闭1个房间并获得1个皇室点数
            this.gainRoyal(1); break;
        }
        // server related
        switch(guestID){
            case 2: // 原价开1个房间并抽取1张员工到手牌
            this.addServerToHand(1); break;
            case 7: // 抽取2张员工到手牌
            this.addServerToHand(2); break;
            case 8: // 获得1个白蛋糕并减3费打出1张员工
            this.highlightServerToHire(3); break;
            case 11: // 获得1个白蛋糕并减2费打出1张员工
            this.highlightServerToHire(2); break;
            case 16: // 减1费打出1张员工
            this.highlightServerToHire(1); break;
            case 18: // 减1费打出1张员工并原价开1个房间
            this.highlightServerToHire(1); break;
            case 19: // 抽取2张员工到手牌并获得2个皇室点数
            this.addServerToHand(2); break;
            case 22: // 减1费打出1张员工并获得3个皇室点数
            this.highlightServerToHire(1); break;
            case 25: // 分别减1费打出2张员工
            this.highlightServerToHire(1);
            this.highlightServerToHire(1);
            break;
            case 27: // 抽取3张员工，减3费打出其中1张，剩余放回牌堆底部
            this.highlightServerToHire(3, true); break;
            case 28: // 抽取3张员工，免费打出其中1张，剩余放回牌堆底部
            this.highlightServerToHire(10, true); break;
            case 39: // 减3费打出1张员工
            this.highlightServerToHire(3); break;
            case 44: // 抽取3张员工到手牌
            this.addServerToHand(3); break;
            case 47: // 减1费打出1张员工
            this.highlightServerToHire(1); break;
            case 49: // 减3费打出1张员工
            this.highlightServerToHire(3); break;
            case 52: // 抽取1张员工到手牌并获得2个皇室点数
            this.addServerToHand(1); break;
            case 56: // 抽取2张员工到手牌
            this.addServerToHand(2); break;
            case 57: // 免费打出1张员工
            this.highlightServerToHire(10); break;
        }
        // room related
        switch(guestID) {
            case 1: // 免费开1间1层或2层房间
            this.hotel.highlightRoomToPrepare(this.money, 5, 1); break;
            case 2: // 原价开1个房间并抽取1张员工到手牌
            this.hotel.highlightRoomToPrepare(this.money); break;
            case 9: // 分别减1费开2个房间
            this.hotel.highlightRoomToPrepare(this.money, 1);
            this.hotel.highlightRoomToPrepare(this.money, 1);
            break;
            case 10: // 额外关闭1个房间
            this.hotel.highlightRoomToCheckout(true, 1); break;
            case 13: // 减1费开1个房间并原价开1个房间
            this.hotel.highlightRoomToPrepare(this.money, 0);
            this.hotel.highlightRoomToPrepare(this.money, 1);
            break;
            case 18: // 减1费打出1张员工并原价开1个房间
            this.hotel.highlightRoomToPrepare(this.money); break;
            case 23: // 免费开1个房间
            this.hotel.highlightRoomToPrepare(this.money, 5); break;
            case 24: // 额外关闭1个房间
            this.hotel.highlightRoomToCheckout(true, 1); break;
            case 35: // 额外关闭1个房间
            this.hotel.highlightRoomToCheckout(true, 1); break;
            case 41: // 免费开2个房间
            this.hotel.highlightRoomToPrepare(this.money, 5);
            this.hotel.highlightRoomToPrepare(this.money, 5);
            break;
            case 53: // 额外关闭1个房间并获得3个皇室点数
            this.hotel.highlightRoomToCheckout(true, 1); break;
            case 55: // 额外关闭1个房间并获得1个皇室点数
            this.hotel.highlightRoomToCheckout(true, 1); break;
        }
        // food related
        switch(guestID) {
            case 3: // 获得1个棕饼干
            this.gainBrown(1); break;
            case 4: // 获得1个棕饼干和2块钱
            this.gainBrown(1); break;
            case 5: // 获得1个黑咖啡和2个皇室点数
            this.gainBlack(1); break;
            case 6: // 获得1个任意食物资源和2块钱
            alertCanvas.style.display = 'block';
            this.atSelectFood = 1;
            this.atTakeBrown = 1; // default to brown
            this.game.alertType = 6;
            break;
            case 8: // 获得1个白蛋糕并减3费打出1张员工
            this.gainWhite(1); break;
            case 11: // 获得1个白蛋糕并减2费打出1张员工
            this.gainWhite(1); break;
            case 12: // 获得1个黑咖啡和3块钱
            this.gainBlack(1); break;
            case 34: // 获得1个红酒盒3块钱
            this.gainRed(1); break;
            case 43: // 获得1个红酒和3块钱
            this.gainRed(1); break;
        }
        // free invite
        switch(guestID) {
            case  0:
            case 14:
            case 15:
            case 31:
            case 33:
            case 37:
            case 54: this.addFreeInvite(1); break;
            case 40: this.addFreeInvite(2); break;
        }
        // special bonus
        if(guestID==50) { // 立即额外进行一个回合，不需要拿取骰子
            this.specialRoundFlag = true;
        }
        this.game.updateAllCanvas();
    }

    addFreeInvite(value) {
        this.freeInviteNum = value; 
        this.game.guestHighLightFlag = true; 
        this.game.checkGuestInvite(10);
    }

    // ========================================canvas==============================================
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

    triangleCanvas(context, X0, Y0, X1, Y1, X2, Y2){
        context.beginPath();
        context.moveTo(X0,Y0);
        context.lineTo(X1,Y1);
        context.lineTo(X2,Y2);
        context.fillStyle='black';
        context.fill();
        context.beginPath();
        context.moveTo(X0,Y0);
        context.lineTo(X1,Y1);
        context.lineTo(X2,Y2);
        context.lineTo(X0,Y0);
        context.strokeStyle='white';
        context.stroke();
    }

    markCanvas(context, X0, Y0, X1, Y1, X2, Y2){
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(X0, Y0);
        context.lineTo(X1, Y1);
        context.lineTo(X2, Y2);
        context.strokeStyle = 'green';
        context.stroke();
    }

    updateAlertCanvas(context){
        // clear canvas first
        context.clearRect(0, 0, 480, 240);
        // different types of alert
        switch(this.game.alertType){
            case 0: // take brown or white
            context.drawImage(moneyImg, 20, 100, 30, 30);
            this.textCanvas(context, "Boost", 60, 120);
            if(this.atActionBoost){ // draw a mark if boost is selected
                this.markCanvas(context, 80, 110, 90, 120, 100, 100);
            }
            context.drawImage(brownImg, 150, 100, 30, 30);
            this.textCanvas(context, this.atTakeBrown.toString(), 200, 120);
            this.triangleCanvas(context, 225, 110, 250, 90, 275, 110);
            this.triangleCanvas(context, 225, 120, 250, 140, 275, 120);
            context.drawImage(whiteImg, 300, 100, 30, 30);
            this.textCanvas(context, this.atTakeWhite.toString(), 350, 120);
            this.triangleCanvas(context, 375, 110, 400, 90, 425, 110);
            this.triangleCanvas(context, 375, 120, 400, 140, 425, 120);
            context.fillStyle = 'white';
            context.strokeStyle = 'black';
            context.strokeRect(200, 170, 100, 40);
            context.fillRect(200, 170, 100, 40);
            this.textCanvas(context, "确定", 228, 200);
            break;
            case 1: // take red or black
            context.drawImage(moneyImg, 20, 100, 30, 30);
            this.textCanvas(context, "Boost", 60, 120);
            if(this.atActionBoost){ // draw a mark if boost is selected
                this.markCanvas(context, 80, 110, 90, 120, 100, 100);
            }
            context.drawImage(redImg, 150, 100, 30, 30);
            this.textCanvas(context, this.atTakeRed.toString(), 200, 120);
            this.triangleCanvas(context, 225, 110, 250, 90, 275, 110);
            this.triangleCanvas(context, 225, 120, 250, 140, 275, 120);
            context.drawImage(blackImg, 300, 100, 30, 30);
            this.textCanvas(context, this.atTakeBlack.toString(), 350, 120);
            this.triangleCanvas(context, 375, 110, 400, 90, 425, 110);
            this.triangleCanvas(context, 375, 120, 400, 140, 425, 120);
            context.fillStyle = 'white';
            context.strokeStyle = 'black';
            context.strokeRect(200, 170, 100, 40);
            context.fillRect(200, 170, 100, 40);
            this.textCanvas(context, "确定", 228, 200);
            break;
            case 2: // prepare rooms
            context.drawImage(moneyImg, 20, 100, 30, 30);
            this.textCanvas(context, "Boost", 60, 120);
            if(this.atActionBoost){ // draw a mark if boost is selected
                this.markCanvas(context, 80, 110, 90, 120, 100, 100);
            }
            context.drawImage(roomPreparedTokenImg, 140, 90, 50, 50);
            this.textCanvas(context, this.atRoomToPrepare.toString(), 200, 120);
            this.triangleCanvas(context, 225, 110, 250, 90, 275, 110);
            this.triangleCanvas(context, 225, 120, 250, 140, 275, 120);
            context.fillStyle = 'white';
            context.strokeStyle = 'black';
            context.strokeRect(200, 170, 100, 40);
            context.fillRect(200, 170, 100, 40);
            this.textCanvas(context, "确定", 228, 200);
            break;
            case 3: // take royal points or money
            context.drawImage(moneyImg, 20, 100, 30, 30);
            this.textCanvas(context, "Boost", 60, 120);
            if(this.atActionBoost){ // draw a mark if boost is selected
                this.markCanvas(context, 80, 110, 90, 120, 100, 100);
            }
            context.drawImage(royalTokenImg, 150, 95, 30, 40);
            this.textCanvas(context, this.atRoyal.toString(), 200, 120);
            this.triangleCanvas(context, 225, 110, 250, 90, 275, 110);
            this.triangleCanvas(context, 225, 120, 250, 140, 275, 120);
            context.drawImage(moneyImg, 300, 100, 30, 30);
            this.textCanvas(context, this.atMoney.toString(), 350, 120);
            this.triangleCanvas(context, 375, 110, 400, 90, 425, 110);
            this.triangleCanvas(context, 375, 120, 400, 140, 425, 120);
            context.fillStyle = 'white';
            context.strokeStyle = 'black';
            context.strokeRect(200, 170, 100, 40);
            context.fillRect(200, 170, 100, 40);
            this.textCanvas(context, "确定", 228, 200);
            break;
            case 4: // hire servers
            context.drawImage(moneyImg, 20, 100, 30, 30);
            this.textCanvas(context, "Boost", 60, 120);
            if(this.atActionBoost){ // draw a mark if boost is selected
                this.markCanvas(context, 80, 110, 90, 120, 100, 100);
            }
            context.drawImage(serverImg[0], 140, 90, 50, 50);
            context.fillStyle = 'white';
            context.strokeStyle = 'black';
            context.strokeRect(200, 170, 100, 40);
            context.fillRect(200, 170, 100, 40);
            this.textCanvas(context, "确定", 228, 200);
            break;
            case 5: // take mirrors
            var diceImg = dice1Img;
            switch(this.atMirrorDice){
                case 1: diceImg = dice1Img; break;
                case 2: diceImg = dice2Img; break;
                case 3: diceImg = dice3Img; break;
                case 4: diceImg = dice4Img; break;
                case 5: diceImg = dice5Img; break;
            }
            context.drawImage(diceImg, 150, 100, 30, 30);
            this.triangleCanvas(context, 225, 110, 250, 90, 275, 110);
            this.triangleCanvas(context, 225, 120, 250, 140, 275, 120);
            context.fillStyle = 'white';
            context.strokeStyle = 'black';
            context.strokeRect(200, 170, 100, 40);
            context.fillRect(200, 170, 100, 40);
            this.textCanvas(context, "确定", 228, 200);
            break;
            case 6: // pick food to take
            context.drawImage(brownImg, 100, 25, 30, 30);
            this.textCanvas(context, this.atTakeBrown.toString(), 150, 45);
            this.triangleCanvas(context, 175, 35, 200, 15, 225, 35);
            this.triangleCanvas(context, 175, 45, 200, 65, 225, 45);
            context.drawImage(whiteImg, 250, 25, 30, 30);
            this.textCanvas(context, this.atTakeWhite.toString(), 300, 45);
            this.triangleCanvas(context, 325, 35, 350, 15, 375, 35);
            this.triangleCanvas(context, 325, 45, 350, 65, 375, 45);
            context.drawImage(redImg, 100, 100, 30, 30);
            this.textCanvas(context, this.atTakeRed.toString(), 150, 120);
            this.triangleCanvas(context, 175, 110, 200, 90, 225, 110);
            this.triangleCanvas(context, 175, 120, 200, 140, 225, 120);
            context.drawImage(blackImg, 250, 100, 30, 30);
            this.textCanvas(context, this.atTakeBlack.toString(), 300, 120);
            this.triangleCanvas(context, 325, 110, 350, 90, 375, 110);
            this.triangleCanvas(context, 325, 120, 350, 140, 375, 120);
            context.fillStyle = 'white';
            context.strokeStyle = 'black';
            context.strokeRect(200, 170, 100, 40);
            context.fillRect(200, 170, 100, 40);
            this.textCanvas(context, "确定", 228, 200);
            break;
            case 7: // pick royal task result
            var img0, img1, text0, text1;
            if(this.game.mainRound==2 && this.royalResult==0) {
                switch(this.game.royalTask0){
                    case 0: img0 = moneyImg; img1 = gamePointTokenImg; text0 = "失去3块钱"; text1 = "失去5游戏点数"; break;
                    case 1: img0 = brownImg; img1 = null; text0 = "失去厨房全部食物"; text1 = null; break;
                    case 2: img0 = serverTokenImg; img1 = gamePointTokenImg; text0 = "丢弃2张员工手牌"; text1 = "失去5游戏点数"; break;
                    case 3: img0 = roomPreparedTokenImg; img1 = gamePointTokenImg; text0 = "失去最高的准备好的房间"; text1 = "失去5游戏点数"; break
                }
            } else if(this.game.mainRound==4 && this.royalResult==0) {
                switch(this.game.royalTask1){
                    case 0: img0 = brownImg; img1 = null; text0 = "失去厨房和客桌上的全部食物"; text1 = null; break;
                    case 1: img0 = moneyImg; img1 = gamePointTokenImg; text0 = "失去5块钱"; text1 = "失去7游戏点数"; break;
                    case 2: img0 = serverTokenImg; img1 = gamePointTokenImg; text0 = "丢弃3张员工手牌"; text1 = "失去7游戏点数"; break;
                    case 3: img0 = roomClosedTokenImg; img1 = gamePointTokenImg; text0 = "失去最高和次高的已入住的2个房间"; text1 = "失去7游戏点数"; break;
                }
            } else if(this.game.mainRound==6 && this.royalResult==0) {
                switch(this.game.royalTask2){
                    case 0: img0 = gamePointTokenImg; img1 = null; text0 = "失去8游戏点数"; text1 = null; break;
                    case 1: img0 = roomClosedTokenImg; img1 = null; text0 = "失去最高层和次高层各1个已入住房间"; text1 = null; break;
                    case 2: img0 = serverTokenImg; img1 = null; text0 = "每个已雇佣员工失去2游戏点数"; text1 = null; break;
                    case 3: img0 = serverTokenImg; img1 = gamePointTokenImg; text0 = "失去1位已雇佣员工（终局结算优先）"; text1 = "失去10游戏点数"; break;
                }
            }
            if(img1!=null){
                context.drawImage(img0, 50, 30, 50, 40);
                this.textCanvas(context, text0, 150, 60);
            }
            if(img1!=null){
                context.drawImage(img1, 50, 100, 40, 50);
                this.textCanvas(context, text1, 150, 130);
            }
            if(this.hasHiredServer(25)){
                context.drawImage(moneyImg, 50, 170, 50, 40);
                this.textCanvas(context, "支付1块钱替代皇家任务惩罚", 150, 200);
            }
            this.markCanvas(context, 70, 40+70*this.royalPunishSelection, 90, 60+70*this.royalPunishSelection, 110, 20+70*this.royalPunishSelection);
            context.fillStyle = 'white';
            context.strokeStyle = 'black';
            context.strokeRect(350, 100, 100, 40);
            context.fillRect(350, 100, 100, 40);
            this.textCanvas(context, "确定", 378, 130);
            break;
        }
    }

    updateServerCanvas(context) {
        // clear canvas first
        context.clearRect(0, 0, 640, 560);

        // Server on hands
        this.textCanvas(context, "员工手牌", 25, 25);

        // draw the remaining of prev card if any
        var   serverXoffset = -105;
        var   serverYoffset = 35;
        const serverWidth = 160;
        const serverHeight = 240;
        if(this.serverOnHandCanvasIdx>0 && this.numServerOnHand>0) { 
            context.drawImage(serverImg[this.serverOnHand[this.serverOnHandCanvasIdx-1].serverID], serverXoffset, serverYoffset, serverWidth, serverHeight);
            // draw the left triangle to indicate
            this.triangleCanvas(context, 0, 105, 25, 130, 25, 80);
        }
        
        // draw 3 server cards if any
        for(let i=0; i<3; i++){
            if((this.serverOnHandCanvasIdx + i) < this.numServerOnHand){
                serverXoffset+=170;
                if((this.serverOnHandCanvasIdx + i) < this.numServerOnHand) {
                    context.drawImage(serverImg[this.serverOnHand[this.serverOnHandCanvasIdx+i].serverID], serverXoffset, serverYoffset, serverWidth, serverHeight);
                }
                // hightlight block if needed
                if(this.serverOnHandHighLightFlag && this.serverOnHandHighLight[this.serverOnHandCanvasIdx+i]) {
                    context.strokeStyle = "red";
                    context.lineWidth = 5;
                    context.strokeRect(serverXoffset, serverYoffset, serverWidth, serverHeight);
                }
            }
        }

        // draw the remaining of next card if any
        if(this.serverOnHandCanvasIdx + 3 < this.numServerOnHand) {
            serverXoffset+=170;
            context.drawImage(serverImg[this.serverOnHand[this.serverOnHandCanvasIdx+3].serverID], serverXoffset, serverYoffset, serverWidth, serverHeight);
            // draw the right triangle to indicate
            this.triangleCanvas(context, 640, 105, 615, 130, 615, 80);
        }

        // Server hired
        this.textCanvas(context, "已雇佣员工", 25, 300);

        // draw the remaining of prev card if any
        serverXoffset = -105;
        serverYoffset += 275;
        // console.log("num server hired: " + this.numServerHired);
        if(this.serverHiredCanvasIdx>0 && this.numServerHired>0) { 
            context.drawImage(serverImg[this.serverHired[this.serverHiredCanvasIdx-1].serverID], serverXoffset, serverYoffset, serverWidth, serverHeight);
            // draw the left triangle to indicate
            this.triangleCanvas(context, 0, 380, 25, 405, 25, 355);
        }
        
        // draw 3 server cards if any
        for(let i=0; i<3; i++){
            if(this.serverHiredCanvasIdx + i < this.numServerHired){
                serverXoffset+=170;
                context.drawImage(serverImg[this.serverHired[this.serverHiredCanvasIdx+i].serverID], serverXoffset, serverYoffset, serverWidth, serverHeight);
                // hightlight block if needed
                if(this.serverHiredHighLightFlag && this.serverHiredHighLight[this.serverHiredCanvasIdx+i]) {
                    context.strokeStyle = "red";
                    context.lineWidth = 5;
                    context.strokeRect(serverXoffset, serverYoffset, serverWidth, serverHeight);
                }
            }
        }

        // draw the remaining of next card if any
        if(this.serverHiredCanvasIdx + 3 < this.numServerHired) {
            serverXoffset+=170;
            context.drawImage(serverImg[this.serverHired[this.serverHiredCanvasIdx+3].serverID], serverXoffset, serverYoffset, serverWidth, serverHeight);
            // draw the right triangle to indicate
            this.triangleCanvas(context, 640, 380, 615, 405, 615, 355);
        }
    }

    updatePlayerCanvas(context) {
        // clear canvas first
        context.clearRect(0, 0, 960, 50);

        // markers first
        const markerXoffset = 25;
        const markerYoffset = 25;
        const markerRadius = 10;
        context.fillStyle = this.markerColor;
        context.beginPath();
        context.arc(markerXoffset, markerYoffset, markerRadius, 0, 2 * Math.PI);
        context.fill();
        // draw the check mark if it's this player's turn
        if(this.game.currPlayer == this.playerID){
            this.markCanvas(context, 15, 20, 25, 30, 35, 10);
            context.strokeStyle = "green";
            context.lineWidth = 5;
            context.strokeRect(0, 0, 960, 50);
        }

        // player name
        const nameXoffset = 40;
        const nameYoffset = 30;
        this.textCanvas(context, this.playerName.substring(0, 16), nameXoffset, nameYoffset)

        // mini round status
        var   miniRoundXoffset = nameXoffset+100;
        var   miniRoundYoffset = 5;
        var   miniRoundWidth = 80;
        var   miniRoundHeight = 40;
        context.fillStyle = '#446516';
        context.strokeStyle = 'black';
        context.strokeRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
        context.fillRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
        
        var   miniRoundXoffset = nameXoffset+102;
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
            context.lineWidth=2;
            context.strokeRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
            context.fillRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);

            this.textCanvas(context, this.miniTurn[0], miniRoundXoffset+13, miniRoundYoffset+22);
        }

        var   miniRoundXoffset = nameXoffset+142;
        var   miniRoundYoffset = 8;
        var   miniRoundWidth = 34;
        var   miniRoundHeight = 34;
        if(this.diceTaken[1] != -1){ // draw the dice
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
            context.lineWidth=2;
            context.strokeRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);
            context.fillRect(miniRoundXoffset, miniRoundYoffset, miniRoundWidth, miniRoundHeight);

            this.textCanvas(context, this.miniTurn[1], miniRoundXoffset+13, miniRoundYoffset+22);
        }

        // game point
        var   gamePointXoffset = miniRoundXoffset+50;
        var   gamePointYoffset = 5;
        const gamePointWidth = 30;
        const gamePointHeigh = 40;
        context.drawImage(gamePointTokenImg, gamePointXoffset, gamePointYoffset, gamePointWidth, gamePointHeigh);
        gamePointXoffset += 30;
        gamePointYoffset = 30;
        var gamePointText = this.gamePoint + " (" + (this.gamePoint+(this.game.gameOver?0:this.calculateFinalGamePoint())) + ")";
        this.textCanvas(context, gamePointText, gamePointXoffset, gamePointYoffset);

        // royal point
        var   royalPointXoffset = gamePointXoffset+100;
        var   royalPointYoffset = 5;
        const royalPointWidth = 30;
        const royalPointHeigh = 40;
        context.drawImage(royalTokenImg, royalPointXoffset, royalPointYoffset, royalPointWidth, royalPointHeigh);
        royalPointXoffset += 35;
        royalPointYoffset = 30;
        this.textCanvas(context, this.royalPoint, royalPointXoffset, royalPointYoffset);

        // money
        var   moneyXoffset = royalPointXoffset+20;
        var   moneyYoffset = 5;
        const moneyWidth = 30;
        const moneyHeigh = 40;
        context.drawImage(moneyImg, moneyXoffset, moneyYoffset, moneyWidth, moneyHeigh);
        moneyXoffset += 35;
        moneyYoffset = 30;
        this.textCanvas(context, this.money, moneyXoffset, moneyYoffset);

        // kichen status
        // brown
        var   foodXoffset = moneyXoffset+30;
        var   foodYoffset = 5;
        const foodWidth = 30;
        const foodHeigh = 30;
        context.drawImage(brownImg, foodXoffset, foodYoffset, foodWidth, foodHeigh);
        if(this.hasBrownBuf()) { // highlight if buffer has valid food
            context.strokeStyle = "green";
            context.lineWidth = 3;
            context.strokeRect(foodXoffset, foodYoffset, foodWidth, foodHeigh);
        }
        foodXoffset += 35;
        foodYoffset = 30;
        this.textCanvas(context, this.brown + this.brownBuf, foodXoffset, foodYoffset);

        // white
        foodXoffset += 20;
        foodYoffset = 5;
        context.drawImage(whiteImg, foodXoffset, foodYoffset, foodWidth, foodHeigh);
        if(this.hasWhiteBuf()) { // highlight if buffer has valid food
            context.strokeStyle = "green";
            context.lineWidth = 3;
            context.strokeRect(foodXoffset, foodYoffset, foodWidth, foodHeigh);
        }
        foodXoffset += 35;
        foodYoffset = 30;
        this.textCanvas(context, this.white + this.whiteBuf, foodXoffset, foodYoffset);

        // red
        foodXoffset += 20;
        foodYoffset = 5;
        context.drawImage(redImg, foodXoffset, foodYoffset, foodWidth, foodHeigh);
        if(this.hasRedBuf()) { // highlight if buffer has valid food
            context.strokeStyle = "green";
            context.lineWidth = 3;
            context.strokeRect(foodXoffset, foodYoffset, foodWidth, foodHeigh);
        }
        foodXoffset += 35;
        foodYoffset = 30;
        this.textCanvas(context, this.red + this.redBuf, foodXoffset, foodYoffset);

        // black
        foodXoffset += 20;
        foodYoffset = 5;
        context.drawImage(blackImg, foodXoffset, foodYoffset, foodWidth, foodHeigh);
        if(this.hasBlackBuf()) { // highlight if buffer has valid food
            context.strokeStyle = "green";
            context.lineWidth = 3;
            context.strokeRect(foodXoffset, foodYoffset, foodWidth, foodHeigh);
        }
        foodXoffset += 35;
        foodYoffset = 30;
        this.textCanvas(context, this.black + this.blackBuf, foodXoffset, foodYoffset);

        // operation if it's this player's turn, including invite, action, serve, and checkout
        var   opXoffset = foodXoffset+30;
        var   opYoffset = 10;
        const opWidth = 40;
        const opHeigh = 20;
        if(this.game.currPlayer == this.playerID){
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

            opXoffset += 45;
            if(this.opEnd){
                context.fillStyle = 'white';
            } else {
                context.fillStyle = 'grey';
            }
            context.strokeStyle = 'black';
            context.strokeRect(opXoffset, opYoffset, opWidth, opHeigh);
            context.fillRect(opXoffset, opYoffset, opWidth, opHeigh);
            context.font="15px Arial";
            context.fillStyle="black";
            context.fillText("结束", opXoffset+6, opYoffset+15);
        }
    }
    // ========================================canvas==============================================


    // ========================================click handle==============================================
    handlePlayerClick(event) {
        // check if this event is invite
        if(event.offsetX >= 712 && event.offsetX <= 752 && event.offsetY >= 10 && event.offsetY <= 30){
            console.log("Invite button pressed");
            if(this.opInvite){
                // disable all 
                this.disableAllOp();
                this.atInvite = true;
                this.game.guestHighLightFlag = true;
                if(this.firstGuestTurn){
                    this.game.checkGuestInvite(10); // make sure all guest available at the first guest
                } else {
                    this.game.checkGuestInvite(this.money);
                }
            }
        }

        // check if this event is action
        if(event.offsetX >= 757 && event.offsetX <= 797 && event.offsetY >= 10 && event.offsetY <= 30){
            console.log("Action button pressed");
            if(this.opAction){
                // disable all
                this.disableAllOp();
                this.atAction = true;
            }
            this.game.actionHighLightFlag = true;
            for(let i=0; i<6; i++){
                if(this.game.actionPoint[i]>0){
                    this.game.actionHighLight[i] = 1;
                }
            }
        }

        // check if this event is serve
        if(event.offsetX >= 802 && event.offsetX <= 842 && event.offsetY >= 10 && event.offsetY <= 30){
            console.log("Serve button pressed");
            if(this.opServe){
                // no need to disable other options
                if(!this.hasHiredServer(23)){ // exception to pay serve fee
                    this.money--;
                }
                this.atServe = true;
                this.serveFoodNum = 3;
            }
        }

        // check if this event is checkout
        if(event.offsetX >= 847 && event.offsetX <= 887 && event.offsetY >= 10 && event.offsetY <= 30){
            console.log("Checkout button pressed");
            if(this.opCheckout){
                // disable all
                this.disableAllOp();
                this.atCheckout = true;
                this.hotel.atSelectSatisfiedGuest = true;
            }
        }

        // check if this event is end
        if(event.offsetX >= 892 && event.offsetX <= 932 && event.offsetY >= 10 && event.offsetY <= 30){
            console.log("End button pressed");
            if(this.opEnd){
                this.endFlag = true;
                this.game.nextMiniRound();
            }
        }
        
        // update canvas
        this.game.updateAllCanvas();
    }
    // ========================================click handle==============================================
}