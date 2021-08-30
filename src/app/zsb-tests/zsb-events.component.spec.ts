import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbEventsComponent} from '../zsb-events/zsb-events.component'

describe('ZsbVeranstaltungenComponent', () => {
  let component: ZsbEventsComponent
  let fixture: ComponentFixture<ZsbEventsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbEventsComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbEventsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
