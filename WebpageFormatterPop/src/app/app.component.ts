import { Component, ChangeDetectorRef } from '@angular/core';

declare var chrome:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private cdr: ChangeDetectorRef) {
  }

  settings={running:false};
  public ngAfterViewInit(){
    chrome.runtime.sendMessage({messageType: "askSettings"}, function(response) {
      this.settings = response;
      this.cdr.detectChanges();
    }.bind(this));
  }

  fn_change_running() {
    this.settings.running=!this.settings.running;
	  chrome.runtime.sendMessage({messageType: "setSettings", type:"running", value:this.settings.running});
  }

}
