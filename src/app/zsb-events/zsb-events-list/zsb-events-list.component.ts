import {Component, OnInit, ViewChild} from '@angular/core'
import {EventService} from '../../shared/event.service'
import {MatTableDataSource} from '@angular/material/table'
import {Event} from '../event'
import {MatSort} from '@angular/material/sort'
import {MatPaginator} from '@angular/material/paginator'
import {DatePipe} from '@angular/common'
import {Category} from '../category'
import {NotificationService} from '../../shared/notification.service'
import {DbTextResponse} from '../../shared/dbTextResponse'

@Component({
  selector: 'app-zsb-events-list',
  templateUrl: './zsb-events-list.component.html',
  styleUrls: ['./zsb-events-list.component.css']
})
export class ZsbEventsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  searchKey: string
  listData: MatTableDataSource<EventsListDisplay>

  // order here represents the order in the displayed table
  displayedColumns: Array<string> = ['date', 'designation', 'category', 'topic', 'actions']

  constructor(private service: EventService, private datePipe: DatePipe, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.service.getEvents().subscribe(events => {
      const mappedEvents = events.map(it => new EventsListDisplay(it, this.service.getCategories()))
      this.listData = new MatTableDataSource<EventsListDisplay>(mappedEvents)
      this.listData.sort = this.sort
      this.listData.paginator = this.paginator
    })
  }

  onSearchClear() {
    this.searchKey = ''
    this.applyFilter()
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase()
  }

  deleteEvent(designation: string, uuid: string) {
    if (confirm('Seid ihr sicher, dass ihr "' + designation + '" löschen möchtet? \n Hinweis: Zugehörige Berichte werden ebenfalls gelöscht!')) {
      this.service.deleteEvent(uuid).subscribe(it => {
        const response = it as DbTextResponse
        if (+response.status === 200) {
          this.notificationService.success(':: Veranstaltung wurde erfolgreich entfernt.')
          // remove event from table
          this.ngOnInit()
        } else {
          console.log(response.msg + '(' + response.status + ')')
          this.notificationService.failure('-- Veranstaltung konnte nicht entfernt werden.')
        }
      })
    }
  }

  toReadableDate(isoDate: string): string {
    const date = Date.parse(isoDate)
    return this.datePipe.transform(date, 'dd.MM.yyyy')
  }
}

export class EventsListDisplay {
  uuid: string
  date: string
  designation: string
  category: string
  topic: string

  constructor(event: Event, categories: Category[]) {
    let categoriesAsString = ''
    event.category.forEach(it => {
      categoriesAsString = Category.getCategoryWithId(it, categories).desc + ' ' + categoriesAsString
    })
    this.uuid = event.uuid
    this.date = event.date
    this.designation = event.designation
    this.category = categoriesAsString
    this.topic = event.topic
  }
}
