import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbInstitutionsDetailComponent} from '../zsb-institutions/zsb-institutionen-detail/zsb-institutions-detail.component'

describe('ZsbInstitutionsDetailComponent', () => {
  let component: ZsbInstitutionsDetailComponent;
  let fixture: ComponentFixture<ZsbInstitutionsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZsbInstitutionsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbInstitutionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
