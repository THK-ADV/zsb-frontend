import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {School} from '../../zsb-school/school'
import {SchoolService} from '../../shared/school.service'
import {Contact, ContactFunction} from '../../zsb-contact/contact'
import {Address} from '../../zsb-address/address'
import {MatTableDataSource} from '@angular/material/table'
import {DatePipe} from '@angular/common'
import {Subscription} from 'rxjs'
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
  address: Address
  schoolType: string
  contacts: Contact[] = []
  contactFunctions: ContactFunction[]
  cooperation = {
    cooperationContract: '',
    cooperationPartner: '',
    kaoaSupervisor: '',
    talentScout: ''
  }
  listData: MatTableDataSource<DatabaseEvent>
  expandedElement: DatabaseEvent | null
  displayedColumns: Array<string> = [
    'designation',
    'category',
    'date'
  ]
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  contactData: MatTableDataSource<Contact>
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
      this.route.paramMap.subscribe(params => {
        this.schoolId = params.get('schoolId')
        if (this.schoolId != null) {
          this.dbService.getSchoolById(this.schoolId).subscribe(school => {
            this.school = school
            school.contacts_ids.forEach(id => {
              this.dbService.getContactById(id).subscribe(contact => {
                this.contacts.push(contact)
                this.contactData = new MatTableDataSource(this.contacts)
              })
            })
            this.dbService.getSchoolType().subscribe(schoolType => {
              this.schoolType = schoolTypeDescById(school.type, schoolType)
            })
            this.dbService.getCooperationPartner().subscribe(partner => {
              this.cooperation.cooperationPartner = cooperationPartnerDescById(school.cooperationpartner, partner)
            })
            this.dbService.getKaoaSupervisors().subscribe(kaoaSupervisor => {
              this.cooperation.kaoaSupervisor = kaoaSupervisorDescById(school.kaoaSupervisor, kaoaSupervisor)
            })
            this.dbService.getTalentScouts().subscribe(talentScout => {
              this.cooperation.talentScout = talentScoutDescById(school.talentscout, talentScout)
            })
            this.dbService.getAddressAtomicById(school.address_id).subscribe(address => {
              this.address = address
            })
            this.dbService.getEvents().subscribe(events => {
              const eventsAtSchool: DatabaseEvent[] = []
              events.forEach((event) => {
                console.log('event')
                console.log(event)
                if (event.school_id === this.schoolId) {
                  eventsAtSchool.push(event)
                }
              })
              console.log('eventsAtSchool')
              console.log(eventsAtSchool)
              this.listData = new MatTableDataSource(eventsAtSchool)
              this.listData.sort = this.sort
              this.listData.paginator = this.paginator
              console.log('listData')
              console.log(this.listData)
            })
          })
        }
      })
    )
    this.buildCooperationObject()
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe()
    })
  }

  buildCooperationObject() {
    if (this.school.cooperationcontract) {
      this.cooperation.cooperationContract = 'ja'
    } else {
      this.cooperation.cooperationContract = 'nein'
    }
  }

  getContactFunctionDescById(id: number) {
    let desc = 'Unbekannt'

    if (this.contactFunctions !== undefined && this.contactFunctions !== null) {
      this.contactFunctions.forEach(it => {
        if (desc === 'Unbekannt') {
          if (it.id === id) {
            desc = it.desc
          }
        }
      })
    }
    return desc
  }

  toReadableDate(isoDate: string): string {
    const date = Date.parse(isoDate)
    return this.datePipe.transform(date, 'dd.MM.yyyy')
  }
}
