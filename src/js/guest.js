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
        this.guestFoodServed = guestRequirementByID[guestID];
        for(let i=0; i<this.guestFoodServed.length; i++){
            this.guestFoodServed[i] = 0;
        }
        this.guestFoodServedNum = 0;
        this.guestTableID = tableID;
    }

    // highlight guests if can be served with certain food
    guestHighlightByFoodToServe(foodID, tableID){
        for(let i=0; i<this.guestRequirementNum; i++){
            if(foodID == this.guestRequirement[i]){
                // this guest want this food
                // hightlight block draw
                // change cursor style while hovering, and add event listen
                return;
            }
        }
    }
}