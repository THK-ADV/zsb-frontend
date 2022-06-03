import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import {MatTableDataSource} from '@angular/material/table'
import {DatabaseService} from '../../shared/database.service'
import {SchoolType, schoolTypeDescById} from '../schoolType'
import {NotificationService} from '../../shared/notification.service'
import {completeSchoolAsString, School} from '../school'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
import {ZsbLetterComponent} from '../../zsb-communication/zsb-letter/zsb-letter.component'
import {Subscription, zip} from 'rxjs'
import {buildCustomFilter} from '../../shared/keywordsearch'
import {SelectionModel} from '@angular/cdk/collections'
import {generateTitle, saveBlobAsFile} from '../../shared/downloads'
import {DatePipe} from '@angular/common'
import {ZsbEmailComponent} from '../../zsb-communication/zsb-email/zsb-email.component'
import {MatRadioChange} from '@angular/material/radio'

type SchoolFilterOption = 'Alle' | 'Name' | 'Schulform' | 'Straße' | 'Stadt' | 'Kontakte'

@Component({
  selector: 'app-zsb-school-list',
  templateUrl: './zsb-school-list.component.html',
  styleUrls: ['./zsb-school-list.component.css']
})
export class ZsbSchoolListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  searchKey = ''

  listData: MatTableDataSource<School>
  schoolTypes: SchoolType[]
  selectedSchoolsIds: string[] = []
  private sub: Subscription
  selection = new SelectionModel(true, [])

  // filter
  filterOptions: SchoolFilterOption[] = ['Alle', 'Name', 'Schulform', 'Straße', 'Stadt', 'Kontakte']
  selectedFilterOption: SchoolFilterOption = this.filterOptions[0]
  showFilterOptions = false

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: Array<string> = [
    'select',
    'name',
    'type',
    'address',
    'city',
    'actions'
  ]

  constructor(private service: DatabaseService,
              private notificationService: NotificationService,
              private dialog: MatDialog,
              private datePipe: DatePipe
  ) {
  }

  ngOnInit() {

    this.sub = zip(
      this.service.getSchoolsAtomic(),
      this.service.getSchoolType(),
    ).subscribe(([list, schoolTypes]) => {
      this.listData = new MatTableDataSource([...list])
      this.listData.sort = this.sort
      this.listData.paginator = this.paginator
      this.listData.filterPredicate = buildCustomFilter(s => {
          switch (this.selectedFilterOption) {
            case 'Alle':
              return completeSchoolAsString(
                s,
                schoolTypes,
              )
            case 'Name':
              return s.name
            case 'Schulform':
              return schoolTypeDescById(s.type, schoolTypes)
            case 'Straße':
              return s.address.street + s.address.houseNumber
            case 'Stadt':
              return s.address.city.postcode +
                s.address.city.designation +
                s.address.city.governmentDistrict +
                s.address.city.constituency
            case 'Kontakte':
              return s.contacts.map(c => c.surname).join()
          }
        }
      )
      this.buildCustomSorting()

      this.schoolTypes = schoolTypes
    })
    this.selectedSchoolsIds = []
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  onSearchClear() {
    this.searchKey = ''
    this.selectedFilterOption = this.filterOptions[0]
    this.applyFilter()
  }

  toggleSelectAll() {
    if (this.selectedSchoolsIds.length !== this.listData.data.length) {
      this.selectedSchoolsIds.splice(0)
      this.listData.data.forEach(s => this.selectedSchoolsIds.push(s.id))
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
    const searchKey = this.searchKey.trim().toLowerCase()
    if (searchKey) {
      this.listData.filter = searchKey
    }
  }

  toggleFilterOptions() {
    this.showFilterOptions = !this.showFilterOptions
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
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.width = '30%'
    const dialogRef = this.dialog.open(ZsbEmailComponent, dialogConfig)
    dialogRef.componentInstance.addresseesIds = this.selectedSchoolsIds
  }

  exportAddresses() {
    if (this.warnIfSelectedSchoolsIsEmpty()) return
    this.service.createSheet(this.selectedSchoolsIds.map(id => this.getSchoolById(id)).filter(s => s !== null))
      .subscribe(result => saveBlobAsFile(
        result,
        generateTitle(
          this.selectedSchoolsIds,
          'adressen',
          '.xlsx',
          this.datePipe
        )
      ))
  }

  private buildCustomSorting() {
    this.listData.sortingDataAccessor = (s, id) => {
      console.log('buildCustomSorting', s)
      switch (id) {
        case 'name':
          return s.name.toLocaleLowerCase()
        case 'type':
          return this.getSchoolTypeById(s.type).toLocaleLowerCase()
        case 'city':
          return `${s.address.city.postcode}, ${s.address.city.designation}`.toLocaleLowerCase()
        case 'address':
          return `${s.address.street}, ${s.address.houseNumber}`.toLocaleLowerCase()
        default:
          throw Error(id)
      }
    }
  }

  private getSchoolById(id: string): School | null {
    return this.listData.data.find(s => s.id === id) ?? null
  }

  setSelectedValue(event: MatRadioChange) {
    this.selectedFilterOption = event.value
    this.applyFilter()
  }
}
