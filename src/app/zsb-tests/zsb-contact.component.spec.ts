import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbContactDetailComponent} from '../zsb-contact/zsb-contact-detail/zsb-contact-detail.component'

describe('ZsbContactComponent', () => {
  let component: ZsbContactDetailComponent
  let fixture: ComponentFixture<ZsbContactDetailComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbContactDetailComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbContactDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
