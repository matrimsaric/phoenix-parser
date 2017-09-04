import { Component, ViewChild, SimpleChange } from '@angular/core';

// txt classes
import { ModalDialogComponent } from '../../../app-dialog/modal-dialog/modal-dialog.component';
import { Ship, ARMOUR_TYPE } from '../../../app-resources/oob/ship';
import { GlobalService  } from '../../../app-resources/services/global.service';



@Component({
    selector: 'den-parser-reports-ship',
    templateUrl: './ship.component.html'

})


export class ShipComponent  {

    ship:Ship;
    modal: ModalDialogComponent;
    version: string = "0.1.0";
    build: string = "0.0.54211.089445";
    server: string = "VMRDDEVDATAONE\MSSQL2014";
    servertype: string = "MS SQL Server";
    intlSupport: boolean;
    private backer: string = "White";
    private showDestroyed: boolean = null;

    constructor( public _modal: ModalDialogComponent,
                private _globals: GlobalService)
    {
        
        this.modal = _modal;

    }

    ngOnInit(): void{
        this.ship = this._globals.ship;

        if(this.ship.destroyed){
            this.backer =  `/assets/images/deadskull.png`;
            this.showDestroyed = true;
        }

     }

}