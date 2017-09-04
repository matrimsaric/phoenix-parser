import {    Component,
  OnInit,
  ViewChild,
  ViewEncapsulation } from '@angular/core';

import { GlobalService  } from '../../../app-resources/services/global.service';

import { Fleet } from '../../../app-resources/oob/fleet';
import { Ship, ARMOUR_TYPE } from '../../../app-resources/oob/ship';

// ag-grid
import { AgGridNg2, BaseComponentFactory } from 'ag-grid-angular/main';
import { GridOptions} from 'ag-grid/main';

// modal
import { ModalDialogComponent } from '../../../app-dialog/modal-dialog/modal-dialog.component';
import { ShipComponent } from '../ship/ship.component';


@Component({
selector: 'den-parser-reports-grid',
encapsulation: ViewEncapsulation.None,
templateUrl: './grid.component.html'
})

export class GridComponent implements OnInit{
private displayedFleet: Ship[];

private viewOwn: boolean = true;
private viewAllied: boolean = true;
private viewHostile: boolean = true;

// ag-grid required parameters
private gridOptions: GridOptions;
private showGrid: boolean;
private rowData: any[];
private columnDefs: any[];
private rowCount: string;
private errorMessage: string;


@ViewChild(ModalDialogComponent) modal;

constructor(private _globals: GlobalService){

this.displayedFleet = _globals.hostileFleet.getAffiliationShips();
}

ngOnInit(): void{
this.gridOptions = <GridOptions>{
  onGridReady: () => {
       this.gridOptions.api.sizeColumnsToFit();
   }
};

this.createColumnsDefs();

this.displayedFleet = this._globals.ownFleet.getAffiliationShips();
this.showGrid = true;


}

private createColumnsDefs(){
this.columnDefs = [
  {
      headerName: 'Source',
      children: [
          {headerName: "ID", field: "id" , width: 100},
          {headerName: "Name", field: "name", width: 250},
          {headerName: "Armour Depth", field: "currentArmour", width: 120},
          {headerName: "ArmType", field: "armourTypeString", width: 200},
          {headerName: "Hull Damage", field: "currentHullDamage", width: 120},
          {headerName: "Shield Depth", field: "currentShieldDepth", width: 120},
          {headerName: "Scints", field: "currentScints", width: 120},
          {headerName: "Cau.P.Dmg", field: "actualPotentialDamageGenerated", width: 120},
          {headerName: "Cau.A.Dmg", field: "actualDamageGeneratedTotal", width: 120},
          {headerName: "Rec.P.Dmg", field: "actualPotentalDamageReceivedTotal", width: 120},
          {headerName: "Rec.A.Dmg", field: "actualDamageReceivedTotal", width: 120},
          {headerName: "Risk", field: "riskFactor"},
          {headerName: "Protection Fac.", field: "shipProtectionFactor"},
          { headerName: "Effectiveness", field: "shipOffensivePotential" },
          { headerName: 'BU', field: "destroyedString"},
          { headerName: 'TEST', field: "name", width:250, cellRenderer: nameLink }
      ]
  }
]
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


showAlert(){
alert("alert2");
}

alert2(ev: any){
if(ev.colDef.headerName == "TEST"){
  alert('call me');
}
}

openShipDetail($event: any): void{
this._globals.ship = $event.data;
this.modal.modalTitle = "Ship Details";
this.modal.okButton = true;
this.modal.cancelButton = false;
this.modal.modalMessage = true;
this.modal.open(ShipComponent);// pass in a component to populate the modal
}
}

function nameLink(params){
let result = '<span style="text-decoration: underline; color: blue; cursor:pointer" onClick="this.showAlert();">' + 'test' + '</span>';
return result;
}

function showAlert(){
alert('kerrang');
}