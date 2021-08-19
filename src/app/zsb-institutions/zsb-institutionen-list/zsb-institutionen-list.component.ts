import {Component, OnInit, ViewChild} from '@angular/core'
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import {MatTableDataSource} from '@angular/material/table'
import {Institution} from '../institution'
import {DbTextResponse} from '../../shared/dbTextResponse'
import {DatePipe} from '@angular/common'
import {NotificationService} from '../../shared/notification.service'
import {InstitutionenService} from '../institutionen.service'

@Component({
  selector: 'app-zsb-institutionen-list',
  templateUrl: './zsb-institutionen-list.component.html',
  styleUrls: ['./zsb-institutionen-list.component.css']
})
export class ZsbInstitutionenListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  searchKey: string
  listData: MatTableDataSource<Institution>

  displayedColumns: Array<string> = ['bezeichnung', 'email', 'ort', 'actions']

  constructor(private service: InstitutionenService, private datePipe: DatePipe, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.service.getInstitutionen().subscribe(institutionen => {
      this.listData = new MatTableDataSource<Institution>(institutionen)
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

  deleteInstitution(bezeichnung: string, uuid: string) {
    if (confirm('Seid ihr sicher, dass ihr die Institution "' + bezeichnung + '" löschen möchtet? ' +
      '\nHinweis: Zugehörige VERANSTALTUNGEN werden ebenfalls gelöscht!')) {
      this.service.deleteInstitution(uuid).subscribe(it => {
        const response = it as DbTextResponse
        if (+response.status === 200) {
          this.notificationService.success('Institution wurde erfolgreich entfernt.')
          // remove institution from table
          this.ngOnInit()
        } else {
          console.log(response.msg + '(' + response.status + ')')
          this.notificationService.failure('Institution konnte nicht entfernt werden.')
        }
      })
    }
  }

}

