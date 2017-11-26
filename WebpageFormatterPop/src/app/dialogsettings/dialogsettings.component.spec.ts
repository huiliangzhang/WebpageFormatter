import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsettingsComponent } from './dialogsettings.component';

describe('DialogsettingsComponent', () => {
  let component: DialogsettingsComponent;
  let fixture: ComponentFixture<DialogsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
