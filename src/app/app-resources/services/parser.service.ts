import { UserService, AFFILIATION_NAMES } from '../services/user.service';
import { GlobalService } from '../services/global.service';
import { Injectable } from '@angular/core';

import { Fleet, FLEET_TYPE } from '../oob/fleet';
import { Ship, ARMOUR_TYPE } from '../oob/ship';

enum PARSE_TYPE{
    NONE = 0,
    SHIP = 1,
    PLATFORM = 2,
    CLASS = 3,
    PROTECTION = 4,
    HULL = 5,
    ATTACKING = 6,
    TARGETED = 7,
    RESULT = 8
}

@Injectable()
export class ParserService{
    private ownFleet: Fleet;
    private hostileFleet: Fleet;
    private otherFleet: Fleet;

    constructor(private _globals:GlobalService,
                private _user: UserService){
                    this.ownFleet = new Fleet(this._user.primaryAffiliation);
                    this.hostileFleet = new Fleet(AFFILIATION_NAMES.NONE);
                    this.otherFleet = new Fleet(AFFILIATION_NAMES.NONE);
                }

    parseReport(){
        var report = this._globals.battleReport;
        var htmlstring: string = report.replace(/(\r\n|\n|\r)/gm, "<br>");
        var lines = htmlstring.split('<br>');
        var lineType: PARSE_TYPE = PARSE_TYPE.NONE;
        var lineCount = 0;
        var currentShip: Ship = new Ship();

        for(var a = 0; a < lines.length; a++){
            var worker = lines[a].trim();
            if(worker.endsWith("Ship")){
                if(currentShip.id > 0){
                    // add ship to relevant list
                    currentShip.buildFactors();
                    this.assignShip(currentShip);
                }
                lineType = PARSE_TYPE.SHIP;
                currentShip = new Ship();
                lineCount = 0;    
            }
            else if(worker.endsWith("Platform")){
                if(currentShip.name != ""){
                    currentShip.logShip();
                }
                lineType = PARSE_TYPE.PLATFORM;
                lineCount = 0
      
            }
            else if(lineCount == 1){
                lineType = PARSE_TYPE.CLASS;
            }
            else if(worker.startsWith("Armour")){
                lineType = PARSE_TYPE.PROTECTION;
            }
            else if(worker.startsWith("Hull")){
                lineType = PARSE_TYPE.HULL;
            }
            else if(worker.startsWith("Targeted by")){
                lineType = PARSE_TYPE.TARGETED;
            }
             else if(worker.startsWith("Attacking")){
                lineType = PARSE_TYPE.ATTACKING;
            }
            else{
                lineType = PARSE_TYPE.RESULT;
            }

            switch(lineType){
                case PARSE_TYPE.SHIP:
                    this.parseShip(currentShip, worker);
                break;
                case PARSE_TYPE.CLASS:
                    this.parseClass(currentShip, worker);
                    break;
                case PARSE_TYPE.PROTECTION:
                    this.parseArmour(currentShip, worker);
                    break;
                case PARSE_TYPE.HULL:
                    this.parseHull(currentShip, worker);
                    break;
                case PARSE_TYPE.TARGETED:
                    this.parseTargetedBy(currentShip, worker);
                    break;
                case PARSE_TYPE.ATTACKING:
                    this.parseAttacking(currentShip, worker);
                    break;
                case PARSE_TYPE.RESULT:
                    this.parseResult(currentShip, worker);
                    break;
            }
            

            lineCount += 1;
            
        }
        // when we hop out add the last ship running so we don't miss the last..
        if (currentShip.id > 0) {
            // add ship to relevant list
            currentShip.buildFactors();
            this.assignShip(currentShip);
        }


        this._globals.ownFleet = this.ownFleet;
        this._globals.hostileFleet = this.hostileFleet;
        this._globals.otherFleet = this.otherFleet;

        this.analyseFleets();// sort out individual fleet percentages

    }

