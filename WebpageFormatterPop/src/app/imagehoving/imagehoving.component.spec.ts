import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagehovingComponent } from './imagehoving.component';

describe('ImagehovingComponent', () => {
  let component: ImagehovingComponent;
  let fixture: ComponentFixture<ImagehovingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagehovingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagehovingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
