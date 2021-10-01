import {Component, OnInit, ViewChild} from '@angular/core'
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import {MatTableDataSource} from '@angular/material/table'
import {DbTextResponse} from '../../shared/dbTextResponse'
import {DatePipe} from '@angular/common'
import {NotificationService} from '../../shared/notification.service'
import {InstitutionsService} from '../institutions.service'
import {completeInstitutionAsString, Institution} from '../institution'
import {buildCustomFilter} from '../../shared/keywordsearch'


@Component({
  selector: 'app-zsb-institutions-list',
  templateUrl: './zsb-institutions-list.component.html',
  styleUrls: ['./zsb-institutions-list.component.css']
})
export class ZsbInstitutionsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  searchKey: string
  listData: MatTableDataSource<Institution> = new MatTableDataSource<Institution>([])

  displayedColumns: Array<string> = ['designation', 'email', 'city', 'actions']

  tableColumns: Array<string> = this.displayedColumns.filter(d => d !== 'actions')

  constructor(private service: InstitutionsService, private datePipe: DatePipe, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.service.getInstitutions().subscribe(institutions => {
      this.listData.data = institutions
      this.listData.sort = this.sort
      this.listData.paginator = this.paginator
      this.listData.filterPredicate = buildCustomFilter<Institution>(i => completeInstitutionAsString(i))
    })
  }

  onSearchClear() {
    this.searchKey = ''
    this.applyFilter()
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase()
  }

  labelForTableColumn = (tableColumns): string => {
    switch (tableColumns) {
      case 'designation':
        return 'Bezeichnung'
      case 'email':
        return 'E-Mail'
      case 'city':
        return 'Ort'
      default:
        return '???'
    }
  }

  tableContentForRow = (inst: Institution, column: string): string => {
    switch (column) {
      case 'designation':
        return inst.designation
      case 'email':
        return inst.email
      case 'city':
        return inst.address?.city?.designation ?? inst.address_id
      default:
        return '???'
    }
  }

  deleteInstitution(designation: string, uuid: string) {
    if (confirm('Seid ihr sicher, dass ihr die Institution "' + designation + '" löschen möchtet? ' +
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