    private parseShip(currShip: Ship, rptLine: string): void{
        // syntax will be {AFFIL} { NAME } {(ID)} -  Ship
        
        // all affiliation tags are 3 long
        var affil: string = rptLine.substring(0,3);
        

        // next setup line by removing affil
        var worker = rptLine.substring(4);
        // and end text
        worker = worker.substring(0, worker.length - 7);

        // next get the last opening brackets
        var searcher: number = worker.lastIndexOf("(");

        var shipIdString = worker.substring(searcher);
        var shipIdString2 = shipIdString.replace("(", "").replace(")","");

        var shipId: number =+ shipIdString2;

        // remove the number
        worker = worker.replace(shipIdString,"");

        // what is left should be just the ship name
        var shipName = worker;

        // adjust current Ship
        currShip.id = shipId;
        currShip.name = shipName;
        currShip.affiliation = this.getAffiliationType(affil);
        currShip.affiliationString = affil;

        


    }

    private parseClass(currShip: Ship, rptLine: string): void{
        // syntax will be {CLASS} {{Armour Type}}
        var searcher: number = rptLine.lastIndexOf("{");

        var armour = rptLine.substring(searcher);
        armour = armour.replace("{","").replace("}","");

        switch(armour){
            case "Heavy Ablative Armour":
                currShip.armourType = ARMOUR_TYPE.HEAVY_ABLATIVE;
                break;
            case "Medium Ablative Armour":
                currShip.armourType = ARMOUR_TYPE.MEDIUM_ABLATIVE;
                break;
            case "Light Ablative Armour":
                currShip.armourType = ARMOUR_TYPE.LIGHT_ABLATIVE;
                break;
            case "Advanced Heavy Armour":
                currShip.armourType = ARMOUR_TYPE.ADVANCED_HEAVY;
                break;
            case "Heavy Armour":
                currShip.armourType = ARMOUR_TYPE.HEAVY_PLATE;
                break;
            case "Medium Armour":
                currShip.armourType = ARMOUR_TYPE.MEDIUM_PLATE;
                break;
            case "Light Armour":
                currShip.armourType = ARMOUR_TYPE.LIGHT_PLATE;
                break;
            case "No Armour":
                currShip.armourType = ARMOUR_TYPE.NONE;
                break;
        }

        // remainder is the class
        currShip.class = rptLine.substring(0, searcher - 1);
    }

    private parseArmour(currShip: Ship, rptLine: string): void{
        // syntax will be 'Armour: {armour} Scints: {scints (if any)} Shield: {ShieldFactors(Shield Depth)}
        var armSearch: number = rptLine.indexOf("Armour:");
        var scintSearch: number = rptLine.indexOf("Scints:");
        var shieldSearch: number = rptLine.indexOf("Shields:");

        var armExist: boolean = rptLine.includes("Armour:");
        var scintExist: boolean = rptLine.includes("Scints:");
        var shieldExist: boolean = rptLine.includes("Shields:");

        var arm: number = 0;
        var scint: number = 0;
        var shieldStrength: number = 0;
        var shieldDepth: number = 0;

        // sort armour
        if(armExist && !scintExist && !shieldExist){
            arm =+ rptLine.replace("Armour: ","");
        }
        if(armExist && scintExist){
            arm =+ rptLine.substring(0,scintSearch).replace("Armour: ","");
        }
        if(armExist && !scintExist && shieldExist){
            arm =+ rptLine.substring(0,shieldSearch).replace("Armour: ","");
        }

        // sort scints
        if(scintExist){
            if (shieldExist) {
                // split out to start of scints
                var splitOne: string = rptLine.substring(scintSearch);
                // relook for Shields
                var littleShieldSearch: number = splitOne.indexOf("Shields:");
                var next: string = splitOne.substring(0, littleShieldSearch-1);
                
                scint = + splitOne.substring(0, littleShieldSearch-1).replace("Scints: ","");
            }
            else{
                scint =+ rptLine.substring(scintSearch).replace("Scints: ","");
            }

        }

        // sort Shields
        if(shieldExist){
            // split out string
            var worker = rptLine.substr(shieldSearch);
            // remove shields text
            worker = worker.replace("Shields: ","");

            var miniSearch: number = worker.indexOf("(");

            if(miniSearch > 0){
                shieldStrength =+ worker.substring(0, miniSearch-1);
                shieldDepth =+ worker.substring(miniSearch).replace("(","").replace(")","");
            }
            else{
                shieldStrength =+ worker;
            }

        }

        currShip.currentArmour = arm;
        currShip.currentScints = scint;
        currShip.currentShieldDepth = shieldDepth;
        currShip.currentShields = shieldStrength;



    }

