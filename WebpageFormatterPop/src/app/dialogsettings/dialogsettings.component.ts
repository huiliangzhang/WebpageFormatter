import { Component, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dialogsettings',
  templateUrl: './dialogsettings.component.html',
  styleUrls: ['./dialogsettings.component.css']
})
export class DialogsettingsComponent {

  tempparameters=[];
  constructor(
    public dialogRef: MatDialogRef<DialogsettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.tempparameters=JSON.parse(JSON.stringify(this.data.parameters));
  }

  onCloseClick(status): void {
    if(status == true){
      this.data.parameters = this.tempparameters;
    }
    this.dialogRef.close(status);
  }

}


