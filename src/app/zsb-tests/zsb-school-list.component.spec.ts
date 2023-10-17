import {async, ComponentFixture, TestBed} from '@angular/core/testing'
import {NoopAnimationsModule} from '@angular/platform-browser/animations'
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator'
import {MatSortModule} from '@angular/material/sort'
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table'

import {ZsbSchoolListComponent} from '../zsb-school/zsb-school-list/zsb-school-list.component'

describe('DataTableComponent', () => {
  let component: ZsbSchoolListComponent
  let fixture: ComponentFixture<ZsbSchoolListComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbSchoolListComponent],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbSchoolListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should compile', () => {
    expect(component).toBeTruthy()
  })
})
