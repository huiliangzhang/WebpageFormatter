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

  editingTip="Add new website ...";
  editing;
  fn_open(link, editable){
    if(this.editmode && editable)
    {
      if(this.editing == link)
      {
        this.editing=null;
        this.editingTip="Add new website ...";
      }
      else
      {
        this.editing=link;
        this.newlink.title=link.title;
        this.newlink.value=link.value;
        this.editingTip="Update "+link.title;
      }

      this.cdr.detectChanges();

    }
    else
    {
      window.open(link.value, '_blank');
    }
  }

  selectable: boolean = true;
  removable: boolean = true;
  remove(dlink: any): void {
    let index = this.settings.favlinks.customlinks.indexOf(dlink);

    if (index >= 0) {
      if(this.editing == this.settings.favlinks.customlinks[index])
      {
        this.newlink.title='';
        this.newlink.value='';
        this.editing=null;
      }
      this.settings.favlinks.customlinks.splice(index, 1);
  	  chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});
    }
  }

  newlink={title:'', value:''};
  capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
  fn_upset() {
    this.newlink.title=this.newlink.title.trim();
    this.newlink.value=this.newlink.value.trim();
    if(!this.newlink.title || !this.newlink.value)
    {
      return;
    }

    if(this.editing)
    {
      this.editing.title=this.newlink.title;
      this.editing.value=this.newlink.value;
    }
    else
    {
      this.editing={title:this.newlink.title, value:this.newlink.value};
      this.settings.favlinks.customlinks.push(this.editing);
    }
    this.editing.title=this.capitalizeFirstLetter(this.editing.title);
    if(!/:\/\//.test(this.editing.value))
    {
      this.editing.value="http://"+this.editing.value;
    }

    this.settings.favlinks.customlinks.sort(function(a, b){ return a.title>b.title });
	  chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});

    this.newlink.title='';
    this.newlink.value='';
    this.editing=null;
  }

  editmode=false;
  fn_editmode() {
    this.editmode=!this.editmode;
    this.editing=null;
    this.newlink.title='';
    this.newlink.value='';
  }

}
