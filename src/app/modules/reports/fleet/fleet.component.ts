import { Component } from '@angular/core';

import { GlobalService  } from '../../../app-resources/services/global.service';

import { Fleet } from '../../../app-resources/oob/fleet';
import { Ship, ARMOUR_TYPE } from '../../../app-resources/oob/ship';

@Component({
    selector: 'den-parser-reports-fleet',
    templateUrl: './fleet.component.html'
})

export class FleetComponent {
    private displayedFleet: Ship[];

    private viewOwn: boolean = true;
    private viewAllied: boolean = true;
    private viewHostile: boolean = true;

    constructor(private _globals: GlobalService){
        
        //this.displayedFleet = _globals.hostileFleet.getAffiliationShips();
    }

    changeViewedFleet(choice: string): void{
        switch(choice){
            case "own":
            this.displayedFleet = this._globals.ownFleet.getAffiliationShips();
            break;
            case "allied":
            this.displayedFleet = this._globals.ownFleet.getAlliedShips();
            break;
            case "hostile":
            this.displayedFleet = this._globals.hostileFleet.getAlliedShips();
            break;
        }
    }
}