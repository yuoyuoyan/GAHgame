// Guest class definition
class Guest {
    constructor(guestID, tableID){
        this.guestID = guestID;
        this.guestName = guestNameByID[guestID];
        this.guestDescription = guestDescriptionByID[guestID];
        this.guestRequirementNum = guestRequirementNumByID[guestID];
        this.guestRequirement = guestRequirementByID[guestID];
        this.guestBonusType = guestBonusTypeByID[guestID];
        this.guestBonusGamePoint = guestBonusGamePointByID[guestID];
        this.guestColor = guestColorByID[guestID];
        this.guestSatisfied = false;
        this.guestFoodServed = [];
        for(let i=0; i<this.guestRequirement.length; i++){
            this.guestFoodServed.push(0);
        }
        this.guestFoodServedNum = 0;
        this.guestTableID = tableID;
    }
}