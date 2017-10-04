import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClicktotriggerComponent } from './clicktotrigger.component';

describe('ClicktotriggerComponent', () => {
  let component: ClicktotriggerComponent;
  let fixture: ComponentFixture<ClicktotriggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClicktotriggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClicktotriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
