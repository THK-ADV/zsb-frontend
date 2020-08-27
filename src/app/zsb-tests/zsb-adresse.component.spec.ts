import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbAdresseComponent} from '../zsb-adresse/zsb-adresse.component'

describe('ZsbAdresseComponent', () => {
  let component: ZsbAdresseComponent
  let fixture: ComponentFixture<ZsbAdresseComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbAdresseComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbAdresseComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