    private parseHull(currShip: Ship, rptLine: string): void{
        // syntax Hull Damage: {hull damage}%
        var worker: string = rptLine.replace("Hull Damage: ","").replace("%","");

        currShip.currentHullDamage =+ worker;
    }

    private parseTargetedBy(currShip: Ship, rptLine: string): void{
        // syntax will be 'Targeted by {AFFIL} {NAME} ({id}) - {actual damage} [{potential damage}] Damage

        var worker: string = rptLine.replace("Targeted by ", "");
        worker = worker.substring(0, worker.length - 7);

        var affil = worker.substring(0,3);
        var afftype: AFFILIATION_NAMES = this.getAffiliationType(affil);
        
        worker = worker.substring(3);

        var search: number = worker.indexOf("(");
        

        var enemyName: string = worker.substring(1, search - 1);
        worker = worker.replace(enemyName + " (", "");

        var searchEnd: number = worker.indexOf(")");

        var testString = worker.substring(0, searchEnd);
        var enemyId: number = +  worker.substring(0, searchEnd);

        worker = worker.substring(searchEnd+4);

        // look for square brackets in the remainder
        search = worker.indexOf("[");
        searchEnd = worker.indexOf("]");

        var actualDamage: number =+ worker.substring(0,search-1);
        var fullDamage: number =+ worker.substring(search+1, searchEnd);

        // we need to add the damage to the current ship
        currShip.actualDamageReceivedTotal = currShip.actualDamageReceivedTotal + actualDamage;
        currShip.opposedCount += 1;
        currShip.actualPotentalDamageReceivedTotal = currShip.actualPotentalDamageReceivedTotal + fullDamage;

        // todo might need to generate a ghost ship report if needed later
        currShip.enemyShips.push(enemyId);
        currShip.enemyShipsName.push(affil + " " + enemyName);
        currShip.enemyShipsDamage.push(actualDamage);
        
    }

    private parseAttacking(currShip: Ship, rptLine: string): void {
        // syntax will be 'Targeted by {AFFIL} {NAME} ({id}) - {actual damage} [{potential damage}] Damage

        var worker: string = rptLine.replace("Attacking ", "");
        worker = worker.substring(0, worker.length - 7);

        var affil = worker.substring(0, 3);
        var afftype: AFFILIATION_NAMES = this.getAffiliationType(affil);

        worker = worker.substring(3);

        var search: number = worker.indexOf("(");


        var enemyName: string = worker.substring(1, search - 1);
        worker = worker.replace(enemyName + " (", "");

        var searchEnd: number = worker.indexOf(")");

        var testString = worker.substring(0, searchEnd);
        var enemyId: number = +  worker.substring(0, searchEnd);

        worker = worker.substring(searchEnd + 4);

        // look for square brackets in the remainder
        search = worker.indexOf("[");
        searchEnd = worker.indexOf("]");

        var actualDamage: number = + worker.substring(0, search - 1);
        var fullDamage: number = + worker.substring(search + 1, searchEnd);

        // we need to add the damage to the current ship
        currShip.actualDamageGeneratedTotal = currShip.actualDamageGeneratedTotal + actualDamage;
        currShip.actualPotentialDamageGenerated = currShip.actualPotentialDamageGenerated + fullDamage;


    }

    private parseResult(currShip: Ship, rptLine: string): void {
        if (rptLine.startsWith("BLOWN UP") || rptLine.startsWith("INTEGRITY")){
            currShip.destroyed = true;
        }
    }



