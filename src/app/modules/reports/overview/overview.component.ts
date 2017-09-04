import { Component, Input, OnInit } from '@angular/core';

import { Fleet } from '../../../app-resources/oob/fleet';
import { GlobalService  } from '../../../app-resources/services/global.service';

@Component({
    selector: 'den-parser-reports-overview',
    templateUrl: './overview.component.html'

})

export class OverviewComponent implements OnInit {
    private fleets: Fleet[];

    constructor(
        private _globals: GlobalService
    ){

    }

    ngOnInit(): void{
        this.fleets = this._globals.individualFleets;
    }
}