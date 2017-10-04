import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './routing.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { ClicktotriggerComponent } from './clicktotrigger/clicktotrigger.component';
import { CustomcodeComponent } from './customcode/customcode.component';
import { ToolslistComponent } from './toolslist/toolslist.component';

@NgModule({
  declarations: [
    AppComponent,
    ClicktotriggerComponent,
    CustomcodeComponent,
    ToolslistComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
