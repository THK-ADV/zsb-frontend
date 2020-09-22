import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbInstitutionenComponent} from '../zsb-institutionen/zsb-institutionen.component'

describe('ZsbInstitutionenComponent', () => {
  let component: ZsbInstitutionenComponent
  let fixture: ComponentFixture<ZsbInstitutionenComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbInstitutionenComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbInstitutionenComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
