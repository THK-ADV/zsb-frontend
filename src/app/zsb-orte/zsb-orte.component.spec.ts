import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ZsbOrteComponent} from './zsb-orte.component';

describe('ZsbOrteComponent', () => {
  let component: ZsbOrteComponent;
  let fixture: ComponentFixture<ZsbOrteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZsbOrteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbOrteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
