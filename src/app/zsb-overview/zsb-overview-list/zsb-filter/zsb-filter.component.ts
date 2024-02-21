import {Component, Inject} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {
  AmountStudentsFilter,
  CompositeFilter,
  ConstituencyFilter, CooperationFilter,
  DesignationFilter, Filter,
  GovernmentDistrictFilter, KAoAFilter,
  SchoolNameFilter,
  SchoolTypeFilter, TalentscoutingFilter
} from './filter'
import {SchoolWithEvents} from '../zsb-overview-list.component'
import {SchoolType} from '../../../zsb-school/schoolType'
import {DatabaseService} from '../../../shared/database.service'
import {Observable} from 'rxjs'
import {filterDuplicates, filterOptions} from '../../../shared/functions'
import {Address} from '../../../zsb-address/address'
import {AddressService} from '../../../shared/address.service'

@Component({
  selector: 'app-zsb-filter',
  templateUrl: './zsb-filter.component.html',
  styleUrls: ['./zsb-filter.component.css']
})
export class ZsbFilterComponent {
  schoolNameChecked = false
  schoolTypeChecked = false
  governmentDistrictChecked = false
  constituencyChecked = false
  designationChecked = false
  amountChecked = false
  terminChecked = false
  datumChecked = false
  personSchoolChecked = false
  personUniversityChecked = false
  schoolName = ''
  schoolTypes: Observable<SchoolType[]>
  addressesObservable: Observable<Address[]>
  addresses: Address[]
  governmentDistricts: Observable<string[]>
  constituencies: Observable<string[]>
  designations: Observable<string[]>
  schoolWithEvents: SchoolWithEvents[]
  selectedTypeId: number
  governmentDistrict: ''
  constituency: ''
  designation: ''
  lowerBound: number
  upperBound: number
  kaoa: boolean
  talentscouting: boolean
  cooperation: boolean
  termin: ''
  selectedDate: Date
  selectedPersonSchool: ''
  selectedPersonUniversity: ''

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ZsbFilterComponent>,
              private dbService: DatabaseService,
              public service: AddressService,
  ) {
    this.schoolWithEvents = data.schoolWithEvents
    console.log(this.schoolWithEvents)
  }

  ngOnInit(): void {
    const controls = this.service.formGroup.controls
    this.schoolTypes = this.dbService.getSchoolType()
    this.addressesObservable = this.dbService.getAddressesAtomic()
    this.addressesObservable.subscribe(addresses => this.addresses = addresses)
    this.addressesObservable.subscribe(adressen => {
      // get all values and filter duplicates
      this.governmentDistricts = filterOptions(controls.governmentDistrict,
        filterDuplicates(adressen.map(it => it.city.governmentDistrict.trim())))
      this.constituencies = filterOptions(controls.governmentDistrict,
        filterDuplicates(adressen.map(it => it.city.constituency.trim())))
      this.designations = filterOptions(controls.governmentDistrict,
        filterDuplicates(adressen.map(it => it.city.designation.trim())))
    })
  }

  onSchoolNameChange() {
    if (this.schoolName.trim() !== '') {
      this.schoolNameChecked = true
    }
  }

  onSchoolTypeChange() {
    /*if (this.type.trim() !== '') {
      this.schoolNameChecked = true
    }*/
  }

  onGovernmentDistrictChange() { }

  onConstituencyChange() { }

  onDesignationChange() { }

  onAmountChange() {}

  onSubmit() {
    const filters: Filter[] = []
    if (this.schoolName !== undefined && this.schoolName !== '') {
      filters.push(new SchoolNameFilter(this.schoolName))
    }
    if (this.selectedTypeId !== undefined) {
      filters.push(new SchoolTypeFilter(this.selectedTypeId))
    }
    if (this.governmentDistrict !== undefined && this.governmentDistrict !== '') {
      filters.push(new GovernmentDistrictFilter(this.governmentDistrict))
    }
    if (this.constituency !== undefined && this.constituency !== '') {
      filters.push(new GovernmentDistrictFilter(this.governmentDistrict))
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
    const compositeFilter = new CompositeFilter(filters)
    console.log(this.schoolName)
    console.log(this.selectedTypeId)
    console.log(this.governmentDistrict)
    console.log(this.constituency)
    console.log(this.designation)
    console.log(this.lowerBound)
    console.log(this.upperBound)
    console.log(this.kaoa)
    console.log(this.talentscouting)
    console.log(this.cooperation)
    const result = this.schoolWithEvents.filter(e => {
      return compositeFilter.filter(e)
    })
    this.dialogRef.close(result)
  }

  onCancel() {
    this.dialogRef.close()
  }
}
