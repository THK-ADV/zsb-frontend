import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbEventsListComponent} from '../zsb-events/zsb-events-list/zsb-events-list.component'

describe('ZsbVeranstaltungenListComponent', () => {
  let component: ZsbEventsListComponent
  let fixture: ComponentFixture<ZsbEventsListComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbEventsListComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbEventsListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
