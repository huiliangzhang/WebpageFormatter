import { Component, OnInit, ViewChild } from '@angular/core';
declare var chrome:any;

import {DataSource} from '@angular/cdk/collections';
import {MdSort} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-customcode',
  templateUrl: './customcode.component.html',
  styleUrls: ['./customcode.component.css']
})
export class CustomcodeComponent implements OnInit {

  settings;

  @ViewChild(MdSort) sort: MdSort;

  constructor() {}
  ngOnInit() {}

  displayedColumns = ['enabled', 'edit', 'name', 'websites', 'delete'];
  dataSource: CustomCodeDataSource | null;
  customCodeDatabase = new CustomCodeDatabase();

  fn_initialize(settings) {
    this.settings=settings;
    if(!this.settings.autorun.customcodes || this.settings.autorun.customcodes.length==0)
    {
      this.settings.autorun.customcodes =
      [
        {id:'sample-1', name:'Hide all images on Yahoo', websites:'yahoo.com', script:'Array.from(document.getElementsByTagName("img")).forEach(function(x) {x.style.visibility="hidden"});\nwindow.addEventListener("scroll",function(e) {\n    Array.from(document.getElementsByTagName("img")).forEach(function(x) {x.style.visibility="hidden"});\n});\n', activated:false},
      ];
    }

    this.customCodeDatabase.clear();
    for(var i=0;i<this.settings.autorun.customcodes.length;i++)
    {
      this.customCodeDatabase.add(this.settings.autorun.customcodes[i]);
    }

    this.dataSource = new CustomCodeDataSource(this.customCodeDatabase, this.sort);

  }

  fn_delete(element){

    let index = this.settings.autorun.customcodes.indexOf(element);
    if (index >= 0) {
      this.settings.autorun.customcodes.splice(index, 1);
      this.customCodeDatabase.remove(element);
  	  chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});

	    chrome.runtime.sendMessage({messageType: "notifyEditor", value:{event:'sf_delete_autocode_from_extension', attached:{detail:element}}});
    }
  }

  fn_edit(element){
      window.open('https://www.swiftformatter.com/autocode'+(element?'?id='+element.id:''), '_blank');
  }

  fn_change_activated(element)
  {
	  chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});
	  chrome.runtime.sendMessage({messageType: "notifyEditor", value:{event:'sf_update_autocode_from_extension', attached:{detail:element}}});
  }
}

export interface CustomCodeElement {
  id: string;
  name: string;
  websites: string;
  script: string;
  activated:boolean;
}

export class CustomCodeDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<CustomCodeElement[]> = new BehaviorSubject<CustomCodeElement[]>([]);
  get data(): CustomCodeElement[] { return this.dataChange.value; }

  constructor() {}

  add(element) {
    const copiedData = this.data.slice();
    copiedData.push(element);
    this.dataChange.next(copiedData);
  }

  remove(element) {
    const copiedData = this.data.slice();
    let index = copiedData.indexOf(element);
    if(index>=0)
    {
      copiedData.splice(index, 1);
      this.dataChange.next(copiedData);
    }
  }

  clear() {
    const copiedData = this.data.slice();
    copiedData.length=0;
    this.dataChange.next(copiedData);
  }

}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, CustomCodeDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class CustomCodeDataSource extends DataSource<any> {
  constructor(private _CustomCodeDatabase: CustomCodeDatabase, private _sort: MdSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<CustomCodeElement[]> {
    const displayDataChanges = [
      this._CustomCodeDatabase.dataChange,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  getSortedData(): CustomCodeElement[] {
    const data = this._CustomCodeDatabase.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'activated': [propertyA, propertyB] = [a.activated?1:0, b.activated?1:0]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'websites': [propertyA, propertyB] = [a.websites, b.websites]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
