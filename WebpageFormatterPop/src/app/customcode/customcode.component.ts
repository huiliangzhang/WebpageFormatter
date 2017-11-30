import { Component, ChangeDetectorRef, OnInit, ViewChild, Input } from '@angular/core';
declare var chrome:any;
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { DialogsettingsComponent } from '../dialogsettings/dialogsettings.component'

import {DataSource} from '@angular/cdk/collections';
import {MatSort} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-customcode',
  templateUrl: './customcode.component.html',
  styleUrls: ['./customcode.component.css', '../_app.general.scss']
})
export class CustomcodeComponent implements OnInit {

  @Input() settings: any;

  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) {}
  ngOnInit() {}

  displayedColumns = ['activated', 'edit', 'name', 'websites', 'delete'];
  dataSource: CustomCodeDataSource | null;
  customCodeDatabase = new CustomCodeDatabase();

  fn_initialize(settings) {
    this.settings=settings;
    this.customCodeDatabase.clear();
    for(var i=0;i<this.settings.autorun.customcodes.length;i++)
    {
      this.customCodeDatabase.add(this.fn_copy_for_table(this.settings.autorun.customcodes[i]));
    }

    this.dataSource = new CustomCodeDataSource(this.customCodeDatabase, this.sort);

    this.cdr.detectChanges();

  }

  fn_copy_for_table(source){
    return {id:source.id, name:source.name, websites:source.websites, activated:source.activated, describe:source.describe, parameters:source.parameters};
  }

  fn_delete(element){
    for(var i=0; i<this.settings.autorun.customcodes.length; i++){
      if(this.settings.autorun.customcodes[i].id == element.id){
        this.settings.autorun.customcodes.splice(i, 1);

        this.customCodeDatabase.remove(element);
        chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});

        chrome.runtime.sendMessage({messageType: "notifyEditor", value:{event:'sf_delete_autocode_from_extension', attached:{detail:element}}});
        this.cdr.detectChanges();
        return;
      }
    }

  }

  fn_edit(element, mode){
    if(mode == 'setting')
    {
      console.log(element);
      let dialogRef = this.dialog.open(DialogsettingsComponent, {
        width: '360px',
        data: element
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result == true){
          chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});
        }
      });
    }
    else
    {
      window.open('https://www.swiftformatter.com/autocode'+(element?'?id='+element.id:'')+(mode?'&focus='+mode:''), '_blank');
    }
  }

  fn_change_activated(element)
  {
	  chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});
	  chrome.runtime.sendMessage({messageType: "notifyEditor", value:{event:'sf_update_autocode_from_extension', attached:{detail:element}}});
  }

  fn_change_running() {
    this.settings.autorun.running=!this.settings.autorun.running;
    chrome.runtime.sendMessage({messageType: "saveSettings", value:this.settings});
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
  constructor(private _CustomCodeDatabase: CustomCodeDatabase, private _sort: MatSort) {
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
        case 'activated': [propertyA, propertyB] = [a.activated==true?2:1, b.activated==true?2:1]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'websites': [propertyA, propertyB] = [a.websites, b.websites]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
