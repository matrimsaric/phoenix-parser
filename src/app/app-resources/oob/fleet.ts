import { AFFILIATION_NAMES } from '../services/user.service';
import { Ship } from './ship';

export enum FLEET_TYPE{
    OWN = 0,
    ALLIED = 1,
    HOSTILE = 2,
    NEUTRAL = 3,
    NONE = 4
}

export class Fleet{
    fleetAffiliation: AFFILIATION_NAMES = AFFILIATION_NAMES.NONE;
    private affiliationShips: Ship[] = [];// list of ships inside this affiliations ships
    private alliedShips: Ship[] = [];// list of ships inside this affiliations ships
    private affilKeys: string = "|";
    private alliedKeys: string = "|";
    private affiliationImage: string;

    fleetCount: number = 0;
    fleetTotalPotentialDamageDone: number = 0;
    fleetTotalActualDamageDone: number = 0;
    fleetTotalPotentialDamageReceived: number = 0;
    fleetTotalActualDamageReceived: number = 0;
    shipsDestroyed: number = 0;
    extremeRisk: number = 0;// 60%-100% hull damage
    highRisk: number = 0;// 40%-60% hull damage
    mediumRisk: number = 0;// 20%-40% hull damage
    lowRisk: number = 0;// 10%-20% hull damage
    noRisk: number = 0;// 0% damage
    fleetName: string = "name";

    fleetCountPercent: number = 0;
    fleetTotalPotentialDamageDonePercent: number = 0;
    fleetTotalActualDamageDonePercent: number = 0;
    fleetTotalPotentialDamageReceivedPercent: number = 0;
    fleetTotalActualDamageReceivedPercent: number = 0;
    shipsDestroyedPercent: number = 0;

    fleettype: FLEET_TYPE = FLEET_TYPE.NONE;

    constructor(primaryAffiliation: AFFILIATION_NAMES ){
        this.fleetAffiliation = primaryAffiliation;
    }

    addShip(newShip: Ship){
        var searchKey: string = `|${newShip.id}|`
        if(newShip.affiliation == this.fleetAffiliation){
            if(this.affilKeys.indexOf(searchKey) < 0){
                this.affiliationShips.push(newShip);
                this.addKey(false, newShip.id.toString());
                this.adjustFleetTotals(newShip);
            }
          
            
        }
        else{
            if(this.alliedKeys.indexOf(searchKey) < 0){
                this.alliedShips.push(newShip);
                this.adjustFleetTotals(newShip);
                this.addKey(true, newShip.id.toString());
            }
        }


        
    }

    private adjustFleetTotals(newShip: Ship){

        if(this.affiliationShips && this.affiliationShips.length == 1){
            this.affiliationImage = newShip.getAffiliationImage();
            this.fleetName = newShip.affiliationString;
        }
        this.fleetCount += 1;
        this.fleetTotalPotentialDamageDone += newShip.actualPotentialDamageGenerated;
        this.fleetTotalActualDamageDone += newShip.actualDamageGeneratedTotal;
        this.fleetTotalPotentialDamageReceived += newShip.actualPotentalDamageReceivedTotal;
        this.fleetTotalActualDamageReceived += newShip.actualDamageReceivedTotal;

        if(newShip.destroyed){
            this.shipsDestroyed += 1;
        }
        else if(newShip.currentHullDamage < 1){
            this.noRisk += 1;
        }
        else if(newShip.currentHullDamage >= 1 && newShip.currentHullDamage < 20){
            this.lowRisk += 1;
        }
        else if(newShip.currentHullDamage >= 20 && newShip.currentHullDamage < 40){
            this.mediumRisk += 1;
        }
        else if(newShip.currentHullDamage >= 40 && newShip.currentHullDamage < 60){
            this.highRisk += 1;
        }
        else {
            this.extremeRisk += 1;
        }
    }



    getAffiliationShips(): Ship[]{
        return this.affiliationShips;
    }

    getAlliedShips(): Ship[]{
        return this.alliedShips;
    }

    private addKey(allied: boolean, key: string){
        if(allied){
            this.alliedKeys = this.alliedKeys + key + "|";
        }
        else{
            this.affilKeys = this.affilKeys + key + "|";
        }
    }
} 