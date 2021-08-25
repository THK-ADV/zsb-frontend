import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbEventsDetailComponent} from '../zsb-events/zsb-events-detail/zsb-events-detail.component'

describe('ZsbVeranstaltungenDetailComponent', () => {
  let component: ZsbEventsDetailComponent
  let fixture: ComponentFixture<ZsbEventsDetailComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbEventsDetailComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbEventsDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
