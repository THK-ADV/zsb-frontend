import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbContactSearchComponent} from '../zsb-contact/zsb-contact-search/zsb-contact-search.component'

describe('ZsbKontaktSearchComponent', () => {
  let component: ZsbContactSearchComponent
  let fixture: ComponentFixture<ZsbContactSearchComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbContactSearchComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbContactSearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
