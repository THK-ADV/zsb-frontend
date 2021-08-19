import {Component, OnInit, ViewChild} from '@angular/core'
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import {MatTableDataSource} from '@angular/material/table'
import {DatabaseService} from '../../shared/database.service'
import {SchoolType} from '../schoolType'
import {NotificationService} from '../../shared/notification.service'
import {completeSchuleAsString, School} from '../school'
import {AmountStudents} from '../amount-students'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
import {ZsbLetterComponent} from '../../zsb-communication/zsb-letter/zsb-letter.component'

@Component({
  selector: 'app-zsb-schule-list',
  templateUrl: './zsb-schule-list.component.html',
  styleUrls: ['./zsb-schule-list.component.css']
})
export class ZsbSchuleListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  searchKey: string

  listData: MatTableDataSource<any>
  schulformen: SchoolType[]
  anzahlSus: AmountStudents[]
  private selectedSchulenIds: string[] = []

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: Array<string> = [
    'select',
    'name',
    'schulform',
    // 'schwerpunkt',
    'adresse',
    'ort',
    // 'schulleitung_mail',
    // 'stubo_mail',
    // 'schueleranzahl',
    // 'kooperationsvertrag',
    // 'kaoa_hochschule',
    // 'talent',
    'actions'
  ]

  constructor(private service: DatabaseService,
              private notificationService: NotificationService,
              private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.service.getSchoolsAtomic().subscribe(
      list => {
        const array = list.map(item => {
          return {
            ...item
          }
        })
        this.listData = new MatTableDataSource(array)
        this.listData.sort = this.sort
        this.listData.paginator = this.paginator
        this.buildCustomFilter()
      })

    this.service.getSchoolType().subscribe(schulformen => this.schulformen = schulformen)
    this.service.getAmountStudents().subscribe(anzahlSus => this.anzahlSus = anzahlSus)
    this.selectedSchulenIds = []
  }

  onSearchClear() {
    this.searchKey = ''
    this.applyFilter()
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase()
  }

  buildCustomFilter() {
    this.listData.filterPredicate = (schule: School, filter: string) => {
      // split keyword by comma ,
      const keywords = filter.split(',').map(it => it.trim())

      // filter data for every keyword -> loop through keywords
      let keywordsFound = true
      keywords.forEach(keyword => {
        if (!completeSchuleAsString(schule, this.schulformen, this.amountStudents).toLowerCase().includes(keyword)) {
          keywordsFound = false
        }
      })

      // found all keywords
      return keywordsFound
    }
  }

  getSchulformById(id: number) {
    if (id === undefined || this.schulformen === undefined) {
      return ''
    }
    return this.schulformen.find(it => it.id === id).desc
  }

  deleteSchule(schulName: string, uuid: string) {
    if (confirm('Seid ihr sicher, dass ihr "' + schulName + '" löschen möchtet?')) {
      this.service.deleteSchool(uuid).subscribe(it => {
        if (it !== undefined) {
          this.notificationService.success(':: Schule wurde erfolgreich entfernt.')
          // remove schule from table
          this.ngOnInit()
        } else {
          this.notificationService.failure('-- Schule konnte nicht entfernt werden.')
        }
      })
    }
  }

  toggleSelectedSchule(schuleId: string) {
    if (this.shouldRowBeSelected(schuleId)) {
      this.selectedSchulenIds = this.selectedSchulenIds.filter(id => id !== schuleId)
    } else {
      this.selectedSchulenIds.push(schuleId)
    }
  }

  shouldRowBeSelected(schuleId: string): boolean {
    return this.selectedSchulenIds.some(id => id === schuleId)
  }

  warnIfSelectedSchulenIsEmpty(): boolean {
    if (this.selectedSchulenIds.length === 0) {
      alert('Bitte wählen Sie zuerst mind. eine Schule aus.')
      return true
    }
    return false
  }

  openLetterDialog() {
    if (this.warnIfSelectedSchulenIsEmpty()) return
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.width = '30%'
    const dialogRef = this.dialog.open(ZsbLetterComponent, dialogConfig)
    dialogRef.componentInstance.addresseesIds = this.selectedSchulenIds
  }

  openEmailDialog() {
    if (this.warnIfSelectedSchulenIsEmpty()) return
    alert('Funktionalität ist noch in Arbeit. Folgt in Kürze.')
  }
}
