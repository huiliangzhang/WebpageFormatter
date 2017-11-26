import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocodeparameterrenderComponent } from './autocodeparameterrender.component';

describe('AutocodeparameterrenderComponent', () => {
  let component: AutocodeparameterrenderComponent;
  let fixture: ComponentFixture<AutocodeparameterrenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocodeparameterrenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocodeparameterrenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
