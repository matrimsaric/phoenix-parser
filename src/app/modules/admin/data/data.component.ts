import { Component } from '@angular/core';

import { GlobalService  } from '../../../app-resources/services/global.service';

// use parser here
import { ParserService } from '../../../app-resources/services/parser.service';

@Component({
    selector: 'den-parser-data',
    templateUrl: './data.component.html'
})

export class DataComponent {
    private pasteddata: string = "";
    private battlereport: string = "";


    constructor(private _globals: GlobalService,
                private _parser: ParserService){

    }

    loadData(inputData: any): void{
        this._globals.battleReport = inputData.value;
        this.pasteddata = inputData.value;

        this._parser.parseReport();
    }
}