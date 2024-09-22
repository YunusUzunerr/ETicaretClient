import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { ComponentsModule } from './components/components.module';
import { DialogsModule } from '../dialogs/dialogs.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LayoutModule,
    ComponentsModule,
    DialogsModule
  ],
  exports:[
    LayoutModule,
    
  ]
})
export class AdminModule { }
