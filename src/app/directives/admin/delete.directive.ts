import { HttpErrorResponse } from '@angular/common/http';
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { DeleteDialogComponent, DeleteState } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { Alertifyoptions, AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { HttpClientService, RequestParameters } from 'src/app/services/common/http-client.service';
import { ProductService } from 'src/app/services/common/models/product.service';


declare var $: any;
@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective {

  constructor(
    private element: ElementRef, //Direktifi kullandıgımız html nesnesi neyse onu ykaalyırouz.
    private _renderer: Renderer2, //Dom elementlerine manipule etmek için.
    private httpClientService: HttpClientService,
    private spinner: NgxSpinnerService,
    private alertify:AlertifyService,
    private dialogService:DialogService
  ) {
    const img = _renderer.createElement("img");
    img.setAttribute("src", "../../../../assets/delete.png");
    img.setAttribute("style", "cursor:pointer;");
    img.width = 25;
    img.height = 25;
    _renderer.appendChild(element.nativeElement, img);

  }
  @Input() id: string;  //Bu ınput porduct list html de appDelete deki Sil butonundaki [id] den gelmektedir.  
  @Output() callback: EventEmitter<any> = new EventEmitter();    //Bu callback Product list html de tanımlanan fonksiyon
  @Input() controller:string; // Bu inputu productlist de html de ki Sil butonundaki controller dan gelmektedir. 

  @HostListener("click") //HostListener direktifin kullanıldığı nesneye ne zaman tıklanırsa (DOM NESNESINE TIKLANILDIGINDA)
  onclick() {
     this.dialogService.openDialog({
      componentType:DeleteDialogComponent,
      data:DeleteState.Yes,
      afterClosed:()=>{
        this.spinner.show(SpinnerType.BallAtom);
        const td: HTMLTableCellElement = this.element.nativeElement;
    
        this.httpClientService.delete({ controller: this.controller }, this.id)
          .subscribe(data => {
            $(td.parentElement).animate({
              opacity: 0,
              left: "+=50",
              height: "toggle"
            }, 700, () => {
              this.callback.emit(); // product list HTML'deki sil butonundaki metodu çağırıyor. Amaç silme işleminden sonra grid'i yenilemek.
              this.alertify.message("Ürün Başarıyla Silinmiştir.",{
                dismissOthers:true,
                messageType:MessageType.Success,
                position:Position.TopRight
              })
            });
          },(errorResponse:HttpErrorResponse)=>{
            this.spinner.hide(SpinnerType.BallAtom);
            this.alertify.message("Ürünü silirken beklenmeyen bir hatayla karşılaşıldı!",{
              dismissOthers:true,
              messageType:MessageType.Error,
              position:Position.TopRight
            });
          });
      }
     })
  }
  

  // openDialog(afterClosed: any): void { //Burada bu metodda sorulan modalda evet  dendiğinde onclick metodundaki kodları bu metoda verebilirdik. Fakat biz 
  //   //Callback fonksiyon ile tanımladık. Bir metod parametre bekleyip ve onun sonucunu bekliyorsak ()=>{} ile callback fonksiyon tamnımlayabiliyoruz.
  //   const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //     width: '250px',
  //     data: DeleteState.Yes,
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result == DeleteState.Yes) {
  //       afterClosed();
  //     }
  //   });
  // }
}