    private getAffiliationType(aff: string) : AFFILIATION_NAMES{
        switch(aff){
            case "DEN":
                return AFFILIATION_NAMES.DEN;
            case "HEX":
                return AFFILIATION_NAMES.HEX;
            case "FLZ":
                return AFFILIATION_NAMES.FLZ;
            case "FEL":
                return AFFILIATION_NAMES.FEL;
            case "FCN":
                return AFFILIATION_NAMES.FCN;
            case "USN":
                return AFFILIATION_NAMES.USN;
            case "IMP":
                return AFFILIATION_NAMES.IMP;
            case "GTT":
                return AFFILIATION_NAMES.GTT;
            case "SMS":
                return AFFILIATION_NAMES.SMS;
            case "FET":
                return AFFILIATION_NAMES.FET;
            case "CAL":
                return AFFILIATION_NAMES.CAL;
            case " CIA":
                return AFFILIATION_NAMES.CIA;
            case "BHD":
                return AFFILIATION_NAMES.BHD;
            case "DOM":
                return AFFILIATION_NAMES.DOM;
            case "WKM":
                return AFFILIATION_NAMES.WKM;
            case "DTR":
                return AFFILIATION_NAMES.DTR;
            case "AFT":
                return AFFILIATION_NAMES.AFT;
            case "GCE":
                return AFFILIATION_NAMES.GCE;
            case "RIP":
                return AFFILIATION_NAMES.RIP;
            case "MRC":
                return AFFILIATION_NAMES.MRC;
        }

        return AFFILIATION_NAMES.NONE;

    }

    private analyseFleets(): void{
        // start with own and allied
        var totalShips: number = 0;
        var totalPotentialDamageCaused: number = 0;
        var totalActualDamageCaused: number = 0;
        var totalPotentialDamageReceived: number = 0;
        var totalActualDamageReceived: number = 0;
        var shipsDestroyed: number = 0;

        for(var a: number = 0; a < this._globals.individualFleets.length; a++){
            if(this._globals.individualFleets[a].fleettype == FLEET_TYPE.ALLIED
                || this._globals.individualFleets[a].fleettype == FLEET_TYPE.OWN){
                    totalShips += this._globals.individualFleets[a].fleetCount;
                    totalPotentialDamageReceived += this._globals.individualFleets[a].fleetTotalPotentialDamageReceived;
                    totalActualDamageReceived += this._globals.individualFleets[a].fleetTotalActualDamageReceived;
                    totalPotentialDamageCaused += this._globals.individualFleets[a].fleetTotalPotentialDamageDone;
                    totalActualDamageCaused += this._globals.individualFleets[a].fleetTotalActualDamageDone;
                    shipsDestroyed += this._globals.individualFleets[a].shipsDestroyed;
                }
        }
        for(var a: number = 0; a < this._globals.individualFleets.length; a++){
            if(this._globals.individualFleets[a].fleettype == FLEET_TYPE.ALLIED
                || this._globals.individualFleets[a].fleettype == FLEET_TYPE.OWN){
                    this._globals.individualFleets[a].fleetCountPercent = Math.round((this._globals.individualFleets[a].fleetCount / totalShips) * 100);

                    this._globals.individualFleets[a].fleetTotalPotentialDamageReceivedPercent = Math.round((this._globals.individualFleets[a].fleetTotalPotentialDamageReceived / totalPotentialDamageReceived) * 100);
                    this._globals.individualFleets[a].fleetTotalActualDamageReceivedPercent = Math.round((this._globals.individualFleets[a].fleetTotalActualDamageReceived / totalActualDamageReceived) * 100);
                    this._globals.individualFleets[a].fleetTotalPotentialDamageDonePercent = Math.round((this._globals.individualFleets[a].fleetTotalPotentialDamageDone / totalPotentialDamageCaused) * 100);
                    this._globals.individualFleets[a].fleetTotalActualDamageDonePercent = Math.round((this._globals.individualFleets[a].fleetTotalActualDamageDone / totalActualDamageCaused) * 100);

                    this._globals.individualFleets[a].shipsDestroyedPercent = Math.round((this._globals.individualFleets[a].shipsDestroyed / shipsDestroyed) * 100);
                }
        }

        totalShips = 0;
        totalPotentialDamageCaused = 0;
        totalActualDamageCaused = 0;
        totalPotentialDamageReceived = 0;
        totalActualDamageReceived = 0;
        shipsDestroyed = 0;

        for(var a: number = 0; a < this._globals.individualFleets.length; a++){
            if(this._globals.individualFleets[a].fleettype == FLEET_TYPE.HOSTILE){
                    totalShips += this._globals.individualFleets[a].fleetCount;
                    totalPotentialDamageReceived += this._globals.individualFleets[a].fleetTotalPotentialDamageReceived;
                    totalActualDamageReceived += this._globals.individualFleets[a].fleetTotalActualDamageReceived;
                    totalPotentialDamageCaused += this._globals.individualFleets[a].fleetTotalPotentialDamageDone;
                    totalActualDamageCaused += this._globals.individualFleets[a].fleetTotalActualDamageDone;
                    shipsDestroyed += this._globals.individualFleets[a].shipsDestroyed;
                }
        }
        for(var a: number = 0; a < this._globals.individualFleets.length; a++){
            if(this._globals.individualFleets[a].fleettype == FLEET_TYPE.HOSTILE){
                    this._globals.individualFleets[a].fleetCountPercent = Math.round((this._globals.individualFleets[a].fleetCount / totalShips) * 100);

                    this._globals.individualFleets[a].fleetTotalPotentialDamageReceivedPercent = Math.round((this._globals.individualFleets[a].fleetTotalPotentialDamageReceived / totalPotentialDamageReceived) * 100);
                    this._globals.individualFleets[a].fleetTotalActualDamageReceivedPercent = Math.round((this._globals.individualFleets[a].fleetTotalActualDamageReceived / totalActualDamageReceived) * 100);
                    this._globals.individualFleets[a].fleetTotalPotentialDamageDonePercent = Math.round((this._globals.individualFleets[a].fleetTotalPotentialDamageDone / totalPotentialDamageCaused) * 100);
                    this._globals.individualFleets[a].fleetTotalActualDamageDonePercent = Math.round((this._globals.individualFleets[a].fleetTotalActualDamageDone / totalActualDamageCaused) * 100);

                    this._globals.individualFleets[a].shipsDestroyedPercent = Math.round((this._globals.individualFleets[a].shipsDestroyed / shipsDestroyed) * 100);
                }
        }
       
    }

