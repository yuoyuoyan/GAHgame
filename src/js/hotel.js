// Hotel class definition
class Hotel{
    constructor(hotelID) {
        this.hotelID = hotelID;
        this.roomColor = roomColorByID[hotelID];
        this.roomStatus = [[-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1]];
        this.roomArea = roomAreaByID[hotelID];
        this.roomAreaRoom = roomAreaRoomByID[hotelID];
        this.roomClosedNum = 0;
        this.roomPreparedNum = 0;
        this.roomColumnClosedNum = 0;
        this.roomRowClosedNum = 0;
        this.roomAreaClosedNum = 0;
    }

    roomPrepare(numPrepare) {
        ;
    }

    roomClose(colorID) {
        ;
    }

    areaBonus(colorID, roomNum) {
        ;
    }
}