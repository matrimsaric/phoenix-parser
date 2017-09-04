import { UserService, AFFILIATION_NAMES } from './user.service';
import { GlobalService } from './global.service';
import { Injectable } from '@angular/core';

import { Weapon } from '../oob/weapon';
import { Armour } from '../oob/armour';



@Injectable()
export class DamageService {
    round: number = 1;
    targetShipArmour: number = 0;
    targetShipPlates: number = 0;
    targetShipShieldFactors: number = 0;
    targetShipShieldDepth: number = 0;
    targetShipScintillators: number = 0;
    targetShipDamageTaken: number = 0;
    targetShipArmourDamageTaken: number = 0;
    targetShipWorkingArmour: number = 0;
    savedArmour: Armour;
    savedWeapon: Weapon[];
    isVerbose: boolean = true;
    results: string;
    workingSingleDamage: number = 0;
    targetArmourPlateCoeffecient = 1;


    runDamageTest(wpn: Weapon[], targetArmour: Armour, targetShields: number, targetScints: number, targetPlates: number, totalShips: number, verbose: boolean): string {

        // reset defaults in case of re-running

        this.results = "";
        this.targetShipArmour = 0;
        this.targetShipPlates = 0;
        this.targetShipShieldFactors = 0;
        this.targetShipShieldDepth = 0;
        this.targetShipScintillators = 0;
        this.targetShipDamageTaken = 0;
        this.targetShipArmourDamageTaken = 0;
        this.targetShipWorkingArmour = 0;
        this.workingSingleDamage = 0;
        

        // now we can execute our test - bit by bit
        
        this.savedWeapon = wpn;
        this.savedArmour = targetArmour;
        this.isVerbose = verbose;
        this.targetShipPlates = targetPlates;
        this.targetShipScintillators = targetScints;
        this.targetArmourPlateCoeffecient = this.savedArmour.armourFactors / targetPlates;// this number multiplied by burnt plates indicates armour removed


        this.targetShipArmour = targetArmour.armourFactors;
        this.targetShipWorkingArmour = this.targetShipArmour;

        // each ship attacks indiviudally
        for (var z: number = 1; z <= totalShips; z++) {
            this.buildResults(`Ship Number ${z} is attacking - `, true);
            this.round = 0;
            // an attack runs for 4 rounds each weapon group fires seperately
            for (var a: number = 0; a < 4; a++) {
                this.round += 1;
                //this.buildResults(`Round ${this.round} starting`, true);

                for (var b: number = 0; b < wpn.length; b++) {
                    //// temp check - run each weapon seperately
                    //for(var c: number = 1; c <= wpn[b].amount; c++){
                      //  console.log("WpN:" + c);
                        
                        this.buildResults(`Weapon Group[${b}]: ${wpn[b].amount} * ${wpn[b].name}`, false);
                    this.workingSingleDamage = wpn[b].damageDone;
                    // wpnry accuracy impacts before anything else and reduces effectiveness of grouping
                    this.adjustForAccuracy(wpn[b]);

                    // wpnry hits shields first.


                    // wpnry hits scintillators second
                    this.adjustForScints(wpn[b]);

                    // wpnry hits armour third
                    this.adjustForArmour(wpn[b]);

                    // wpnry damages finally
                    this.adjustForDamage(wpn[b]);


                    //}
                    

                }



            }
        }

        return this.results;
    }

    private adjustForAccuracy(wpn: Weapon): void {
        this.buildResults(`Single Shot Damage would be ${this.workingSingleDamage} totalling:${this.workingSingleDamage * wpn.amount}`, false);

        if (wpn.accuracy < 100) {
            this.workingSingleDamage = (this.workingSingleDamage / 100) * wpn.accuracy;
            this.buildResults(`Accuracy loss to  ${this.workingSingleDamage} totalling: ${this.workingSingleDamage * wpn.amount}`, false);
        }
    }

    private adjustForScints(wpn: Weapon): void {
        // scints average out to half the indicated value
        var scintDepth = this.targetShipScintillators / 2;

        if (scintDepth > 0) {
            this.workingSingleDamage = this.workingSingleDamage - scintDepth;
            this.buildResults(`Scints reduce damage done by: ${scintDepth} so individually: ${this.workingSingleDamage} Totalling: ${this.workingSingleDamage * wpn.amount}`, false);

        }
    }

