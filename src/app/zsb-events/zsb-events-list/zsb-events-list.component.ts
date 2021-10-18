import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core'
import {EventService} from '../../shared/event.service'
import {MatTableDataSource} from '@angular/material/table'
import {completeEventAsString, Event} from '../event'
import {MatSort} from '@angular/material/sort'
import {MatPaginator} from '@angular/material/paginator'
import {DatePipe} from '@angular/common'
import {NotificationService} from '../../shared/notification.service'
import {DbTextResponse} from '../../shared/dbTextResponse'
import {DatabaseService} from '../../shared/database.service'
import {zip} from 'rxjs'
import {buildCustomFilter} from '../../shared/keywordsearch'
import {Host} from "../host";

@Component({
  selector: 'app-zsb-events-list',
  templateUrl: './zsb-events-list.component.html',
  styleUrls: ['./zsb-events-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZsbEventsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  searchKey: string
  listData: MatTableDataSource<Event>

  // order here represents the order in the displayed table
  displayedColumns: Array<string> = ['date', 'designation', 'category', 'topic', 'actions']

  constructor(private service: EventService,
              private datePipe: DatePipe,
              private notificationService: NotificationService,
              private dbService: DatabaseService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    zip(
      this.dbService.getCategories(),
      this.dbService.getAllEvents()
    )
      .subscribe(data => {
        const categories = data[0]
        const events = data[1]

        const categoryLookup = new Map<number, string>()
        categories.forEach(c => categoryLookup.set(c.id, c.desc))

        this.listData = new MatTableDataSource(
          events.map(e => ({
            ...e,
            categoryNames: e.categoryNames = e.category.map(id => categoryLookup.get(id) ?? 'Unbekannt').join(' '),
          }))
        )
        this.listData.sort = this.sort
        this.listData.paginator = this.paginator
        this.listData.filterPredicate = buildCustomFilter(e => completeEventAsString(e))

        this.changeDetectorRef.markForCheck()
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
  constructor(private readonly event: Event,
              public readonly category: string) {
  }

  get uuid(): string {
    return this.event.uuid
  }

  get date(): string {
    return this.event.date
  }

  get designation(): string {
    return this.event.designation
  }

  get topic(): string {
    return this.event.topic
  }

  get contactPerson(): string {
    return this.event.contactPerson
  }

  get host(): Host {
    return this.event.host
  }
}
