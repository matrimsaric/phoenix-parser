import {    Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation } from '@angular/core';




// our files. JIT handled by new app-modules so list used components as opposed to primary components
// import { HomeAboutComponent } from './features/HOME/source/HOME-about/HOME-about.component';
// import { AppExceptionComponent } from './app-resources/exceptions/app-exception.component';
// import { ModalDialogComponent } from './common/component/dialog/modal-dialog.component';
// import {    GlobalService, 
//             ConnectionService,
//             MessagingService,
//             CacheService } from './app-services/index';




export type LayoutDirection = 'ltr' | 'rtl';
const window: any = {};

@Component({
selector: 'den-parser',
encapsulation: ViewEncapsulation.None,
templateUrl: './app.component.html',
styleUrls: [ './app.component.css' ]
})

export class AppComponent  implements OnInit, OnDestroy {


winUser: string = 'not set';
selectedLocale: string = "";
dir: LayoutDirection = "ltr";
showModal: boolean = false;


// @ViewChild(ModalDialogComponent) modal;

constructor(    ) {



}

ngOnInit(): void {


}


// when app closes remember to disconnect from server
ngOnDestroy(): void{

}

closeConnection(): void {

}

openHelpAbout(): void {
// this.modal.modalTitle = this.localization.translate("HELP_ABOUT");
// this.modal.okButton = true;
// this.modal.cancelButton = false;
// this.modal.modalMessage = true;
// this.modal.open(HomeAboutComponent);// pass in a component to populate the modal

}

openExceptionWindow(): void{
// this.modal.modalTitle = this.localization.translate("EXCEPTION");
// this.modal.okButton = true;
// this.modal.cancelButton = false;
// this.modal.modalMessage = true;
// this.modal.open(AppExceptionComponent);// pass in a component to populate the modal

}






}


