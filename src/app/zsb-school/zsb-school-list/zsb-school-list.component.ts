import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core'
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import {MatTableDataSource} from '@angular/material/table'
import {DatabaseService} from '../../shared/database.service'
import {SchoolType} from '../schoolType'
import {NotificationService} from '../../shared/notification.service'
import {completeSchoolAsString, School} from '../school'
import {AmountStudents} from '../amount-students'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
import {ZsbLetterComponent} from '../../zsb-communication/zsb-letter/zsb-letter.component'
import {Subscription, zip} from 'rxjs'
import {buildCustomFilter} from '../../shared/keywordsearch'
import {SelectionModel} from '@angular/cdk/collections'

@Component({
  selector: 'app-zsb-school-list',
  templateUrl: './zsb-school-list.component.html',
  styleUrls: ['./zsb-school-list.component.css']
})
export class ZsbSchoolListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  searchKey: string

  listData: MatTableDataSource<School>
  schoolTypes: SchoolType[]
  amountStudents: AmountStudents[]
  selectedSchoolsIds: string[] = []
  private sub: Subscription
  selection = new SelectionModel(true, [])

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: Array<string> = [
    'select',
    'name',
    'schoolType',
    // 'focus',
    'address',
    'city',
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

    this.sub = zip(
      this.service.getSchoolsAtomic(),
      this.service.getSchoolType(),
      this.service.getAmountStudents()
    ).subscribe(([list, schoolTypes, amountStudents]) => {
      this.listData = new MatTableDataSource([...list])
      this.listData.sort = this.sort
      this.listData.paginator = this.paginator
      this.listData.filterPredicate = buildCustomFilter(s =>
        completeSchoolAsString(
          s,
          schoolTypes,
          amountStudents
        ))
      this.buildCustomSorting()

      this.schoolTypes = schoolTypes
      this.amountStudents = amountStudents
    })
    this.selectedSchoolsIds = []
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  onSearchClear() {
    this.searchKey = ''
    this.applyFilter()
  }

  toggleSelectAll() {
    if (this.selectedSchoolsIds.length !== this.listData.data.length) {
      this.selectedSchoolsIds.splice(0)
      this.listData.data.forEach(s => this.selectedSchoolsIds.push(s.school_id))
    } else {
      this.selectedSchoolsIds.splice(0)
    }
  }

  isAllSelected() {
    const numSelected = this.selectedSchoolsIds.length
    const numRows = this.listData.data.length
    return numSelected === numRows
  }

  checkIndeterminedState = () => {
    return this.selection.hasValue() && !this.isAllSelected() && (this.selectedSchoolsIds.length !== 0)
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase()
  }

  getSchoolTypeById(id: number) {
    if (id === undefined || this.schoolTypes === undefined) {
      return ''
    }
    return this.schoolTypes.find(it => it.id === id).desc
  }

  deleteSchool(schoolName: string, uuid: string) {
    if (confirm('Seid ihr sicher, dass ihr "' + schoolName + '" löschen möchtet?')) {
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

  toggleSelectedSchool(schoolId: string) {
    this.selection.toggle(schoolId)
    if (this.shouldRowBeSelected(schoolId)) {
      this.selectedSchoolsIds = this.selectedSchoolsIds.filter(id => id !== schoolId)
    } else {
      this.selectedSchoolsIds.push(schoolId)
    }
  }

  shouldRowBeSelected(schoolId: string): boolean {
    this.selection.isSelected(schoolId)
    return this.selectedSchoolsIds.some(id => id === schoolId)
  }

  warnIfSelectedSchoolsIsEmpty(): boolean {
    if (this.selectedSchoolsIds.length === 0) {
      alert('Bitte wählen Sie zuerst min. eine Schule aus.')
      return true
    }
    return false
  }

  openLetterDialog() {
    if (this.warnIfSelectedSchoolsIsEmpty()) return
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.width = '30%'
    const dialogRef = this.dialog.open(ZsbLetterComponent, dialogConfig)
    dialogRef.componentInstance.addresseesIds = this.selectedSchoolsIds
  }

  openEmailDialog() {
    if (this.warnIfSelectedSchoolsIsEmpty()) return
    alert('Funktionalität ist noch in Arbeit. Folgt in Kürze.')
  }

  private buildCustomSorting() {
    this.listData.sortingDataAccessor = (s, id) => {
      switch (id) {
        case 'name':
          return s.name.toLocaleLowerCase()
        case 'schoolType':
          return this.getSchoolTypeById(s.schooltype).toLocaleLowerCase()
        case 'city':
          return `${s.address.city.postcode}, ${s.address.city.designation}`.toLocaleLowerCase()
        case 'address':
          return `${s.address.street}, ${s.address.houseNumber}`.toLocaleLowerCase()
        case 'amountStudents':
          return s.amount_students
        default:
          throw Error(id)
      }
    }
  }
}
