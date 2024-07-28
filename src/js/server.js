// Server class definition
class Server {
    constructor(serverID) {
        // init server basic info
        this.serverID = serverID;
        this.serverName = serverNameByID[this.serverID];
        this.serverDescription = serverDescriptionByID[this.serverID];
        this.serverCost = serverCostByID[this.serverID];
        this.serverType = serverTypeByID[this.serverID];
    }
}