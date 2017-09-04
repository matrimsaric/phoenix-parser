import { Component, Input } from '@angular/core';

import { Fleet } from '../../../app-resources/oob/fleet';

@Component({
    selector: 'den-parser-reports-overview-card',
    templateUrl: './overview-card.component.html'

})

export class OverviewCardComponent{
    @Input() fleet: Fleet;
}