import { Injectable } from '@angular/core';

import { Fleet } from '../oob/fleet';
import { Ship } from '../oob/ship';



@Injectable()
export class GlobalService {
    battleReport: string;

    ownFleet: Fleet;
    hostileFleet: Fleet;
    otherFleet: Fleet;

    ship: Ship;

    individualFleets: Fleet[] = [];

}