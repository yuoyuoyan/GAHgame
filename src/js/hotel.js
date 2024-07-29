// Hotel class definition
class Hotel{
    constructor(hotelID) {
        // console.log("hotel ID is " + hotelID);
        this.hotelID = hotelID;
        this.roomColor = roomColorByID[hotelID];
        // -1 as idle, 0 as prepared, 1 as occupied
        this.roomStatus = [[-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1]];
        this.roomArea = roomAreaByID[hotelID];
        this.roomAreaRoom = roomAreaRoomByID[hotelID];
        this.roomClosedNum = 0;
        this.roomPreparedNum = 0;
        this.roomColumnClosedNum = 0;
        this.roomRowClosedNum = 0;
        this.roomAreaClosedNum = 0;
        this.roomHighLightFlag = true;
        this.roomHighLight = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
        this.numGuestOnTable = 0;
        this.guestOnTable = [null, null, null];
        this.firstThreeRoom = true;
        this.roomToPrepare = 0;
        this.roomToClose = 0;
        this.roomToCloseColor = 0; // 1,2,3 as r/y/b, 4 as any color
        this.roomToCloseGuestID = 0;
        this.roomToCloseGuestTableID = 0;
        this.atSelectSatisfiedGuest = false; // assert it to select satisfied guest from table
        // highlight the room to be prepared at first stage
        this.highlightRoomToPrepare(10);
        // draw the hotel board
        this.updateHotelCanvas(hotelContext);
    }

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
                if(this.atSelectSatisfiedGuest && this.guestOnTable[i].guestSatisfied) { // hightlight satisfied guests if flag on
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

    highlightRoomToPrepare(value) {
        for(let floor=0; floor<4; floor++){
            for(let col=0; col<5; col++){
                if((this.roomStatus[floor][col] == -1) && // not prepared
                    ((floor>0 && this.roomStatus[floor-1][col]>=0) || // room under is prepared
                     (floor<3 && this.roomStatus[floor+1][col]>=0) || // room above is prepared
                     (col>0 && this.roomStatus[floor][col-1]>=0) || // room left is prepared
                     (col<4 && this.roomStatus[floor][col+1]>=0) || // room right is prepared
                     (floor==0 && col==0 && this.roomStatus[floor][col]==-1)) // room at left bottom corner must be the first to prepare
                    ) {
                        this.roomHighLight[floor][col] = (value >= floor) ? 1 : 0;
                } else {
                    this.roomHighLight[floor][col] = 0;
                }
            }
        }
    }

    highlightRoomToCheckout(color) {
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
    }

    roomClose(floor, col) {
        if(floor<0 || floor>3 || col<0 || col>4){
            return;
        }

        if(this.roomStatus[floor][col] != 0){
            return;
        }

        this.roomStatus[floor][col] = 1; // close room
        this.roomAreaRoom[this.roomArea[floor][col]]--; // area room counter
        if(this.roomAreaRoom[this.roomArea[floor][col]]==0){ // trigger the area bonus
            ;
        }
        this.roomClosedNum++;
        this.roomPreparedNum--;
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
        // count the closed areas
        this.roomAreaClosedNum = 0;
        for(let i=0; i<10; i++){
            if(this.roomAreaRoom[i]==0){
                this.roomAreaClosedNum++;
            }
        }
    }

    areaBonus() {
        ;
    }

    guestBonus(guestID) {
        ;
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
        if(this.guestOnTable[guestTableID]==null){
            console.log("this guest on table is not valid");
            return;
        }
        this.guestOnTable[guestTableID]=null;
        this.numGuestOnTable--;
    }
}