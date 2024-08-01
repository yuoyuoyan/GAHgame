// Hotel class definition
class Hotel{
    constructor(game, hotelID) {
        this.game = game;
        // console.log("hotel ID is " + hotelID);
        this.hotelID = hotelID;
        this.roomColor = roomColorByID[hotelID];
        // -1 as idle, 0 as prepared, 1 as occupied
        this.roomStatus = [[-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1]];
        this.roomArea = roomAreaByID[hotelID];
        this.roomAreaRoom = roomAreaRoomByID[hotelID].slice(); // clone an array not refer to it
        this.roomClosedNum = 0;
        this.roomPreparedNum = 0;
        this.roomColumnClosedNum = 0;
        this.roomRowClosedNum = 0;
        this.roomAreaClosedNum = 0;
        this.roomRedClosedNum = 0;
        this.roomYellowClosedNum = 0;
        this.roomBlueClosedNum = 0;
        this.roomRedPreparedNum = 0;
        this.roomYellowPreparedNum = 0;
        this.roomBluePreparedNum = 0;
        this.roomHighLightFlag = true;
        this.roomHighLight = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
        this.numGuestOnTable = 0;
        this.guestOnTable = [null, null, null];
        this.firstThreeRoom = true;
        this.roomToPrepare = 0;
        this.roomToPrepareDiscount = [];
        this.roomToLose = 0;
        this.roomToLoseType = []; // 0 as occupied at max level, 1 as occupied at next max level, 2 as prepared at max level, 3 as prepared at next max level
        this.roomToClose = 0;
        this.roomToCloseColor = 0; // 1,2,3 as r/y/b, 4 as any color
        this.roomToCloseGuestID = 0;
        this.roomToCloseGuestTableID = 0;
        this.roomCloseBonus = false;
        this.maxClosedRoomLevel = -1;
        this.maxPreparedRoomLevel = -1;
        this.atSelectSatisfiedGuest = false; // assert it to select satisfied guest from table
        this.atSelectUnSatisfiedGuest = false; // assert it to select unsatisfied guest from table
    }

    highlightRoomToLose(isMaxLevel=false, isNextMaxLevel=false, updateOnly=false, occupiedRoom=true) {
        if(!updateOnly){ // click handle need to update highlight without increase number
            this.roomToLose++;
            this.roomHighLightFlag = true;
        }
        for(let floor=0; floor<4; floor++){
            for(let col=0; col<5; col++){
                if(occupiedRoom) {
                    if((this.roomStatus[floor][col] == 1) &&
                       ((isMaxLevel && floor==this.maxClosedRoomLevel) ||
                        (isNextMaxLevel && floor==(this.maxClosedRoomLevel-1))) ) {
                        this.roomHighLight[floor][col] = 1;
                        this.roomToLoseType.push(isMaxLevel?0:1);
                    } else {
                        this.roomHighLight[floor][col] = 0;
                    }
                } else {
                    if((this.roomStatus[floor][col] == 0) &&
                       ((isMaxLevel && floor==this.maxPreparedRoomLevel) ||
                        (isNextMaxLevel && floor==(this.maxPreparedRoomLevel-1))) ) {
                        this.roomHighLight[floor][col] = 1;
                        this.roomToLoseType.push(isMaxLevel?2:3);
                    } else {
                        this.roomHighLight[floor][col] = 0;
                    }
                }
            }
        }
        // corner case when no room matches requirement
        if(this.roomToLoseType.length==0){ 
            this.game.players[this.game.currPlayer].royalResultFinish = true;
        }
    }

    highlightRoomToPrepare(money, discount=0, maxLevel=3, updateOnly=false) {
        if(!updateOnly){ // click handle need to update highlight without increase number
            this.roomToPrepare++;
            this.roomHighLightFlag = true;
            this.roomToPrepareDiscount.push(discount); // free
        }
        for(let floor=0; floor<4; floor++){
            for(let col=0; col<5; col++){
                if((this.roomStatus[floor][col] == -1) && // not prepared
                    ((floor>0 && this.roomStatus[floor-1][col]>=0) || // room under is prepared
                     (floor<3 && this.roomStatus[floor+1][col]>=0) || // room above is prepared
                     (col>0 && this.roomStatus[floor][col-1]>=0) || // room left is prepared
                     (col<4 && this.roomStatus[floor][col+1]>=0) || // room right is prepared
                     (floor==0 && col==0 && this.roomStatus[floor][col]==-1)) // room at left bottom corner must be the first to prepare
                    ) {
                        this.roomHighLight[floor][col] = (money >= (floor-discount) && floor <= maxLevel) ? 1 : 0;
                } else {
                    this.roomHighLight[floor][col] = 0;
                }
            }
        }
    }

