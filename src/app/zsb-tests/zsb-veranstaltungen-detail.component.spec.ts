import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ZsbVeranstaltungenDetailComponent} from '../zsb-veranstaltungen/zsb-veranstaltungen-detail/zsb-veranstaltungen-detail.component';

describe('ZsbVeranstaltungenDetailComponent', () => {
  let component: ZsbVeranstaltungenDetailComponent;
  let fixture: ComponentFixture<ZsbVeranstaltungenDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZsbVeranstaltungenDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbVeranstaltungenDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
