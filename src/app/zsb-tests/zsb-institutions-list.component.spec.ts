import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbInstitutionsListComponent} from '../zsb-institutions/zsb-institutionen-list/zsb-institutions-list.component'

describe('ZsbInstitutionsListComponent', () => {
  let component: ZsbInstitutionsListComponent;
  let fixture: ComponentFixture<ZsbInstitutionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZsbInstitutionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbInstitutionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
