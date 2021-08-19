import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbAddressComponent} from '../zsb-address/zsb-address.component'

describe('ZsbAdresseComponent', () => {
  let component: ZsbAddressComponent
  let fixture: ComponentFixture<ZsbAddressComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbAddressComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbAddressComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
