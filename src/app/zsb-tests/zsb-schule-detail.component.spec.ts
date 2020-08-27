import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {ZsbSchuleDetailComponent} from '../zsb-schule/zsb-schule-detail/zsb-schule-detail.component'

describe('ZsbSchuleDetailComponent', () => {
  let component: ZsbSchuleDetailComponent
  let fixture: ComponentFixture<ZsbSchuleDetailComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbSchuleDetailComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbSchuleDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
