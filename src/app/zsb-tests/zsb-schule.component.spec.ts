import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbSchuleComponent} from '../zsb-school/zsb-schule.component'

describe('ZsbSchuleComponent', () => {
  let component: ZsbSchuleComponent
  let fixture: ComponentFixture<ZsbSchuleComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbSchuleComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbSchuleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
