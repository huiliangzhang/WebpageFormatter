import { Component, OnInit, Input } from '@angular/core';

declare var chrome:any;

@Component({
  selector: 'app-imagehoving',
  templateUrl: './imagehoving.component.html',
  styleUrls: ['./imagehoving.component.css']
})
export class ImagehovingComponent implements OnInit {

  @Input() settings: any;

  keys=[
    {title:'ALT', value:'alt'},
    {title:'CONTROL', value:'control'},
    {title:'SHIFT', value:'shift'},
    {title:'META', value:'meta'}
  ];

  constructor() {
  }

  ngOnInit() {
  }

  fn_change() {
	  chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});
  }

  fn_change_running() {
    this.settings.imagehoving.running=!this.settings.imagehoving.running;
	  chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});
  }

}
