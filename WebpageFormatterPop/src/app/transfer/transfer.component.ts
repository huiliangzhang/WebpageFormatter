
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import {MatSnackBar} from '@angular/material';

declare var chrome:any;

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css', '../_app.general.scss']
})
export class TransferComponent implements OnInit {

  @Input() settings:any;
  settingsText;

  constructor(public snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {}
  ngOnInit() {}

  fn_initialize(settings) {
    this.settings=settings;
    this.settingsText=JSON.stringify(this.settings, null, "    ");
  }

  fn_refresh(){
    this.settingsText=JSON.stringify(this.settings, null, "    ");
    this.snackBar.open('The settings JSON is changed to current value!', '', {duration: 5000});
  }
  fn_clear(){
    this.settingsText="";
  }

  fn_copy(){
    this.copyToClipboard(this.settingsText);
  }
  copyToClipboard(text) {
      if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
          var textarea = document.createElement("textarea");
          textarea.textContent = text;
          textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
          document.body.appendChild(textarea);
          textarea.select();
          try {
              document.execCommand("copy");  // Security exception may be thrown by some browsers.
              this.snackBar.open('Copied to clipboard!', '', {duration: 5000});
          } catch (ex) {
              this.snackBar.open('Please use CTRL-C to copy!', '', {duration: 8000});
              return false;
          } finally {
              document.body.removeChild(textarea);
          }
      }
      else
      {
          this.snackBar.open('Please use CTRL-C to copy!', '', {duration: 8000});
      }
  }

  fn_save(){
      this.download(this.settingsText, "PageFormatter.settings.json", "application/json");
  }
  download(data, filename, type) {
      var file = new Blob([data], {type: type});
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }, 0);
  }

  fn_default(){
      var p=JSON.parse(JSON.stringify(this.settings));
      p.favlinks.customlinks=[
        {title:'Facebook', value:'https://www.facebook.com'},
        {title:'Google', value:'https://www.google.com'},
        {title:'Yahoo', value:'https://www.yahoo.com'}
      ];
      p.autorun.customcodes =
      [
      ];
      this.settingsText=JSON.stringify(p, null, "    ");
      this.snackBar.open('The settings JSON is changed to default value!', '', {duration: 5000});
  }

  fn_set(){
      try{
          var p=JSON.parse(this.settingsText);
          if(!p.clicktohide || !p.favlinks || !p.autorun || !p.imagehoving)
          {
              throw "Not a valid setting!";
          }

          this.settings.running=p.running;
          this.settings.clicktohide=p.clicktohide;
          this.settings.favlinks=p.favlinks;
          this.settings.autorun=p.autorun;
          this.cdr.detectChanges();

	        chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});
          this.snackBar.open('The settings JSON has been applied!', '', {duration: 5000});
      }
      catch(error)
      {
          this.snackBar.open('Error: '+error, '', {duration: 8000});
      }
  }


}
