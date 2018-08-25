import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';

declare var chrome:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './_app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('tools') tools;
  @ViewChild('customcode') customcode;
  @ViewChild('transfer') transfer;

  @ViewChild('link_tools') link_tools;
  @ViewChild('link_customcode') link_customcode;
  @ViewChild('link_transfer') link_transfer;

  settings={running:false, starttab:'tools'};
  firstTime=true;
  constructor(private cdr: ChangeDetectorRef) {
    chrome.runtime.sendMessage({messageType: "askSettings"}, function(response) {
      this.settings = response;
      this['link_'+this.settings.starttab].nativeElement.click();
      this.info.version = chrome.app.getDetails().version;
    }.bind(this));
  }
  ngOnInit() {}
  public ngAfterViewInit(){
  }

  fn_change_running() {
    this.settings.running=!this.settings.running;
	  chrome.runtime.sendMessage({messageType: "setSettings", type:"running", value:this.settings.running});
  }

  changeTab(tab) {
    if(!this.firstTime){
      if(this.settings.starttab==tab){
        return;
      }

      this.settings.starttab=tab;
      chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});
    }
    this.firstTime=false;

    this[tab].fn_initialize(this.settings);
  }

  info={version:''}

}
