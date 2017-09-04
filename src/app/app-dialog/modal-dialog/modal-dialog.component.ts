// Adjusted from original code written by
// https://github.com/tixdo/ng2-modal

import {    Component,
  ViewEncapsulation,
  ComponentRef,
  ComponentFactoryResolver,
  ComponentFactory,
  ViewContainerRef,
  ViewChild,
  ElementRef,
  Input,
  EventEmitter,
  Output} from '@angular/core';

import { DialogDirective } from '../dialog-directive';

@Component({
  selector: 'modal',
  template: `<h1>modal here</h1>`,
//   template: `
// <div class="modal fade" [open]="!isOpen" id="myModal"  [attr.data-keyboard]="true" [attr.data-backdrop]="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
//   <div class="modal-dialog" role="document" [ngStyle]="{'width': modalWidth + 'px', 'height': modalHeight + 'px'}" >
//     <div class="modal-content">
//       <div class="modal-header" [hidden]=!modalHeader>
//         <button type="button" class="close" data-dismiss="modal" (click)='close()' aria-label="Close"><span aria-hidden="true">&times;</span></button>
//         <h4 class="modal-title text-center" id="myModalLabel">{{modalTitle}}</h4>
//       </div>
//       <div class="modal-body">
//       <div [hidden]=!modalMessage>
//       {{message}}
//       </div>
//         <div #child >
//         </div>
//       </div>
//       <div class="modal-footer" [hidden]=!modalFooter>
//       <span [hidden]=!okButton >
//         <button [hidden]=!okButton class="btn btn-primary" (click)="submit()">{{okButtonText}}</button>
//         </span>
//         <span [hidden]=!cancelButton >
//         <button [hidden]=!cancelButton class="btn btn-primary" (click)="close()">{{cancelButtonText}}</button>
//         </span>
//       </div>
//     </div>
//   </div>
// </div>
// `,
  providers: [],
  encapsulation: ViewEncapsulation.None
})
/**
* API to an open modal window.
*/
export class ModalDialogComponent {
  @ViewChild('child', { read: ViewContainerRef }) contentContainer: ViewContainerRef;
  @Output() public modalOutput: EventEmitter<any> = new EventEmitter();

  // @Input() open: any;

  dialogComponentRef: any;
  public modalWidth: number = 500;
  public modalHeight: number = 300;

  /**
     * Caption for the title.
     */
  public modalTitle: string;
  /**
    * component which is to be loaded dynamically.
    */
  public component: any;
  /**
     * Describes if the modal contains Ok Button.
     * The default Ok button will close the modal and emit the callback.
     * Defaults to true.
     */
  public okButton: boolean = true;
  /**
     * Caption for the OK button.
     * Default: Ok
     */
  public okButtonText: string = 'Ok';
  /**
     * Describes if the modal contains cancel Button.
     * The default Cancelbutton will close the modal.
     * Defaults to true.
     */
  public cancelButton: boolean = true;
  /**
     * Caption for the Cancel button.
     * Default: Cancel
     */
  public cancelButtonText: string = 'Cancel';
  /**
     * if the modalMessage is true it will show the message inside modal body.
     */
  public modalMessage: boolean = true;
  /**
     * Some message/content can be set in message which will be shown in modal body.
     */
  public message: string;
  /**
    * if the value is true modal footer will be visible or else it will be hidden.
    */
  public modalFooter: boolean = true;
  /**
    * shows modal header if the value is true.
    */
  public modalHeader: boolean = true;
  /**
    * if the value is true modal will be visible or else it will be hidden.
    */


  public isOpen: boolean = false;
  /**
    * Emitted when a ok button was clicked
    * or when close method is called.
    */

  constructor(private resolver: ComponentFactoryResolver) {
  }
  /**
       * Opens a modal window creating backdrop.
       * @param component The angular Component that is to be loaded dynamically(optional).
       */
  open(component?) {
      this.isOpen = true;
      if (component) {
         let dialogComponentFactory = this.resolver.resolveComponentFactory(component);

          this.dialogComponentRef = this.contentContainer.createComponent(dialogComponentFactory,0, this.contentContainer.injector);

          
          // to access the created instance use
          // this.compRef.instance.someProperty = 'someValue';
      }
  }
  /**
     *  close method dispose the component, closes the modal and optionally emits modalOutput value.
     */
  close(data?: any) {
      this.ngOnDestroy();
      if (data) {
          this.modalOutput.emit(data);
      }
  }

  closeClean() {
      this.ngOnDestroy();
  }
  /**
     *  ok method dispose the component, closes the modal and emits true.
     */
  submit() {


      this.ngOnDestroy();
      this.modalOutput.emit(true);
  }
  /**
     *  dispose method dispose the loaded component.
     */
  ngOnDestroy() {

      this.isOpen = false;

      if(this.dialogComponentRef){
        this.dialogComponentRef.destroy();
      }
  }

}
