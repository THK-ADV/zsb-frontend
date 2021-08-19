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
  selector: 'app-zsb-veranstaltungen-list',
  templateUrl: './zsb-veranstaltungen-list.component.html',
  styleUrls: ['./zsb-veranstaltungen-list.component.css']
})
export class ZsbVeranstaltungenListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  searchKey: string
  listData: MatTableDataSource<VeranstaltungenListDisplay>

  // order here represents the order in the displayed table
  displayedColumns: Array<string> = ['datum', 'bezeichnung', 'kategorie', 'thema', 'actions']

  constructor(private service: EventService, private datePipe: DatePipe, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.service.getEvents().subscribe(veranstaltungen => {
      const mappedVeranstaltungen = veranstaltungen.map(it => new VeranstaltungenListDisplay(it, this.service.getCategories()))
      this.listData = new MatTableDataSource<VeranstaltungenListDisplay>(mappedVeranstaltungen)
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

  deleteVeranstaltung(bezeichnung: string, uuid: string) {
    if (confirm('Seid ihr sicher, dass ihr "' + bezeichnung + '" löschen möchtet? \n Hinweis: Zugehörige Berichte werden ebenfalls gelöscht!')) {
      this.service.deleteEvent(uuid).subscribe(it => {
        const response = it as DbTextResponse
        if (+response.status === 200) {
          this.notificationService.success(':: Veranstaltung wurde erfolgreich entfernt.')
          // remove veranstaltung from table
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

export class VeranstaltungenListDisplay {
  uuid: string
  datum: string
  bezeichnung: string
  kategorie: string
  thema: string

  constructor(veranstaltung: Event, kategorien: Category[]) {
    let kategorienAsString = ''
    veranstaltung.category.forEach(it => {
      kategorienAsString = Category.getKategorieWithId(it, kategorien).desc + ' ' + kategorienAsString
    })
    this.uuid = veranstaltung.uuid
    this.datum = veranstaltung.date
    this.bezeichnung = veranstaltung.designation
    this.kategorie = kategorienAsString
    this.thema = veranstaltung.topic
  }
}
