export class Weapon {
    name: string;
    code: number;
    damageDone: number;
    isPhotonic: boolean;
    amount: number;
    accuracy: number;

    constructor(newName: string, newCode: number, newDamageDone: number, newIsPhotonic: boolean, newAmount?:number, newAccuracy?: number){
        this.name = newName;
        this.code = newCode;
        this.damageDone = newDamageDone;
        this.isPhotonic = newIsPhotonic;
        this.amount = newAmount;
        this.accuracy = newAccuracy;
    }
}