    highlightRoomToCheckout(isBonus=false, roomNum=1, color=4, guestID=-1, tableID=-1) {
        this.roomHighLightFlag = true;
        if(isBonus){ // guest or server bonus
            this.roomToCloseColor = 4;
            this.roomToCloseGuestID = -1;
            this.roomToCloseGuestTableID = -1;
            this.roomToClose += roomNum;
        } else { // normal guest checkout
            this.roomToCloseColor = color;
            this.roomToCloseGuestID = guestID;
            this.roomToCloseGuestTableID = tableID;
            this.roomToClose = 1;
        }
        
        for(let floor=0; floor<4; floor++){
            for(let col=0; col<5; col++){
                if (this.roomStatus[floor][col] == 0 && // prepared
                    (this.roomColor[floor][col] == color || color==4)) { // match color or color doesn't care
                    this.roomHighLight[floor][col] = 1;
                } else {
                    this.roomHighLight[floor][col] = 0;
                }
            }
        }
    }

    hasRoomToCheckout(color){
        for(let floor=0; floor<4; floor++){
            for(let col=0; col<5; col++){
                if (this.roomStatus[floor][col] == 0 && // prepared
                    (this.roomColor[floor][col] == color || color==4)) { // match color or color doesn't care
                    return true;
                }
            }
        }
        return false;
    }

    roomPrepare(floor, col) {
        if(floor<0 || floor>3 || col<0 || col>4){
            return;
        }
        this.roomStatus[floor][col] = 0;
        this.roomPreparedNum++;
        switch(this.roomColor[floor][col]){
            case 0: this.roomRedPreparedNum++; break;
            case 1: this.roomYellowPreparedNum++; break;
            case 2: this.roomBluePreparedNum++; break;
        }
        // bonus game point at the upright corner
        if(floor==2 && col>=3){
            this.game.players[this.game.currPlayer].gainGamePoint(1);
        } else if(floor==3 && col>=2){
            this.game.players[this.game.currPlayer].gainGamePoint(2);
        }
        // update max level
        this.maxPreparedRoomLevel = Math.max(this.maxPreparedRoomLevel, floor);
        // check major task A3
        // 准备/入住12个房间
        if(this.game.majorTask0==3 && (this.roomPreparedNum + this.roomClosedNum) >= 12){
            this.game.players[this.game.currPlayer].gainMajorTaskBonus(0);
        }
    }

