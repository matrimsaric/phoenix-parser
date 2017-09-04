import { Injectable } from '@angular/core';

export enum AFFILIATION_NAMES{
    NONE = 0,
    DEN = 1,
    HEX = 2,
    FLZ = 3,
    FEL = 4,
    FCN = 5,
    USN = 6,
    IMP = 7,
    GTT = 8,
    SMS = 9,
    FET = 10,
    CAL = 11,
    CIA = 12,
    BHD = 13,
    DOM = 14,
    WKM = 15,
    DTR = 16,
    AFT = 17,
    GCE = 18,
    RIP = 19,
    MRC = 20
}

@Injectable()
export class UserService {
    primaryAffiliation: AFFILIATION_NAMES = AFFILIATION_NAMES.DEN;// initially just set later versions will be user set
    alliedAffiliations: AFFILIATION_NAMES[] = [AFFILIATION_NAMES.FLZ, AFFILIATION_NAMES.HEX];
    hostileAffiliations: AFFILIATION_NAMES[] = [];


}