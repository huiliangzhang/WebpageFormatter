import { Component, OnInit, Input } from '@angular/core';
declare var chrome:any;

import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-customcode',
  templateUrl: './customcode.component.html',
  styleUrls: ['./customcode.component.css']
})
export class CustomcodeComponent implements OnInit {

  @Input() settings: any;

  constructor() { }

  ngOnInit() {
  }

  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource = new ExampleDataSource();
}

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const data: Element[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
];

export class ExampleDataSource extends DataSource<any> {
  connect(): Observable<Element[]> {
    return Observable.of(data);
  }
  disconnect() {}
}


