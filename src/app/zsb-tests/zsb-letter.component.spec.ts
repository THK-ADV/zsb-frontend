import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbLetterComponent} from '../zsb-communication/zsb-letter/zsb-letter.component'

describe('ZsbLetterComponent', () => {
  let component: ZsbLetterComponent
  let fixture: ComponentFixture<ZsbLetterComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbLetterComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbLetterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
