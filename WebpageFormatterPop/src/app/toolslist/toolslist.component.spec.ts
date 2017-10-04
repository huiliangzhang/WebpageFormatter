import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolslistComponent } from './toolslist.component';

describe('ToolslistComponent', () => {
  let component: ToolslistComponent;
  let fixture: ComponentFixture<ToolslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
