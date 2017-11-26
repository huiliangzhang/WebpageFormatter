import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';

declare var chrome:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('customcode') customcode;
  @ViewChild('transfer') transfer;

  constructor(private cdr: ChangeDetectorRef) {
    chrome.runtime.sendMessage({messageType: "askSettings"}, function(response) {
      this.settings = response;
      this.cdr.detectChanges();
    }.bind(this));
  }

  ngOnInit() {}

  settings={running:false, clicktohide:{}, imagehoving:{}, autorun:{}, starttab:0};
  public ngAfterViewInit(){
  }

  fn_change_running() {
    this.settings.running=!this.settings.running;
	  chrome.runtime.sendMessage({messageType: "setSettings", type:"running", value:this.settings.running});
  }

  selectedTab;
  fn_selectedTabChange(e:any) {
    this.settings.starttab=e.index;
	  chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});

    this.selectedTab='';
    if(e.index==1)
    {
        this.selectedTab='customcode';
        this.customcode.fn_initialize(this.settings);
    }
    else if(e.index==2)
    {
      this.transfer.fn_initialize(this.settings);
    }
  }

}
