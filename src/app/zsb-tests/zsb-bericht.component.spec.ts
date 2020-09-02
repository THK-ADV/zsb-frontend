import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbBerichtComponent} from '../zsb-veranstaltungen/zsb-bericht/zsb-bericht.component'

describe('ZsbBerichtComponent', () => {
  let component: ZsbBerichtComponent
  let fixture: ComponentFixture<ZsbBerichtComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbBerichtComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbBerichtComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
