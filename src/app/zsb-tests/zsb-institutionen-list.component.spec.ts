import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbInstitutionenListComponent} from '../zsb-institutionen/zsb-institutionen-list/zsb-institutionen-list.component'

describe('ZsbInstitutionenListComponent', () => {
  let component: ZsbInstitutionenListComponent;
  let fixture: ComponentFixture<ZsbInstitutionenListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZsbInstitutionenListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbInstitutionenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