    roomClose(floor, col) {
        if(floor<0 || floor>3 || col<0 || col>4){
            return;
        }

        if(this.roomStatus[floor][col] != 0 && !this.game.players[this.game.currPlayer].royalResultPending){
            return;
        }

        this.roomStatus[floor][col] = 1; // close room
        this.roomAreaRoom[this.roomArea[floor][col]]--; // area room counter
        if(this.roomAreaRoom[this.roomArea[floor][col]]==0){ // trigger the area bonus
            this.areaBonus(floor, col);
        }
        this.roomClosedNum++;
        this.roomPreparedNum--;
        switch(this.roomColor[floor][col]){
            case 0: this.roomRedClosedNum++;    roomRedPreparedNum--; break;
            case 1: this.roomYellowClosedNum++; roomYellowPreparedNum--; break;
            case 2: this.roomBlueClosedNum++;   roomBluePreparedNum--; break;
        }
        // update max level
        this.maxClosedRoomLevel = Math.max(this.maxClosedRoomLevel, floor);
        // count the closed floors
        this.roomRowClosedNum = 0;
        for(let floor=0; floor<4; floor++){
            var floorFlag = true;
            for(let col=0; col<5; col++){
                if(this.roomStatus[floor][col]!=1){
                    floorFlag = false;
                }
            }
            if(floorFlag){
                this.roomRowClosedNum++;
            }
        }
        // check major task B0
        // 完整入住2个楼层
        if(this.game.majorTask1==0 && this.roomRowClosedNum >= 2){
            this.game.players[this.game.currPlayer].gainMajorTaskBonus(1);
        }
        // count the closed cols
        this.roomColumnClosedNum = 0;
        for(let col=0; col<5; col++){
            var colFlag = true;
            for(let floor=0; floor<4; floor++){
                if(this.roomStatus[floor][col]!=1){
                    colFlag = false;
                }
            }
            if(colFlag){
                this.roomColumnClosedNum++;
            }
        }
        // check major task B1
        // 完整入住2个列
        if(this.game.majorTask1==1 && this.roomColumnClosedNum >= 2){
            this.game.players[this.game.currPlayer].gainMajorTaskBonus(1);
        }
        // count the closed areas
        this.roomAreaClosedNum = 0;
        for(let i=0; i<10; i++){
            if(this.roomAreaRoom[i]==0){
                this.roomAreaClosedNum++;
            }
        }
        // check major task B2
        // 完整入住6个区域
        if(this.game.majorTask1==2 && this.roomAreaClosedNum >= 6){
            this.game.players[this.game.currPlayer].gainMajorTaskBonus(1);
        }
        // check major task B3
        // 完整入住所有的某颜色房间
        if(this.game.majorTask1==3 && 
           ((this.roomRedClosedNum    == roomColorNumByID[this.hotelID][0]) ||
            (this.roomYellowClosedNum == roomColorNumByID[this.hotelID][1]) ||
            (this.roomBlueClosedNum   == roomColorNumByID[this.hotelID][2]) )){
            this.game.players[this.game.currPlayer].gainMajorTaskBonus(1);
        }
        // check major task C0
        // 入住3个红和3个黄和3个蓝房间
        if(this.game.majorTask2==0 && 
           ((this.roomRedClosedNum    >= 3) &&
            (this.roomYellowClosedNum >= 3) &&
            (this.roomBlueClosedNum   >= 3) )){
            this.game.players[this.game.currPlayer].gainMajorTaskBonus(2);
        }
        // check major task C1
        // 入住4个红和3个黄房间
        if(this.game.majorTask2==1 && 
           ((this.roomRedClosedNum    >= 4) &&
            (this.roomYellowClosedNum >= 3) )){
            this.game.players[this.game.currPlayer].gainMajorTaskBonus(2);
        }
        // check major task C2
        // 入住4个黄和3个蓝房间
        if(this.game.majorTask2==2 && 
           ((this.roomYellowClosedNum >= 4) &&
            (this.roomBlueClosedNum   >= 3) )){
            this.game.players[this.game.currPlayer].gainMajorTaskBonus(2);
        }
        // check major task C3
        // 入住4个蓝和3个红房间
        if(this.game.majorTask2==3 && 
           ((this.roomBlueClosedNum   >= 4) &&
            (this.roomRedClosedNum    >= 3) )){
            this.game.players[this.game.currPlayer].gainMajorTaskBonus(2);
        }
    }

    roomLose(floor, col) {
        if(floor<0 || floor>3 || col<0 || col>4){
            return;
        }
        if(this.roomStatus[floor][col] == 1) {
            this.roomClosedNum--;
            switch(this.roomColor[floor][col]){
                case 0: roomRedClosedNum--; break;
                case 1: roomYellowClosedNum--; break;
                case 2: roomBlueClosedNum--; break;
            }
        } else if(this.roomStatus[floor][col] == 0) {
            this.roomPreparedNum--;
            switch(this.roomColor[floor][col]){
                case 0: roomRedPreparedNum--; break;
                case 1: roomYellowPreparedNum--; break;
                case 2: roomBluePreparedNum--; break;
            }
        }
        this.roomStatus[floor][col] = -1;
        
        // update max level info
        this.maxPreparedRoomLevel = -1;
        for(let floor=3; floor>=0; floor--){
            for(let col=0; col<5; col++){
                if(this.roomStatus[floor][col] == 0){
                    this.maxPreparedRoomLevel = Math.max(this.maxPreparedRoomLevel, floor);
                }
            }
        }
        this.maxClosedRoomLevel = -1;
        for(let floor=3; floor>=0; floor--){
            for(let col=0; col<5; col++){
                if(this.roomStatus[floor][col] == 1){
                    this.maxClosedRoomLevel = Math.max(this.maxClosedRoomLevel, floor);
                }
            }
        }
    }

