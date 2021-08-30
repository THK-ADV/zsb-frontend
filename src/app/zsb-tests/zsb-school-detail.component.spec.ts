import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbSchoolDetailComponent} from '../zsb-school/zsb-school-detail/zsb-school-detail.component'

describe('ZsbSchuleDetailComponent', () => {
  let component: ZsbSchoolDetailComponent
  let fixture: ComponentFixture<ZsbSchoolDetailComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbSchoolDetailComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbSchoolDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
