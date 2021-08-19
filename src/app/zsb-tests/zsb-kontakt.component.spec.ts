import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbKontaktDetailComponent} from '../zsb-contact/zsb-kontakt-detail/zsb-kontakt-detail.component'

describe('ZsbKontaktComponent', () => {
  let component: ZsbKontaktDetailComponent
  let fixture: ComponentFixture<ZsbKontaktDetailComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbKontaktDetailComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbKontaktDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
