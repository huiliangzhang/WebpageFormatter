import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';

declare var chrome:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './_app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('customcode') customcode;
  @ViewChild('transfer') transfer;

  constructor(private cdr: ChangeDetectorRef) {
    chrome.runtime.sendMessage({messageType: "askSettings"}, function(response) {
      this.settings = response;
      this.changeTab(this.settings.starttab);
      this.cdr.detectChanges();
    }.bind(this));
  }

  ngOnInit() {}

  settings={running:false, clicktohide:{}, imagehoving:{}, autorun:{}, starttab:'tools'};
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

  changeTab(title) {
    if(!title){
      return;
    }

    this.settings.starttab=title;
	  chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});

    if(title=='customcode')
    {
      this.customcode && this.customcode.fn_initialize(this.settings);
    }
    else if(title=='settings')
    {
      this.transfer && this.transfer.fn_initialize(this.settings);
    }
  }


}
