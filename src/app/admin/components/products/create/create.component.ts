import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_Product } from 'src/app/contracts/create_product';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private spiner: NgxSpinnerService,
    private alertify: AlertifyService
  ) { super(spiner) }

  ngOnInit(): void {
  }
  //Ekleme işlemi ypaıldığında gride direkt yansıması için EventEmitter yapısını kullanıyoruz.
  @Output() createdProduct: EventEmitter<Create_Product> = new EventEmitter();

  //Output olmasının sebebi dışarıya bir parametre göndereceğimiz için.  fileUploadOptions ismi html de [options] olarak işaretlendi. Ve bu işaretlenme
  //FileUpload component de   @Input() options: Partial<FileUploadOptions>; olarak yer almaktadır. Burada Output diğer tarafda Input
  @Output() fileUploadOptions: Partial<FileUploadOptions> = {
    action: "upload",
    controller: "products",
    explanation: "Resimleri sürükleyin veya seçin...",
    isAdminPage: true,
    accept:".png,.jpg,.jpeg"
  };

  create(name: HTMLInputElement, stock: HTMLInputElement, price: HTMLInputElement) {
    const create_product: Create_Product = new Create_Product();
    create_product.Name = name.value;
    create_product.Stock = parseInt(stock.value);
    create_product.Price = parseFloat(price.value);

    this.productService.create(create_product, () => {
      this.hideSpinner(SpinnerType.BallAtom);
      this.alertify.message("Ürün Başarıyla Eklenmiştir.", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight
      });
      this.createdProduct.emit(create_product);//Selector üzerinden bağlı olduğu componente fırlatıyor. 
    }, errorMessage => {
      this.alertify.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      })
    });
  }

}
