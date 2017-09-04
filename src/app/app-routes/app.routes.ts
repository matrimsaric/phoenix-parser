import { Routes, RouterModule } from '@angular/router';

// our module routes
import { SourceComponent } from '../modules/admin/source/source.component';
import { DataComponent } from '../modules/admin/data/data.component';
import { FleetComponent } from '../modules/reports/fleet/fleet.component';
import { GridComponent } from '../modules/reports/grid/grid.component';
import { OverviewComponent } from '../modules/reports/overview/overview.component';
import { TestComponent } from '../modules/reports/test/test.component';


const appRoutes: Routes = [
    { path: 'home', component: SourceComponent },
    { path: 'dataentry', component: DataComponent },
    { path: 'fleetreports', component: FleetComponent },
    { path: 'gridreports', component: GridComponent },
    { path: 'overviewreports', component: OverviewComponent },
    { path: 'goldfish', component: TestComponent },
    // { path: 'tablelist/:id', component: AppFrameManagerComponent },
    // { path: 'variables/:id', component: AppFrameManagerComponent },
    // { path: 'entity/:id', component: AppFrameManagerComponent },
    // { path: 'dataset/:id', component: AppFrameManagerComponent },
    { path: '**', component: SourceComponent }// will show when routing fails
];

export const appRoutingProviders: any[] = [
];

export const routing = RouterModule.forRoot(appRoutes);

