export class Armour {
    name: string;
    armourFactors: number;
    burntFactor: number;

    constructor(newName: string, newCode: number, newArmourFactors: number, newBurntFactor: number){
        this.name = newName;
        this.armourFactors = newArmourFactors;
        this.burntFactor = newBurntFactor;
    }
}