    private adjustForDamage(wpn: Weapon): void {
        // total alls hits hull/internals
        
        var totalRoundDamage: number = this.workingSingleDamage * wpn.amount;
        this.targetShipDamageTaken = this.targetShipDamageTaken + totalRoundDamage;

        this.buildResults(`Results Round: ${this.round} for ${wpn.amount} * ${wpn.name}`, false);
        this.buildResults(`Weapon Group did ${this.workingSingleDamage} per shot and ${totalRoundDamage} total damage`, false);

        this.buildResults(` Enemy ship has taken ${this.targetShipDamageTaken} in total`, false);

        this.statDump();
    }

    private calcArmourResilience(): number {
        var sumIt: number = 0;

        sumIt = (this.savedArmour.armourFactors / this.targetShipArmourDamageTaken) * 100;

        return Math.round(sumIt);
    }

    private adjustForArmour(wpn: Weapon): void {
        var armourDepth = this.targetShipWorkingArmour / 2;

        if (armourDepth > 0) {
            // each shot will absorb the armour depth (as an average)
            if (this.workingSingleDamage > armourDepth) {
                // store that value as armour burnt
                this.workingSingleDamage = this.workingSingleDamage - armourDepth;
                if (this.workingSingleDamage < 0) {
                    this.workingSingleDamage = 0;
                }

                //total damage blocked by armour is
                var totalDamageBlocked: number = armourDepth * wpn.amount;


                this.targetShipArmourDamageTaken += totalDamageBlocked;

                // check if we have lost any plates. If we have lost plates then the armour depth for the next shot will be lower
                var thisRoundPlatesLost: number =  Math.round((totalDamageBlocked / this.savedArmour.burntFactor));
                var platesLostSoFar: number = (this.targetShipArmourDamageTaken / this.savedArmour.burntFactor);
                var factorHit: number = this.calcArmourDrop(platesLostSoFar);

                if (factorHit > 0) {
                    this.targetShipWorkingArmour = this.targetShipArmour - factorHit;
                    console.log("target working armour = " + this.targetShipWorkingArmour);
                }



                this.buildResults(`Single Damage down to ${this.workingSingleDamage}, total armour damage is: ${totalDamageBlocked} burning ${thisRoundPlatesLost} plates - new armour total:${this.targetShipWorkingArmour}`, false);


            }
            else {
                //total damage blocked by armour is
                var totalDamageBlocked: number = this.workingSingleDamage * wpn.amount;

                //in this example only armour will get burnt off
                this.workingSingleDamage = 0;
                this.targetShipArmourDamageTaken = this.targetShipArmourDamageTaken + totalDamageBlocked;
                var thisRoundPlatesLost: number =  Math.round((totalDamageBlocked / this.savedArmour.burntFactor));
                // check if we have lost any plates. If we have lost plates then the armour depth for the next shot will be lower
                var platesLostSoFar: number = (this.targetShipArmourDamageTaken / this.savedArmour.burntFactor);
                var factorHit: number = this.calcArmourDrop(platesLostSoFar);

                if (factorHit > 0) {
                    this.targetShipWorkingArmour = this.targetShipArmour - factorHit;
                    console.log("target working armour = " + this.targetShipWorkingArmour);
                }


                this.buildResults(`Single Damage down to ${this.workingSingleDamage}, total armour damage is: ${totalDamageBlocked} burning ${thisRoundPlatesLost} plates`, false);

            }



        }

    }

    calcArmourDrop(platesLost: number): number{
        
        if(platesLost > 0){
            var deduct:number = this.targetArmourPlateCoeffecient * platesLost;

            if(deduct > 0){
                return Math.round(deduct);
            }
        }
        return 0;

    }


    buildResults(addThis: string, mustAdd: boolean) {
        if (mustAdd || this.isVerbose) {
            this.results = this.results + "\r\n" + addThis;
        }
    }

    statDump(): void {
        if(this.round == 4 || this.isVerbose){
            var tot: number = this.savedArmour.armourFactors;
            var pla: number = this.targetShipArmourDamageTaken / this.savedArmour.burntFactor;

            var rem: number = tot - pla;
            var perc: number = 0;

            if (pla >= 1) {
                perc = Math.round((rem / tot) * 100);
            }
            var st: string = `Armour Depth [start](current) -effectiveness% [${tot}](${rem}) - ${perc}%   Ship Damage: ${this.targetShipDamageTaken} Plates Burnt: ${pla}`;

            if(perc < 0){
                st = `Armour Depth [start](0) -0% [${tot}](${rem})    Ship Damage: ${this.targetShipDamageTaken} All Plates Burnt`;
            }
            this.buildResults(" ************************************** ", true);
            this.buildResults(st, true);
            this.buildResults(" ************************************** ", true);
        }
        

    }



}