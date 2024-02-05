import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import {MatTableDataSource} from '@angular/material/table'
import {completeSchoolAsString, School} from '../../zsb-school/school'
import {SchoolType, schoolTypeDescById} from '../../zsb-school/schoolType'
import {Subscription, zip} from 'rxjs'
import {SelectionModel} from '@angular/cdk/collections'
import {DatabaseService} from '../../shared/database.service'
import {NotificationService} from '../../shared/notification.service'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
import {DatePipe} from '@angular/common'
import {buildCustomFilter} from '../../shared/keywordsearch'
import {ZsbLetterComponent} from '../../zsb-communication/zsb-letter/zsb-letter.component'
import {ZsbEmailComponent} from '../../zsb-communication/zsb-email/zsb-email.component'
import {MatRadioChange} from '@angular/material/radio'
import {animate, state, style, transition, trigger} from '@angular/animations'
import {DatabaseEvent} from '../../zsb-events/event'

type SchoolFilterOption = 'Alle' | 'Name' | 'Schulform' | 'Straße' | 'Stadt' | 'Kontakte'
type SchoolWithEvents = {
  school: School,
  events: DatabaseEvent[]
}
@Component({
  selector: 'app-zsb-overview-list',
  templateUrl: './zsb-overview-list.component.html',
  styleUrls: ['./zsb-overview-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class ZsbOverviewListComponent implements OnInit, OnDestroy {

  constructor(private service: DatabaseService,
              private notificationService: NotificationService,
              private dialog: MatDialog,
              private datePipe: DatePipe
  ) {
  }
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  searchKey = ''

  listData: MatTableDataSource<SchoolWithEvents>
  detailData: MatTableDataSource<DatabaseEvent>
  schoolTypes: SchoolType[]
  selectedSchoolsIds: string[] = []
  private sub: Subscription
  selection = new SelectionModel(true, [])
  expandedElement: SchoolWithEvents | null
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: Array<string> = [
    'select',
    'name',
    'type',
    'address',
    'city',
    'actions'
  ]
  displayedDetailColumns: Array<string> = [
    'detailDesignation',
    'detailDate',
    'detailCategory',
    'detailActions'
  ]
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']

  // filter
  filterOptions: SchoolFilterOption[] = ['Alle', 'Name', 'Schulform', 'Straße', 'Stadt', 'Kontakte']
  selectedFilterOption: SchoolFilterOption = this.filterOptions[0]
  showFilterOptions = false

  protected readonly console = console

  ngOnInit() {
    this.sub = zip(
      this.service.getSchoolsAtomic(),
      this.service.getSchoolType(),
      this.service.getAllEvents()
    ).subscribe(([schools, schoolTypes, events]) => {
      const schoolWithEvents: SchoolWithEvents[] = []
      schools.forEach((school) => {
        const schoolEvents = events.filter((event) => {
          return (event.school_id === school.id)
        })
        const schoolWithEvent: SchoolWithEvents = {
          school,
          events: schoolEvents
        }
        schoolWithEvents.push(schoolWithEvent)
      })
      this.listData = new MatTableDataSource(schoolWithEvents)
      this.detailData = new MatTableDataSource([])
      this.listData.sort = this.sort
      this.listData.paginator = this.paginator
      this.listData.filterPredicate = buildCustomFilter(({school}) => {
          switch (this.selectedFilterOption) {
            case 'Alle':
              return completeSchoolAsString(
                school,
                schoolTypes,
              )
            case 'Name':
              return school.name
            case 'Schulform':
              return schoolTypeDescById(school.type, schoolTypes)
            case 'Straße':
              return school.address.street + school.address.houseNumber
            case 'Stadt':
              return school.address.city.postcode +
                school.address.city.designation +
                school.address.city.governmentDistrict +
                school.address.city.constituency
            case 'Kontakte':
              return school.contacts.map(c => c.surname).join()
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

  updateDetailData() {
    console.log(this.detailData.data)
    console.log(this.expandedElement)
    this.detailData.data = this.expandedElement.events
  }

  onSearchClear() {
    this.searchKey = ''
    this.selectedFilterOption = this.filterOptions[0]
    this.applyFilter()
  }

  toggleSelectAll() {
    if (this.selectedSchoolsIds.length !== this.listData.data.length) {
      this.selectedSchoolsIds.splice(0)
      this.listData.data.forEach(({school}) => this.selectedSchoolsIds.push(school.id))
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
    console.log('schoolName, uuid')
    console.log(schoolName, uuid)
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

  deleteEvent(eventName: string, uuid: string) {
    console.log('Termin löschen')
    console.log(eventName, uuid)
    if (confirm('Seid ihr sicher, dass ihr "' + eventName + '" löschen möchtet?')) {
      this.service.deleteEvents(uuid).subscribe(it => {
        console.log('Termin löschen 2')
        if (it !== undefined) {
          this.notificationService.success(':: Termin wurde erfolgreich entfernt.')
          // remove event from table
          this.ngOnInit()
        } else {
          this.notificationService.failure('-- Termin konnte nicht entfernt werden.')
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
    /*if (this.warnIfSelectedSchoolsIsEmpty()) return
    this.service.createSheet(this.selectedSchoolsIds.map(id => this.getSchoolWithEventsById(id)).filter(({school}) => school !== null))
      .subscribe(result => saveBlobAsFile(
        result,
        generateTitle(
          this.selectedSchoolsIds,
          'adressen',
          '.xlsx',
          this.datePipe
        )
      ))*/
  }

  private buildCustomSorting() {
    this.listData.sortingDataAccessor = ({school}, id) => {
      switch (id) {
        case 'name':
          return school.name.toLocaleLowerCase()
        case 'type':
          return this.getSchoolTypeById(school.type).toLocaleLowerCase()
        case 'city':
          return `${school.address.city.postcode}, ${school.address.city.designation}`.toLocaleLowerCase()
        case 'address':
          return `${school.address.street}, ${school.address.houseNumber}`.toLocaleLowerCase()
        default:
          throw Error(id)
      }
    }
  }

  private getSchoolWithEventsById(id: string): SchoolWithEvents {
    return this.listData.data.find(({school}) => school.id === id) ?? null
  }

  setSelectedValue(event: MatRadioChange) {
    this.selectedFilterOption = event.value
    this.applyFilter()
  }
}
