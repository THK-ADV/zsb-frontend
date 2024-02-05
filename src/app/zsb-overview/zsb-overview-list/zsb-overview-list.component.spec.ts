import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ZsbOverviewListComponent } from './zsb-overview-list.component'

describe('ZsbOverviewListComponent', () => {
  let component: ZsbOverviewListComponent
  let fixture: ComponentFixture<ZsbOverviewListComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbOverviewListComponent]
    })
    fixture = TestBed.createComponent(ZsbOverviewListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
