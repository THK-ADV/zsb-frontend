import { Component, OnInit } from '@angular/core'
import {School} from '../../zsb-school/school'
import {SchoolService} from '../../shared/school.service'
import {ContactFunction} from '../../zsb-contact/contact'
import {Address} from '../../zsb-address/address'
import {MatTableDataSource} from '@angular/material/table'
import {DatePipe} from '@angular/common'

@Component({
  selector: 'app-zsb-school-event-detail',
  templateUrl: './zsb-school-event-detail.component.html',
  styleUrls: ['./zsb-school-event-detail.component.css']
})
export class ZsbSchoolEventDetailComponent implements OnInit {

  // TODO: entsprechende Daten übergeben
  school: School
  address: Address
  contactFunctions: ContactFunction[]
  listData: MatTableDataSource<Event>
  expandedElement: Event | null
  displayedColumns: Array<string> = [
    'designation',
    'date',
    'category'
  ]
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  constructor(
    public service: SchoolService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
  }

  getContactFunctionDescById(id: number) {
    let desc = 'Unbekannt'

    if (this.contactFunctions !== undefined && this.contactFunctions !== null) {
      this.contactFunctions.forEach(it => {
        if (desc === 'Unbekannt') {
          if (it.id === id) {
            desc = it.desc
          }
        }
      })
    }

    return desc
  }

  toReadableDate(isoDate: string): string {
    const date = Date.parse(isoDate)
    return this.datePipe.transform(date, 'dd.MM.yyyy')
  }

}
