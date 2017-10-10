import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';

declare var chrome:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('customecode') customecode;

  constructor(private cdr: ChangeDetectorRef) {
    chrome.runtime.sendMessage({messageType: "askSettings"}, function(response) {
      this.settings = response;
      this.cdr.detectChanges();
      this.customecode.fn_initialize();
    }.bind(this));
  }

  settings={running:false, clicktohide:{}};
  public ngAfterViewInit(){
  }

  fn_change_running() {
    this.settings.running=!this.settings.running;
	  chrome.runtime.sendMessage({messageType: "setSettings", type:"running", value:this.settings.running});
  }

}
