import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';


import { Weapon } from '../oob/weapon';
import { Armour } from '../oob/armour';
import { Hull } from '../oob/hull';


@Injectable()
export class SourceService  {
    private _dataUrl = '/assets/source/weapon-types.json';
    private _armourUrl = '/assets/source/armour-types.json';
    private _hullUrl = '/assets/source/hull-types.json';
    public currentVersion:string =  "0.0.0";

    constructor( private _http: Http){

    }

    public loadAllWeaponData() : Observable<Weapon[]> {
        return this._http.get(this._dataUrl)
            .map((response: Response) => <Weapon[]>response.json())
            // .do(data => console.log("RopeData: " + JSON.stringify(data)))
            .catch(error => this.handleError(error));
    }

    public loadAllArmourData() : Observable<Armour[]> {
        return this._http.get(this._armourUrl)
            .map((response: Response) => <Armour[]>response.json())
            // .do(data => console.log("RopeData: " + JSON.stringify(data)))
            .catch(error => this.handleError(error));
    }

    public loadAllHulls() : Observable<Hull[]> {
        return this._http.get(this._hullUrl)
            .map((response: Response) => <Hull[]>response.json())
            // .do(data => console.log("RopeData: " + JSON.stringify(data)))
            .catch(error => this.handleError(error));
    }

    
    private handleError(error: any){
        // translate error message into valid json
         var retError: any = error;
         var retErrorBody: any = JSON.parse(retError._body);

        
        
        return Observable.throw(error.json().error || 'Server error');
    }

}