    areaBonus(floor, col) {
        var color = this.roomColor[floor][col];
        var roomNum = roomAreaRoomByID[this.hotelID][this.roomArea[floor][col]];
        switch(roomNum) {
            case 1: 
                switch(color) {
                    case 0: this.game.players[this.game.currPlayer].gainMoney(1); break;
                    case 1: this.game.players[this.game.currPlayer].gainRoyal(1); break;
                    case 2: this.game.players[this.game.currPlayer].gainGamePoint(2); break;
                }
                break;
            case 2:
                switch(color) {
                    case 0: this.game.players[this.game.currPlayer].gainMoney(3); break;
                    case 1: this.game.players[this.game.currPlayer].gainRoyal(3); break;
                    case 2: this.game.players[this.game.currPlayer].gainGamePoint(5); break;
                }
                break;
            case 3:
                switch(color) {
                    case 0: this.game.players[this.game.currPlayer].gainMoney(6); break;
                    case 1: this.game.players[this.game.currPlayer].gainRoyal(6); break;
                    case 2: this.game.players[this.game.currPlayer].gainGamePoint(9); break;
                }
                break;
            case 4:
                switch(color) {
                    case 0: this.game.players[this.game.currPlayer].gainMoney(10); break;
                    case 1: this.game.players[this.game.currPlayer].gainRoyal(10); break;
                    case 2: this.game.players[this.game.currPlayer].gainGamePoint(15); break;
                }
                break;
        }
    }

    addGuestToTable(guestID){
        if(this.numGuestOnTable >= 3){
            console.log("no available table for new guests");
        }
        // find a table
        var availableTable = -1;
        for(let i=0; i<3; i++){
            if(this.guestOnTable[i]==null){
                availableTable = i;
                break;
            }
        }

        // add guest inside
        this.guestOnTable[availableTable] = new Guest(guestID, availableTable);
        this.numGuestOnTable++;
        console.log("Add guest " + this.guestOnTable[availableTable].guestName + " to table " + availableTable);
    }

    removeGuestFromTable(guestTableID){
        if(guestTableID==-1){
            console.log("invalie guest table");
            return;
        }
        if(this.guestOnTable[guestTableID]==null){
            console.log("this guest on table is not valid");
            return;
        }
        this.guestOnTable[guestTableID]=null;
        this.numGuestOnTable--;
    }

    satisfyGuest(guestTableID){
        for(let i=0; i<this.guestOnTable[guestTableID].guestFoodServed.length; i++){
            this.guestOnTable[guestTableID].guestFoodServed[i] = 1;
        }
        this.guestOnTable[guestTableID].guestFoodServedNum = this.guestOnTable[guestTableID].guestFoodServed.length;
        this.guestOnTable[guestTableID].guestSatisfied = true;
    }

    hasPreparedRoom(color) {
        switch(color){
            case 0: return this.roomRedPreparedNum>0; break;
            case 1: return this.roomYellowPreparedNum>0; break;
            case 2: return this.roomBluePreparedNum>0; break;
            case 3: return this.roomPreparedNum>0; break;
        }
    }

