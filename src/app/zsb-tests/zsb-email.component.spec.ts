import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbEmailComponent} from '../zsb-communication/zsb-email/zsb-email.component'

describe('ZsbEmailComponent', () => {
  let component: ZsbEmailComponent
  let fixture: ComponentFixture<ZsbEmailComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbEmailComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbEmailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
