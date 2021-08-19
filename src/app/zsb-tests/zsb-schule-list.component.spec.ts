import {async, ComponentFixture, TestBed} from '@angular/core/testing'
import {NoopAnimationsModule} from '@angular/platform-browser/animations'
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatSortModule} from '@angular/material/sort'
import {MatTableModule} from '@angular/material/table'

import {ZsbSchuleListComponent} from '../zsb-school/zsb-schule-list/zsb-schule-list.component'

describe('DataTableComponent', () => {
  let component: ZsbSchuleListComponent
  let fixture: ComponentFixture<ZsbSchuleListComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbSchuleListComponent],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbSchuleListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should compile', () => {
    expect(component).toBeTruthy()
  })
})