    // ========================================canvas==============================================
    updateHotelCanvas(context) {
        // clear canvas
        context.clearRect(0, 0, 640, 840);

        // room bonus
        var   bonusRoomXoffset = 0;
        var   bonusRoomYoffset = 0;
        var   bonusRoomWidth = 640;
        var   bonusRoomHeight = 120;
        context.drawImage(bonusRoomImg, bonusRoomXoffset, bonusRoomYoffset, bonusRoomWidth, bonusRoomHeight);

        // hotel base
        var   hotelBaseImg;
        switch(this.hotelID){
            case 0: hotelBaseImg = hotel0Img; break;
            case 1: hotelBaseImg = hotel1Img; break;
            case 2: hotelBaseImg = hotel2Img; break;
            case 3: hotelBaseImg = hotel3Img; break;
            case 4: hotelBaseImg = hotel4Img; break;
        }
        var   hotelBaseXoffset = 0;
        var   hotelBaseYoffset = bonusRoomHeight;
        const hotelBaseWidth = 640;
        const hotelBaseHeight = 480;
        context.drawImage(hotelBaseImg, hotelBaseXoffset, hotelBaseYoffset, hotelBaseWidth, hotelBaseHeight);

        // hotel room status
        var   hotelRoomXoffset = 60;
        var   hotelRoomYoffset = bonusRoomHeight;
        const hotelRoomWidth = 100;
        const hotelRoomHeight = 120;
        for(let floor=0; floor<4; floor++){
            for(let col=0; col<5; col++){
                if(this.roomStatus[floor][col] == 1) { // closed
                    var hotelRoomImg;
                    switch(this.roomColor[floor][col]){
                        case 0: hotelRoomImg = roomRedClosedImg; break;
                        case 1: hotelRoomImg = roomYellowClosedImg; break;
                        case 2: hotelRoomImg = roomBlueClosedImg; break;
                    }
                    context.drawImage(hotelRoomImg, hotelRoomXoffset + 115 * col, hotelRoomYoffset + 120 * (3-floor), hotelRoomWidth, hotelRoomHeight);
                } else if(this.roomStatus[floor][col] == 0) { // prepared
                    var hotelRoomImg;
                    switch(this.roomColor[floor][col]){
                        case 0: hotelRoomImg = roomRedPreparedImg; break;
                        case 1: hotelRoomImg = roomYellowPreparedImg; break;
                        case 2: hotelRoomImg = roomBluePreparedImg; break;
                    }
                    context.drawImage(hotelRoomImg, hotelRoomXoffset + 115 * col, hotelRoomYoffset + 120 * (3-floor), hotelRoomWidth, hotelRoomHeight);
                }
                // hightlight the marked room
                if(this.roomHighLightFlag && this.roomHighLight[floor][col]) {
                    context.strokeStyle = "red";
                    context.lineWidth = 5;
                    context.strokeRect(hotelRoomXoffset + 115 * col, hotelRoomYoffset + 120 * (3-floor), hotelRoomWidth, hotelRoomHeight);
                }
            }
        }

        // hotel table
        var   guestTableXoffset = 0;
        var   guestTableYoffset = hotelRoomYoffset+480;
        const guestTableWidth = 640;
        const guestTableHeight = 200;
        context.drawImage(tableImg, guestTableXoffset, guestTableYoffset, guestTableWidth, guestTableHeight);

        // hotel room highlight
        // guest table
        var   guestXoffset = 36;
        var   guestYoffset = guestTableYoffset+10;
        const guestWidth   = 160;
        const guestHeight  = 240;
        for(let i=0; i<3; i++){
            if(this.guestOnTable[i] != null) {
                context.drawImage(guestImg[this.guestOnTable[i].guestID], guestXoffset, guestYoffset, guestWidth, guestHeight);
                if(this.atSelectSatisfiedGuest && this.guestOnTable[i].guestSatisfied &&
                    this.hasPreparedRoom(this.guestOnTable[i].guestColor)) { // hightlight satisfied guests if flag on
                    context.strokeStyle = "red";
                    context.lineWidth = 3;
                    context.strokeRect(guestXoffset, guestYoffset, guestWidth, guestHeight);
                } else if(this.atSelectUnSatisfiedGuest && !this.guestOnTable[i].guestSatisfied) { // highlight unsatisfied guests if flag on
                    context.strokeStyle = "red";
                    context.lineWidth = 3;
                    context.strokeRect(guestXoffset, guestYoffset, guestWidth, guestHeight);
                }
            }
            guestXoffset += 182;
        }
        // highlight the food requirement on guest tables
        var   foodXoffset = 40;
        var   foodYoffset = guestYoffset + 8;
        const foodWidth   = 30;
        const foodHeight  = 28;
        for(let i=0; i<3; i++){
            if(this.guestOnTable[i] != null) {
                for(let j=0; j<this.guestOnTable[i].guestRequirement.length; j++){
                    if(!this.guestOnTable[i].guestFoodServed[j]){ // draw red circle if not served
                        context.strokeStyle = "red";
                        context.lineWidth = 3;
                        context.strokeRect(foodXoffset, foodYoffset, foodWidth, foodHeight);
                    } else { // draw green circle and a mark if not served
                        context.strokeStyle = "green";
                        context.lineWidth = 3;
                        context.strokeRect(foodXoffset, foodYoffset, foodWidth, foodHeight);
                        context.lineWidth = 3;
                        context.beginPath();
                        context.moveTo(foodXoffset, foodYoffset+14);
                        context.lineTo(foodXoffset+15, foodYoffset+28);
                        context.lineTo(foodXoffset+30, foodYoffset);
                        context.strokeStyle = 'green';
                        context.stroke();
                    }
                    foodYoffset += 28;
                }
            }
            foodXoffset += 182;
            foodYoffset = guestYoffset + 8;
        }
    }
    // ========================================canvas==============================================
}