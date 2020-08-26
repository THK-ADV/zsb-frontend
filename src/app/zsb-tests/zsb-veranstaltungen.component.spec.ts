import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ZsbVeranstaltungenComponent} from '../zsb-veranstaltungen/zsb-veranstaltungen.component';

describe('ZsbVeranstaltungenComponent', () => {
  let component: ZsbVeranstaltungenComponent;
  let fixture: ComponentFixture<ZsbVeranstaltungenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZsbVeranstaltungenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbVeranstaltungenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
