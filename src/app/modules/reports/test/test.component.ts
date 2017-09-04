import { Component, Input, OnInit } from '@angular/core';

import { GlobalService  } from '../../../app-resources/services/global.service';
import { SourceService } from '../../../app-resources/services/source.service';
import { DamageService } from '../../../app-resources/services/damage.service';


import { Weapon } from '../../../app-resources/oob/weapon';
import { Armour } from '../../../app-resources/oob/armour';
import { Hull } from '../../../app-resources/oob/hull';

@Component({
    selector: 'den-parser-reports-goldfish',
    providers: [ SourceService ],
    templateUrl: './test.component.html'

})

export class TestComponent implements OnInit {
    wpns: Weapon[];
    arms: Armour[];
    hulls: Hull[];
    errorMessage: string;
    selectedWeapon: Weapon;
    selectedArmour: Armour;
    stuff: string = "";
    results: string = "";
    addedWeapons: Weapon[] = [];
    savedShields: number = 0;
    savedScints: number = 0;
    savedPlates: number = 0;
    overrideArmour: number = 0;
    isVerbose: boolean = false;


    constructor(
        private _globals: GlobalService,
        private _source: SourceService,
        private _damage: DamageService
    ){

    }

    ngOnInit(): void{
        this._source.loadAllWeaponData()
            .subscribe(wpns => this.wpns = wpns),
            error => this.errorMessage = <any> error;

        this._source.loadAllArmourData()
            .subscribe(arm => this.arms = arm),
            error => this.errorMessage = <any> error;

        this._source.loadAllHulls()
            .subscribe(hull => this.hulls = hull),
            error => this.errorMessage = <any> error;
    }

    private changeWeapon(wpn: Weapon): void{
        this.selectedWeapon = wpn;
    }

    private changeArmour(arm: Armour): void{
        this.selectedArmour = arm;
        this.overrideArmour = this.selectedArmour.armourFactors;

    }

    private hullSize(hull: Hull): void{
        this.savedPlates = hull.plates;
    }

    private addNewWeapon(total: number, percentage: number): void{
        console.log('add weapon ticked');
        this.stuff =  this.stuff + `\r\n Added: ${this.selectedWeapon.name} with accuracy ${percentage}% and amount of ${total} `;
        this.selectedWeapon.accuracy = percentage;
        this.selectedWeapon.amount = total;
        this.addedWeapons.push(this.selectedWeapon);

        // 200 has 317 plates   150 has 262
    }

    private addNewTarget(shields: number, scints: number, armFactor: number): void{
        this.stuff =  this.stuff + `\r\n Added Shield factors: ${shields} and scints: ${scints} and armour: ${this.selectedArmour.armourFactors} of ${this.selectedArmour.name}`
        this.savedPlates = 262;
        this.savedScints = scints;
        this.savedShields = shields;
    }

    private runTest(ships: number, verb: any, arm: number): void{
        console.log('verb:' + verb);
        this.results = "";
        this.selectedArmour.armourFactors = arm;
        this.results = this._damage.runDamageTest(this.addedWeapons, this.selectedArmour, this.savedShields, this.savedScints, this.savedPlates, ships,  verb);
    }
}