import { AFFILIATION_NAMES } from '../services/user.service';

export enum ARMOUR_TYPE{
    HEAVY_ABLATIVE = 1,
    MEDIUM_ABLATIVE = 2,
    LIGHT_ABLATIVE = 3,
    MEDIUM_PLATE = 4,
    HEAVY_PLATE = 5,
    LIGHT_PLATE = 6,
    NONE = 7,
    UNKNOWN = 8,
    ADVANCED_HEAVY = 9
}

export class Ship{
    name: string;
    affiliation: AFFILIATION_NAMES;
    affiliationString: string;
    id: number;
    class: string;
    armourType: ARMOUR_TYPE = ARMOUR_TYPE.UNKNOWN;
    armourTypeString:string =  "Unknown";
    currentArmour: number = 0;
    currentHullDamage: number = 0;
    currentScints: number = 0;
    currentShields: number = 0;
    currentShieldDepth: number = 0;

    actualDamageGeneratedTotal: number = 0;
    actualPotentialDamageGenerated: number = 0;

    opposedCount: number = 0;
    actualDamageReceivedTotal: number = 0;
    actualPotentalDamageReceivedTotal: number = 0;

    riskFactor: number = 0;
    shipProtectionFactor: number = 0;
    shipOffensivePotential: number = 0;
    shipDefensiveWeakness: number = 0;

    sqdnGuesstimatedDamage: number = 0;
    sqdnGuestimatedArmourBurn: number = 0;
    sqdnGuestimatedShieldLoss: number = 0;
    sqdnGuestimatedArmourSoak: number = 0;
    sqdnGuestimatedShieldSoak: number = 0;
    sqdnGuestimatedScintSoak: number = 0;

    primaryReference: boolean = true;// primary references have their own entry in report or summary. Secondaries are targetted by reports that are only used if the sec ship has blown up
    enemyShips: number[] = [];
    enemyShipsName: string[] = [];
    enemyShipsDamage: number[] = [];

    destroyed: boolean = false;
    destroyedString: string = "NO";
    
    logShip(): void{

        console.warn(`Ship id (${this.id}) Name: ${this.name} Affiliation: ${this.affiliation} of class ${this.class}`);
        console.log(`Armour: ${this.getArmourType()}`);
        console.log(`Armour Depth: ${this.currentArmour} Scintillators: ${this.currentScints} Shields: ${this.currentShields} Depth: ${this.currentShieldDepth} `);
        console.log(`Photon Battery IV Vulnerability: ${this.getDamageSoaksPercentage(475)} Photon Cannon IV Vulnerability: ${this.getDamageSoaksPercentage(120)}`);
        console.log(`Hull Damage Percentage ${this.currentHullDamage}%`);
        console.error(`Total Damage Received ${this.actualDamageReceivedTotal} out of ${this.actualPotentalDamageReceivedTotal} : Vulnerability: ${this.getDamagePassedThroughProtection()}`);
        console.info(`Total Damage Caused ${this.actualDamageGeneratedTotal} out of ${this.actualPotentialDamageGenerated} : Effectiveness: ${this.getDamageCausedThroughProtection()}`);
        if (this.destroyed) {
            console.error(`Ship Destroyed no further threat/help`);
        }
    }



    buildFactors(): void{
        // ship protection factor is based around vulernability to a photon cannon IV attack
        this.shipProtectionFactor = 100 - this.getDamageSoaksNumber(120);
        this.shipDefensiveWeakness = (this.actualDamageReceivedTotal / this.actualPotentalDamageReceivedTotal) * 100;
        this.armourTypeString = this.getArmourType();

        // offensive potential is simply damage % that got through and hurt enemy
        this.shipOffensivePotential = (this.actualDamageGeneratedTotal / this.actualPotentialDamageGenerated) * 100;
        if(this.destroyed){
            this.destroyedString = "YES";
        }
    }

    getArmourType(): string{
        switch(this.armourType){
            case ARMOUR_TYPE.HEAVY_ABLATIVE:
                return "B - Heavy Ablative Armour";
             case ARMOUR_TYPE.MEDIUM_ABLATIVE:
                return "D - Medium Ablative Armour";
             case ARMOUR_TYPE.LIGHT_ABLATIVE:
                return "F - Light Ablative Armour";
            case ARMOUR_TYPE.HEAVY_PLATE:
            return "C - Heavy Plate";
            case ARMOUR_TYPE.MEDIUM_PLATE:
            return "E - Medium Plate";
            case ARMOUR_TYPE.LIGHT_PLATE:
            return "G - Light Plate";
            case ARMOUR_TYPE.ADVANCED_HEAVY:
            return "A - Advanced Heavy Armour"
            case ARMOUR_TYPE.NONE:
            return "H - No Armour"
            default:
            return "Unknown";
        }
    }
    getDamageSoaks(damageApplied: number): number{
        // first up a battery. Does 475 base
        var endDamageApplied: number = damageApplied;
        var totalDamageApplied: number = damageApplied;


        //half shield Depth
        if(this.currentShieldDepth > 0){
            endDamageApplied = endDamageApplied - (this.currentShieldDepth /2);

        }

        if(this.currentScints > 0){
            endDamageApplied = endDamageApplied - (this.currentScints /2);

        }

        if(this.currentArmour > 0){
            endDamageApplied = endDamageApplied - (this.currentArmour /2);

        }

        

        return endDamageApplied;
        
    }

    getDamageSoaksNumber(damageApplied: number): number{
        var damageThrough = this.getDamageSoaks(damageApplied);

        var batNumber:  number = (damageThrough/damageApplied) * 100;

        return batNumber;
    }

    getDamageSoaksPercentage(damageApplied: number): string{
        var damageThrough = this.getDamageSoaks(damageApplied);

        var batNumber:  number = (damageThrough/damageApplied) * 100;

        return batNumber + "%";
    }

    getDamagePassedThroughProtection(): string {
        var damageThroughPercentage: number = (this.actualDamageReceivedTotal / this.actualPotentalDamageReceivedTotal) * 100;

        if(this.actualPotentalDamageReceivedTotal == 0){
            return "0%";
        }
        if (damageThroughPercentage >= 0 && damageThroughPercentage <= 100) {
            return damageThroughPercentage + "%";
        }
        else {
            return "100%";
        }
    }

    getDamageCausedThroughProtection(): string {
        var damageThroughPercentage: number = (this.actualDamageGeneratedTotal / this.actualPotentialDamageGenerated) * 100;

        if(this.actualPotentialDamageGenerated == 0){
            return "0%";
        }

        if (damageThroughPercentage >= 0 && damageThroughPercentage <= 100) {
            return damageThroughPercentage + "%";
        }
        else {
            return "100%";
        }
        
    }

    getAffiliationImage(): string{
        return `/assets/images/affiliation/${this.affiliationString}.png`;
    }
    
}