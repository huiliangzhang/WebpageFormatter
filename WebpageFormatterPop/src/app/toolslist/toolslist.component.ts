import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

declare var chrome:any;

@Component({
  selector: 'app-toolslist',
  templateUrl: './toolslist.component.html',
  styleUrls: ['./toolslist.component.css']
})
export class ToolslistComponent implements OnInit {

  @Input() settings: any;

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {}

  hovering={value:''};
  fn_hover(dlink) {
    this.hovering.value=dlink?dlink.value:'';
    this.cdr.detectChanges();
  }
  fn_open(url){
    window.open(url, '_blank');
  }

  selectable: boolean = true;
  removable: boolean = true;
  remove(dlink: any): void {
    let index = this.settings.customlinks.indexOf(dlink);

    if (index >= 0) {
      this.settings.customlinks.splice(index, 1);
    }
  }

  fn_add() {

  }

}