    private assignShip(currentShip: Ship) {
        var fleetType: FLEET_TYPE = FLEET_TYPE.NEUTRAL;
        if (currentShip && currentShip.id > 0) {
            if (currentShip.affiliation == this._user.primaryAffiliation) {
                this.ownFleet.addShip(currentShip);
                fleetType = FLEET_TYPE.OWN;
            }
            else {
                var isAllied: boolean = false;
                for (var a: number = 0; a < this._user.alliedAffiliations.length; a++) {
                    if (this._user.alliedAffiliations[a] == currentShip.affiliation) {
                        this.ownFleet.addShip(currentShip);
                        fleetType = FLEET_TYPE.ALLIED;
                        isAllied = true;
                        break;
                    }
                }
                if (!isAllied) {
                    fleetType = FLEET_TYPE.HOSTILE;
                    this.hostileFleet.addShip(currentShip);
                }
            }

            // finally need to add to individual affiliation fleet structure
            var addNewFleet: boolean = true;

            for(var ct:number = 0; ct < this._globals.individualFleets.length; ct++){
                if(this._globals.individualFleets[ct].fleetAffiliation == currentShip.affiliation){
                    this._globals.individualFleets[ct].addShip(currentShip);
                    addNewFleet = false;
                }

            }

            if (addNewFleet) {
                var newFleet: Fleet = new Fleet(currentShip.affiliation);

                newFleet.fleettype = fleetType;
                newFleet.addShip(currentShip);
                this._globals.individualFleets.push(newFleet);
            }
        }
        
    }
}