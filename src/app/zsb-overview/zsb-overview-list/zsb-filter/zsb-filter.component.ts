import {Component, Inject} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {
  CompositeFilter,
  ConstituencyFilter, CooperationFilter,
  DesignationFilter,
  GovernmentDisctrictFilter, KAoAFilter,
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
  schoolName = ''
  schoolTypes: Observable<SchoolType[]>
  addressesObservable: Observable<Address[]>
  addresses: Address[]
  governmentDistricts: Observable<string[]>
  constituencies: Observable<string[]>
  designations: Observable<string[]>
  schoolWithEvents: SchoolWithEvents[]
  selectedTypeId: number
  governmentDistrict: string
  constituency: string
  designation: string
  kaoa: boolean
  talentscouting: boolean
  cooperation: boolean

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
      console.log(this.governmentDistricts)
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

  onSubmit() {
    const schoolNameFilter = new SchoolNameFilter()
    const schoolTypeFilter = new SchoolTypeFilter()
    const governmentDistrictFilter = new GovernmentDisctrictFilter()
    const constituencyFilter = new ConstituencyFilter()
    const designationFilter = new DesignationFilter()
    const kaoaFilter = new KAoAFilter()
    const talentscoutingFilter = new TalentscoutingFilter()
    const cooperationFilter = new CooperationFilter()
    const compositeFilter = new CompositeFilter([schoolNameFilter, schoolTypeFilter])
    // const result = compositeFilter.filter(this.schoolWithEvents, filterCriteria)
    console.log('this.kaoa')
    console.log(this.talentscouting)
    const result = talentscoutingFilter.filter(this.schoolWithEvents, this.talentscouting)
    console.log(result)
    this.dialogRef.close(result)
  }

  onCancel() {
    this.dialogRef.close()
  }
}
