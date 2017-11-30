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
    if(this.settings.starttab==tab && !this.firstTime){
      return;
    }
    this.firstTime=false;

    this.settings.starttab=tab;
	  chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});

    this.internal_initialize_tab(tab);
  }
  internal_initialize_tab(tab){
    this[tab].fn_initialize(this.settings);
  }


}
