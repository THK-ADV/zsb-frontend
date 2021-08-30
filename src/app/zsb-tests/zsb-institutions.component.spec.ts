import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbInstitutionsComponent} from '../zsb-institutions/zsb-institutions.component'

describe('ZsbInstitutionenComponent', () => {
  let component: ZsbInstitutionsComponent
  let fixture: ComponentFixture<ZsbInstitutionsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbInstitutionsComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbInstitutionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
