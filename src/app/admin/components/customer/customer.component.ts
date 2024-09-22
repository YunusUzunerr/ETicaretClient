import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent extends BaseComponent implements OnInit {
//BaseComponentin constructorı benden parametre olarak  NgxSpinnerService beklediği için   super(spinner) bu parametreyi yolladık.
//C#'daki :base mantığı ile aynı çalışıyor.   extends BaseComponent ile kalıtım alıyoruz.
constructor(spinner: NgxSpinnerService) 
{ 
  super(spinner) 
}


  ngOnInit(): void {
    this.showSpinner(SpinnerType.BallScaleMultiple);
  }

}
