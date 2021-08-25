import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbReportComponent} from '../zsb-events/zsb-report/zsb-report.component'

describe('ZsbBerichtComponent', () => {
  let component: ZsbReportComponent
  let fixture: ComponentFixture<ZsbReportComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbReportComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbReportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
