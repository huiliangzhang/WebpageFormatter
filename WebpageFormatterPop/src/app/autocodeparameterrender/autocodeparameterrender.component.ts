import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-autocodeparameterrender',
  templateUrl: './autocodeparameterrender.component.html',
  styleUrls: ['./autocodeparameterrender.component.css', './_autocodeparameterrender.component.scss', '../_app.general.scss']
})
export class AutocodeparameterrenderComponent implements OnInit {

  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
