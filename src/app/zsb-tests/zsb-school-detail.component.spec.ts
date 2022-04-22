import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbSchoolEditComponent} from '../zsb-school/zsb-school-edit/zsb-school-edit.component'

describe('ZsbSchoolDetailComponent', () => {
  let component: ZsbSchoolEditComponent
  let fixture: ComponentFixture<ZsbSchoolEditComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbSchoolEditComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbSchoolEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
