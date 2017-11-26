import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { CustomcodeComponent } from './customcode/customcode.component';
import { ToolslistComponent } from './toolslist/toolslist.component';
import { TransferComponent } from './transfer/transfer.component';
import { DialogsettingsComponent } from './dialogsettings/dialogsettings.component';
import { AutocodeparameterrenderComponent } from './autocodeparameterrender/autocodeparameterrender.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomcodeComponent,
    ToolslistComponent,
    TransferComponent,
    DialogsettingsComponent,
    AutocodeparameterrenderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  entryComponents: [
    DialogsettingsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
