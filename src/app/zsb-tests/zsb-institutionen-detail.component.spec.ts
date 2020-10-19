import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbInstitutionenDetailComponent} from '../zsb-institutionen/zsb-institutionen-detail/zsb-institutionen-detail.component'

describe('ZsbInstitutionenDetailComponent', () => {
  let component: ZsbInstitutionenDetailComponent;
  let fixture: ComponentFixture<ZsbInstitutionenDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZsbInstitutionenDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbInstitutionenDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
