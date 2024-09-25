import {Component, ElementRef, Inject, ViewChild} from '@angular/core'
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
import {FormControl} from '@angular/forms'

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
  selectedTypes: SchoolType[] = []
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
  schoolTypeCtrl = new FormControl()

  @ViewChild('schoolTypeInput') schoolTypeInput: ElementRef<HTMLInputElement>

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ZsbFilterComponent>,
              private dbService: DatabaseService,
              public service: AddressService,
  ) {
    this.schoolWithEvents = data.schoolWithEvents
    this.allSchoolsWithEvents = [...data.schoolWithEvents]
  }

  ngOnInit(): void {
    const controls = this.service.formGroup.controls

    this.dbService.getAddressesAtomic().subscribe(addresses => {
      this.addresses = addresses

      const governmentDistricts =
        filterDuplicates(addresses.map(it => it.city.governmentDistrict.trim()))
          .sort((a, b) => a.localeCompare(b))
      const constituencies = filterDuplicates(addresses.map(it => it.city.constituency.trim())).sort((a, b) => a.localeCompare(b))
      const designations = filterDuplicates(addresses.map(it => it.city.designation.trim())).sort((a, b) => a.localeCompare(b))

      this.governmentDistricts = filterOptions(controls.governmentDistrict, governmentDistricts)
      this.constituencies = filterOptions(controls.constituency, constituencies)
      this.designations = filterOptions(controls.designation, designations)
    })

    this.subs.push(
      this.dbService.getSchoolType().subscribe(types =>
        this.schoolTypes = types.sort((a, b) => a.desc.localeCompare(b.desc))
      )
    )

    this.subs.push(
      this.dbService.getSchoolsAtomic().subscribe(schools =>
        this.schoolNames = schools.map(school => school.name).sort((a, b) => a.localeCompare(b))
      )
    )

    this.subs.push(
      this.dbService.getEvents().subscribe(events =>
        this.eventNames = events.map(event => event.designation).sort((a, b) => a.localeCompare(b))
      )
    )

    this.subs.push(
      this.dbService.getSchoolContacts().subscribe(contacts =>
        this.schoolContacts = contacts.map(contact => contact.name).sort((a, b) => a.localeCompare(b))
      )
    )

    this.subs.push(
      this.dbService.getUniversityContacts().subscribe(contacts =>
        this.universityContacts = contacts.map(contact => contact.name).sort((a, b) => a.localeCompare(b))
      )
    )
  }

  get filteredSchoolNames(): string[] {
    return this.schoolNames.filter(option =>
      option.trim().toLowerCase().includes(this.schoolName.trim().toLowerCase())
    )
  }

  get filteredSchoolTypes(): SchoolType[] {
      return this.schoolTypes
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

  remove(option: SchoolType): void {
    const index = this.selectedTypes.findIndex(type => type.id === option.id)
    if (index >= 0) {
      this.selectedTypes.splice(index, 1)
      this.schoolTypeCtrl.setValue(null)
    }
  }

  onSchoolTypeSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedTypes.push(event.option.value)
    this.schoolTypeInput.nativeElement.value = ''
    this.schoolTypeCtrl.setValue(null)
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
    if (this.selectedTypes && this.selectedTypes.length > 0) {
      this.selectedTypes.forEach(selectedType => {
        filters.push(new SchoolTypeFilter(this.selectedTypes.map(type => type.id)))
      })
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
