import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {School} from '../../zsb-school/school'
import {SchoolService} from '../../shared/school.service'
import {Contact, ContactFunction} from '../../zsb-contact/contact'
import {Address} from '../../zsb-address/address'
import {MatTableDataSource} from '@angular/material/table'
import {DatePipe} from '@angular/common'
import {forkJoin, Subscription, throwError} from 'rxjs'
import {ActivatedRoute} from '@angular/router'
import {DatabaseService} from '../../shared/database.service'
import {AddressService} from '../../shared/address.service'
import {DatabaseEvent} from '../../zsb-events/event'
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import {animate, state, style, transition, trigger} from '@angular/animations'
import {schoolTypeDescById} from '../../zsb-school/schoolType'
import {cooperationPartnerDescById} from '../../zsb-school/cooperationPartner'
import {kaoaSupervisorDescById} from '../../zsb-school/kaoaSupervisor'
import {talentScoutDescById} from '../../zsb-school/talentScout'
import {map, switchMap} from 'rxjs/operators'
import {ContactSchool, ContactUniversity} from '../../zsb-events/eventContacts'

type EventFilterOption = 'Alle' | 'Name' | 'Kategorie' | 'Datum'

@Component({
  selector: 'app-zsb-school-event-detail',
  templateUrl: './zsb-school-event-detail.component.html',
  styleUrls: ['./zsb-school-event-detail.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class ZsbSchoolEventDetailComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    private addressService: AddressService,
    private datePipe: DatePipe,
    public service: SchoolService,
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  school: School = {
    id: '',
    name: '',
    type: 0,
    comment: '',
    amount_students11: 0,
    amount_students12: 0,
    amount_students13: 0,
    phonenumber: '',
    email: '',
    website: '',
    cooperationpartner: 0,
    kaoaSupervisor: 0,
    talentscout: 0,
    cooperationcontract: false,
    address_id: '',
    address: null,
    contacts_ids: [],
    contacts: []
  }
  schoolId: string
  address: Address = {
    id: '',
    street: '',
    houseNumber: '',
    city_id: '',
    city: {
      id: '',
      postcode: 0,
      designation: '',
      constituency: '',
      governmentDistrict: ''
    }
  }
  schoolType: string
  contacts: Contact[] = []
  contactFunctions: ContactFunction[]
  cooperation = {
    cooperationContract: '',
    cooperationPartner: '',
    kaoaSupervisor: '',
    talentScout: ''
  }
  eventsAtSchool: DatabaseEvent[] = []
  listData: MatTableDataSource<DatabaseEvent> = new MatTableDataSource<DatabaseEvent>()
  expandedElement: DatabaseEvent | null
  displayedColumns: Array<string> = [
    'designation',
    'category',
    'date'
  ]
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  contactData: MatTableDataSource<Contact> = new MatTableDataSource<Contact>()
  displayedContactColumns: Array<string> = [
    'contactName',
    'contactFeature'
  ]
  filterOptions: EventFilterOption[] = ['Alle', 'Name', 'Kategorie', 'Datum']
  selectedFilterOption: EventFilterOption = this.filterOptions[0]
  showFilterOptions = false

  private subs: Subscription[] = []

  ngOnInit(): void {
    this.subs.push(
      this.route.paramMap.pipe(
        switchMap(params => {
          this.schoolId = params.get('schoolId')
          if (this.schoolId != null) {
            return this.dbService.getSchoolById(this.schoolId)
          } else {
            return throwError('School ID not found')
          }
        }),
        switchMap(school => {
          this.school = school
          const contactObservables = school.contacts_ids && school.contacts_ids.length > 0
            ? school.contacts_ids.map(id => this.dbService.getContactById(id))
            : []
          return forkJoin({
            schoolType: this.dbService.getSchoolType(),
            cooperationPartner: this.dbService.getCooperationPartner(),
            kaoaSupervisor: this.dbService.getKaoaSupervisors(),
            talentScout: this.dbService.getTalentScouts(),
            address: this.dbService.getAddressAtomicById(school.address_id),
            events: this.dbService.getEvents().pipe(
              map(events => events.filter(event => event.school_id === this.schoolId))
            ),
            contacts: forkJoin(contactObservables)
          })
        })
      ).subscribe({
        next: (results: any) => {
          this.schoolType = schoolTypeDescById(this.school.type, results.schoolType)
          this.cooperation.cooperationPartner = cooperationPartnerDescById(this.school.cooperationpartner, results.cooperationPartner)
          this.cooperation.kaoaSupervisor = kaoaSupervisorDescById(this.school.kaoaSupervisor, results.kaoaSupervisor)
          this.cooperation.talentScout = talentScoutDescById(this.school.talentscout, results.talentScout)
          this.address = results.address
          this.eventsAtSchool = results.events
          this.listData = new MatTableDataSource(this.eventsAtSchool)
          this.listData.sort = this.sort
          this.listData.paginator = this.paginator
          this.contacts = results.contacts
          this.contactData = new MatTableDataSource(this.contacts)
          this.buildCooperationObject()
        },
        error: (error) => {
          console.error('Error:', error)
        }
      })
    )
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe()
    })
  }

  buildCooperationObject() {
    this.cooperation.cooperationContract = this.school.cooperationcontract ? 'ja' : 'nein'
  }

  getContactFunctionDescById(id: number) {
    return this.contactFunctions?.find(it => it.id === id)?.desc || 'Unbekannt'
  }

  toReadableDate(isoDate: string): string {
    const date = Date.parse(isoDate)
    return this.datePipe.transform(date, 'dd.MM.yyyy')
  }
}
