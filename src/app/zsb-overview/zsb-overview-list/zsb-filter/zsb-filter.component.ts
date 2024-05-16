import {Component, Inject} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {
  AmountStudentsFilter,
  CompositeFilter,
  ConstituencyFilter, CooperationFilter,
  DesignationFilter, EventDateFilter, EventNameFilter, Filter,
  GovernmentDistrictFilter, KAoAFilter, SchoolContactFilter,
  SchoolNameFilter,
  SchoolTypeFilter, TalentscoutingFilter, UniversityContactFilter
} from './filter'
import {SchoolWithEvents} from '../zsb-overview-list.component'
import {SchoolType} from '../../../zsb-school/schoolType'
import {DatabaseService} from '../../../shared/database.service'
import {Subscription, zip} from 'rxjs'
import {filterDuplicates, filterOptions} from '../../../shared/functions'
import {Address} from '../../../zsb-address/address'
import {AddressService} from '../../../shared/address.service'
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'

@Component({
  selector: 'app-zsb-filter',
  templateUrl: './zsb-filter.component.html',
  styleUrls: ['./zsb-filter.component.css']
})
export class ZsbFilterComponent {
  subs: Subscription[] = []
  schoolName = ''
  schoolNames: string[] = []
  schoolTypes: SchoolType[] = []
  addresses: Address[]
  governmentDistricts: string[] = []
  constituencies: string[] = []
  designations: string[] = []
  schoolWithEvents: SchoolWithEvents[]
  allSchoolsWithEvents: SchoolWithEvents[]
  schoolType = ''
  selectedType: SchoolType
  governmentDistrict = ''
  constituency = ''
  designation = ''
  lowerBound: number
  upperBound: number
  kaoa: boolean = undefined
  talentscouting: boolean = undefined
  cooperation: boolean = undefined
  eventName = ''
  eventNames: string[] = []
  contactPersonSchool = ''
  schoolContacts: string[] = []
  contactPersonUniversity = ''
  universityContacts: string[] = []
  date: Date

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ZsbFilterComponent>,
              private dbService: DatabaseService,
              public service: AddressService,
  ) {
    this.schoolWithEvents = data.schoolWithEvents
    this.allSchoolsWithEvents = [...data.schoolWithEvents]
    console.log(this.schoolWithEvents)
  }

  ngOnInit(): void {
    const controls = this.service.formGroup.controls

    this.dbService.getAddressesAtomic().subscribe(addresses => {
      this.addresses = addresses

      const governmentDistricts = filterDuplicates(addresses.map(it => it.city.governmentDistrict.trim()))
      const constituencies = filterDuplicates(addresses.map(it => it.city.constituency.trim()))
      const designations = filterDuplicates(addresses.map(it => it.city.designation.trim()))

      this.governmentDistricts = filterOptions(controls.governmentDistrict, governmentDistricts)
      this.constituencies = filterOptions(controls.constituency, constituencies)
      this.designations = filterOptions(controls.designation, designations)
    })

    this.subs.push(
      this.dbService.getSchoolType().subscribe(types =>
        this.schoolTypes = types
      )
    )

    this.subs.push(
      this.dbService.getSchoolsAtomic().subscribe(schools =>
        this.schoolNames = schools.map(school => school.name)
      )
    )

    this.subs.push(
      this.dbService.getEvents().subscribe(events =>
        this.eventNames = events.map(event => event.designation)
      )
    )

    this.subs.push(
      this.dbService.getSchoolContacts().subscribe(contacts =>
        this.schoolContacts = contacts.map(contact => contact.name)
      )
    )

    this.subs.push(
      this.dbService.getUniversityContacts().subscribe(contacts =>
        this.universityContacts = contacts.map(contact => contact.name)
      )
    )

    // this.subs.push(
    //   zip(
    //     this.dbService.getSchoolsAtomic(),
    //     this.dbService.getSchoolType(),
    //     this.dbService.getEvents()
    //   ).subscribe(([schools, schoolTypes, events]) => {
    //       schools.forEach((school) => {
    //         const schoolEvents = events.filter((event) => {
    //           return (event.school_id === school.id)
    //         })
    //         const schoolWithEvent: SchoolWithEvents = {
    //           school,
    //           events: schoolEvents
    //         }
    //         this.allSchoolsWithEvents.push(schoolWithEvent)
    //       })
    //     }
    //   )
    // )
  }

  get filteredSchoolNames(): string[] {
    return this.schoolNames.filter(option =>
      option.trim().toLowerCase().includes(this.schoolName.trim().toLowerCase())
    )
  }

  get filteredSchoolTypes(): SchoolType[] {
    if (!this.schoolType) {
      return this.schoolTypes
    }
    const filteredList = this.schoolTypes.filter(option => {
      return option.desc.trim().toLowerCase().includes(this.schoolType.trim().toLowerCase())
    })
    return filteredList
  }

  get filteredGovernmentDistricts(): string[] {
    return this.governmentDistricts.filter(option =>
      option.trim().toLowerCase().includes(this.governmentDistrict.trim().toLowerCase())
    )
  }

  get filteredConstituencies(): string[] {
    return this.constituencies.filter(option =>
      option.trim().toLowerCase().includes(this.constituency.trim().toLowerCase())
    )
  }

  get filteredDesignations(): string[] {
    return this.designations.filter(option =>
      option.trim().toLowerCase().includes(this.designation.trim().toLowerCase())
    )
  }

  get filteredEventNames(): string[] {
    return this.eventNames.filter(option =>
      option.trim().toLowerCase().includes(this.eventName.trim().toLowerCase())
    )
  }

  get filteredSchoolContacts(): string[] {
    return this.schoolContacts.filter(option =>
      option.trim().toLowerCase().includes(this.contactPersonSchool.trim().toLowerCase())
    )
  }

  get filteredUniversityContacts(): string[] {
    return this.universityContacts.filter(option =>
      option.trim().toLowerCase().includes(this.contactPersonUniversity.trim().toLowerCase())
    )
  }

  onSchoolTypeSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedType = event.option.value
    this.schoolType = this.selectedType.desc
    console.log('type', this.selectedType)
  }

  resetFilters() {
    const resetData = {
      schoolWithEvents: null,
      amount: 0
    }
    this.dialogRef.close(resetData)
  }

  onSubmit() {
    const filters: Filter[] = []
    if (this.schoolName !== undefined && this.schoolName !== '') {
      filters.push(new SchoolNameFilter(this.schoolName))
    }
    if (!this.selectedType && this.schoolType) {
      const extractedType = this.schoolTypes.find(option =>
        option.desc.toLowerCase().includes(this.schoolType.toLowerCase())
      )
      this.selectedType = extractedType
    }
    if (this.selectedType !== undefined) {
      filters.push(new SchoolTypeFilter(this.selectedType.id))
    }
    if (this.governmentDistrict !== undefined && this.governmentDistrict !== '') {
      filters.push(new GovernmentDistrictFilter(this.governmentDistrict))
    }
    if (this.constituency !== undefined && this.constituency !== '') {
      filters.push(new ConstituencyFilter(this.constituency))
    }
    if (this.designation !== undefined && this.designation !== '') {
      filters.push(new DesignationFilter(this.designation))
    }
    if (this.lowerBound !== undefined && this.lowerBound >= 0
      && this.upperBound !== undefined && this.upperBound > 0) {
      filters.push(new AmountStudentsFilter(this.lowerBound, this.upperBound))
    }
    if (this.kaoa !== undefined) {
      filters.push(new KAoAFilter(this.kaoa))
    }
    if (this.talentscouting !== undefined) {
      filters.push(new TalentscoutingFilter(this.talentscouting))
    }
    if (this.cooperation !== undefined) {
      filters.push(new CooperationFilter(this.cooperation))
    }
    if (this.eventName !== undefined && this.eventName !== '') {
      filters.push(new EventNameFilter(this.eventName))
    }
    if (this.date !== undefined) {
      filters.push(new EventDateFilter(this.date))
    }
    if (this.contactPersonSchool !== undefined && this.contactPersonSchool !== '') {
      filters.push(new SchoolContactFilter(this.contactPersonSchool))
    }
    if (this.contactPersonUniversity !== undefined && this.contactPersonUniversity !== '') {
      filters.push(new UniversityContactFilter(this.contactPersonUniversity))
    }
    const compositeFilter = new CompositeFilter(filters)
    const filteredSchoolWithEvents = this.schoolWithEvents.filter(e => {
      return compositeFilter.filter(e)
    })
    this.dialogRef.close({schoolWithEvents: filteredSchoolWithEvents, amount: filters.length})
  }

  onCancel() {
    this.dialogRef.close()
  }
}
