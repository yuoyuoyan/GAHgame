// Player class definition
export class Player extends Game{
    constructor(playerID, playerName, hotelID) {
        super();
        // init player basic info
        this.playerID = playerID;
        this.playerName = playerName;
        this.gamePoint = 0;
        this.royalPoint = 0;
        this.hotelID = hotelID;
        this.brown = 1;
        this.white = 1;
        this.red = 1;
        this.black = 1;

        // draw 6 servers to hand
        this.serverOnHand = [];
        for(let i=0; i<6; i++){
            this.drawServer(this.playerID);
        }
        // prepare hotel
    }
}