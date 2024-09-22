import { Component, Input, OnInit } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { DialogService } from '../dialog.service';
import { FileUploadDialogComponent, FileUploadDialogState } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  constructor(
    private httpClientService: HttpClientService,
    private alertify: AlertifyService,
    private customToastr: CustomToastrService,
    private dialogService: DialogService,
    private spinner:NgxSpinnerService


  ) { }

  public files: NgxFileDropEntry[];
  @Input() options: Partial<FileUploadOptions>;



  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();

    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });
    }
    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: () => {
        // this.spinner.show(SpinnerType.BallAtom);
        this.httpClientService.post({
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({
            "responseType": "blob"
          })
        }, fileData).subscribe(data => {
          const message: string = "Dosyalar başarıyla yüklenmiştir.";
          if (this.options.isAdminPage) {
            this.alertify.message(message, {
              dismissOthers: true,
              messageType: MessageType.Success,
              position: Position.TopRight
            });
          } else {
            this.customToastr.message(message, "Başarılı", {
              messageType: ToastrMessageType.Success,
              position: ToastrPosition.TopRight
            });
          }
        // this.spinner.show(SpinnerType.BallAtom);

        }, (errorResponse: HttpErrorResponse) => {
        // this.spinner.hide(SpinnerType.BallAtom);
          const message: string = "Dosyalar yüklenirken beklenmeyen bir hatayla karşılaşılmıştır.";
          if (this.options.isAdminPage) {
            this.alertify.message(message, {
              dismissOthers: true,
              messageType: MessageType.Error,
              position: Position.TopRight
            });
          } else {
            this.customToastr.message(message, "Başarısız", {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopRight
            });
          }

        });
      }
    })
  }


}



export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean = false;
}
