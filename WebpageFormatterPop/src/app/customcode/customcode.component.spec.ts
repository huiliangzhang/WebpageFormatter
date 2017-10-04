import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomcodeComponent } from './customcode.component';

describe('CustomcodeComponent', () => {
  let component: CustomcodeComponent;
  let fixture: ComponentFixture<CustomcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
