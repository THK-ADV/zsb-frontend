import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ZsbVeranstaltungenListComponent} from '../zsb-veranstaltungen/zsb-veranstaltungen-list/zsb-veranstaltungen-list.component';

describe('ZsbVeranstaltungenListComponent', () => {
  let component: ZsbVeranstaltungenListComponent;
  let fixture: ComponentFixture<ZsbVeranstaltungenListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZsbVeranstaltungenListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbVeranstaltungenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
