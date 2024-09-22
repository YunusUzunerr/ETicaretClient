import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from 'src/app/contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Product } from 'src/app/contracts/list_product';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private httpClientService: HttpClientService,

  ) { }

  create(product: Create_Product, successCallBack?: () =>void, errorCallBack?: (errorMessage:string)=>void) {
    this.httpClientService.post({
      controller: "products"
    }, product).subscribe(result => {
      successCallBack();
    }, (errorResponse: HttpErrorResponse) => { 
      // Fluent validation'dan dönen hata mesajı HttpErrorResponse olarak döner.
      const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error; 
      // Dictionary yapısında döndüğünden key-value şeklinde yakalanıyor.
      let message = "";
      _error.forEach((v, index) => {
        v.value.forEach((_v, _index) => {
          message += `${_v}<br>`;
        });
      });
      // Hata durumunda geri dönüş
      errorCallBack(message);
    });
  }

  async read(page=0,size:number=5 ,successCallBack?:()=>void,errorCallBack?:(errorMessage:string)=>void):Promise<{totalCount:number;products: List_Product[]}>{

   const promiseData :Promise<{totalCount:number;products: List_Product[]}> = this.httpClientService.get<{totalCount:number;products: List_Product[]}>({
      controller:"products",
      queryString:`page=${page}&size=${size}`
    }).toPromise();

    promiseData.then(d=>successCallBack()).catch((errorResponse:HttpErrorResponse)=>errorCallBack(errorResponse.message))
    return await promiseData;
  }
  
async delete(id:string){
   const deleteObservable:Observable<any> = this.httpClientService.delete<any>({
    controller:"products"
  },id);

  var a = await firstValueFrom(deleteObservable);
}


}
