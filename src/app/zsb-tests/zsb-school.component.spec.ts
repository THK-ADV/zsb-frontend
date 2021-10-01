import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbSchoolComponent} from '../zsb-school/zsb-school.component'

describe('ZsbSchoolComponent', () => {
  let component: ZsbSchoolComponent
  let fixture: ComponentFixture<ZsbSchoolComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbSchoolComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbSchoolComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
