const hotelCanvas = document.getElementById("hotelboard");
const hotelContext = hotelCanvas.getContext("2d");

const bonusRoomImg = document.getElementById("bonusRoomImg");
const hotel0Img = document.getElementById("hotel0Img");
const hotel1Img = document.getElementById("hotel1Img");
const hotel2Img = document.getElementById("hotel2Img");
const hotel3Img = document.getElementById("hotel3Img");
const hotel4Img = document.getElementById("hotel4Img");
const roomRedPreparedImg = document.getElementById("roomRedPreparedImg");
const roomRedClosedImg = document.getElementById("roomRedClosedImg");
const roomBluePreparedImg = document.getElementById("roomBluePreparedImg");
const roomBlueClosedImg = document.getElementById("roomBlueClosedImg");
const roomYellowPreparedImg = document.getElementById("roomYellowPreparedImg");
const roomYellowClosedImg = document.getElementById("roomYellowClosedImg");
const tableImg = document.getElementById("tableImg");

// Hotel class definition
class Hotel{
    constructor(hotelID) {
        console.log("hotel ID is " + hotelID);
        this.hotelID = hotelID;
        this.roomColor = roomColorByID[hotelID];
        // -1 as idle, 0 as prepared, 1 as occupied
        this.roomStatus = [[0,1,-1,-1,-1], [-1,1,-1,-1,-1], [-1,0,-1,-1,-1], [-1,-1,-1,-1,-1]];
        this.roomArea = roomAreaByID[hotelID];
        this.roomAreaRoom = roomAreaRoomByID[hotelID];
        this.roomClosedNum = 0;
        this.roomPreparedNum = 0;
        this.roomColumnClosedNum = 0;
        this.roomRowClosedNum = 0;
        this.roomAreaClosedNum = 0;
        this.roomHighLightFlag = false;
        this.roomHighLight = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
        // draw the hotel board
        this.updateHotelCanvas(hotelContext);
    }

    updateHotelCanvas(context) {
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
            }
        }

        // hotel table
        var   guestTableXoffset = 0;
        var   guestTableYoffset = hotelRoomYoffset+480;
        const guestTableWidth = 640;
        const guestTableHeight = 200;
        context.drawImage(tableImg, guestTableXoffset, guestTableYoffset, guestTableWidth, guestTableHeight);

        // hotel room highlight
    }

    roomPrepare(floor, col) {
        if(floor<0 || floor>3 || col<0 || col>4){
            return;
        }
        this.roomStatus[floor][col] = 0;
        this.roomPreparedNum++;
    }

    roomClose(colorID) {
        ;
    }
}