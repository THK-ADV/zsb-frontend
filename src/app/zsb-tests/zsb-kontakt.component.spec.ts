import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ZsbKontaktComponent} from '../zsb-kontakt/zsb-kontakt.component';

describe('ZsbKontaktComponent', () => {
  let component: ZsbKontaktComponent;
  let fixture: ComponentFixture<ZsbKontaktComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZsbKontaktComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbKontaktComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
