import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// our services
import { GlobalService, UserService, ParserService, DamageService } from './app-resources/services/index';

// our primary application routes
import {routing, appRoutingProviders } from './app-routes/app.routes';

// third party modules
import { AgGridModule } from "ag-grid-angular/main";
import { MaterialModule } from '@angular/material';


import { AppComponent } from './app.component';
import { ModalDialogComponent } from './app-dialog/modal-dialog/modal-dialog.component';
import { SourceComponent } from './modules/admin/source/source.component';
import { DataComponent } from './modules/admin/data/data.component';
import { FleetComponent } from './modules/reports/fleet/fleet.component';
import { GridComponent } from './modules/reports/grid/grid.component';
import { ShipComponent } from './modules/reports/ship/ship.component';
import { TestComponent } from './modules/reports/test/test.component';
import { OverviewComponent } from './modules/reports/overview/overview.component';
import { OverviewCardComponent } from './modules/reports/overview-card/overview-card.component';


@NgModule({
  declarations: [
    AppComponent,
    ModalDialogComponent,
    DataComponent,
    SourceComponent,
    FleetComponent,
    GridComponent,
    ShipComponent,
    TestComponent,
    OverviewComponent,
    OverviewCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    RouterModule,
    AgGridModule.withComponents([]),
    routing
  ],
  providers: [
    GlobalService,
    UserService,
    ParserService,
    DamageService,
    appRoutingProviders
],
  bootstrap: [AppComponent]
})
export class AppModule { }
