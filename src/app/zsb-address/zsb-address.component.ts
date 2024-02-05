import {Component, OnInit} from '@angular/core'
import {Observable} from 'rxjs'
import {School} from '../zsb-school/school'
import {City} from './city'
import {Address} from './address'
import {DatabaseService} from '../shared/database.service'
import {AddressService} from '../shared/address.service'
import {MatDialogRef} from '@angular/material/dialog'
import {filterDuplicates, filterOptions} from '../shared/functions'

@Component({
  selector: 'app-zsb-address',
  templateUrl: './zsb-address.component.html',
  styleUrls: ['./zsb-address.component.css']
})
export class ZsbAddressComponent implements OnInit {

  constructor(
    public service: AddressService,
    private dbService: DatabaseService,
    public dialogRef: MatDialogRef<ZsbAddressComponent>) {
  }

  schoolObservable: Observable<School>
  citiesObservable: Observable<City[]>
  cities: City[]
  addressesObservable: Observable<Address[]>
  addresses: Address[]

  public addressId: string // filled via dialog
  private address: Address

  // options for all autocomplete inputs
  governmentDistrictOptions: string[] = []
  filteredGovernmentDistrictOptions: Observable<string[]>
  constituencyOptions: string[] = []
  filteredConstituencyOptions: Observable<string[]>
  postcodeOptions: string[] = []
  filteredPostcodeOptions: Observable<string[]>
  designationOptions: string[] = []
  filteredDesignationOptions: Observable<string[]>
  streetOptions: string[] = []
  filteredStreetOptions: Observable<string[]>
  houseNumberOptions: string[] = []
  filteredHouseNumberOptions: Observable<string[]>

  private static equalsWithoutId(addressA: Address, addressB: Address): boolean {
    return addressA.street === addressB.street
      && addressA.houseNumber === addressB.houseNumber
      && addressA.city.governmentDistrict === addressB.city.governmentDistrict
      && addressA.city.constituency === addressB.city.constituency
      && addressA.city.postcode === addressB.city.postcode
      && addressA.city.designation === addressB.city.designation
  }

  ngOnInit(): void {
    this.service.initializeFormGroup()
    this.loadDataFromDB()
    this.initAutocomplete()

    if (this.addressId === undefined) {
      console.log('Address ID not given.')
      return
    }

    // not a uuid --> load empty form
    if (this.addressId === null) {
      return
    }

    this.loadAddressById(this.addressId)
  }

  initAutocomplete() {
    this.addressesObservable.subscribe(adressen => {
      // get all values and filter duplicates
      this.governmentDistrictOptions = filterDuplicates(adressen.map(it => it.city.governmentDistrict.trim()))
      this.constituencyOptions = filterDuplicates(adressen.map(it => it.city.constituency.trim()))
      this.postcodeOptions = filterDuplicates(adressen.map(it => it.city.postcode.toString().trim()))
      this.designationOptions = filterDuplicates(adressen.map(it => it.city.designation.trim()))
      this.streetOptions = filterDuplicates(adressen.map(it => it.street.trim()))
      this.houseNumberOptions = filterDuplicates(adressen.map(it => it.houseNumber.trim()))

      this.updateAutocomplete()
    })
  }


  onSubmit() {
    let addressId = null
    if (this.addressId !== null) {
      addressId = this.address.id
    }

    // maybe save city id if nothing has changed. Should be covered by backend but would be cleaner here
    const newCity: City = {
      governmentDistrict: this.service.formGroup.value.governmentDistrict,
      constituency: this.service.formGroup.value.constituency,
      designation: this.service.formGroup.value.designation,
      postcode: this.service.formGroup.value.postcode,
      id: undefined
    }

    const newAddress = {
      id: addressId,
      street: this.service.formGroup.value.street,
      houseNumber: this.service.formGroup.value.houseNumber,
      city_id: undefined,
      city: newCity
    }

    if (this.address !== undefined && ZsbAddressComponent.equalsWithoutId(this.address, newAddress)) {
      console.log('Nothing changed here.')
      this.dialogRef.close(new AddressResult(this.address, AddressStatus.NO_CHANGES))
    } else {
      console.log('return new/updated address')
      this.dbService.updateOrCreateCity(newCity).subscribe(city => {
        newAddress.city_id = city.id
        this.dbService.updateOrCreateAddress(newAddress)
          .subscribe(result => {
            if (result === undefined) {
              this.dialogRef.close(new AddressResult(null, AddressStatus.FAILURE))
            } else {
              this.dbService.getAddressAtomicById(result.id).subscribe(atomicAddress => {
                this.dialogRef.close(new AddressResult(atomicAddress, AddressStatus.UPDATED))
              })
            }
          })
      })
    }
  }

  private loadDataFromDB() {
    this.citiesObservable = this.dbService.getCities()
    this.citiesObservable.subscribe(cities => this.cities = cities)
    this.addressesObservable = this.dbService.getAddressesAtomic()
    this.addressesObservable.subscribe(addresses => this.addresses = addresses)
  }

  private updateAutocomplete() {
    const controls = this.service.formGroup.controls

    this.filteredGovernmentDistrictOptions = filterOptions(controls.governmentDistrict, this.governmentDistrictOptions)
    this.filteredConstituencyOptions = filterOptions(controls.constituency, this.constituencyOptions)
    this.filteredPostcodeOptions = filterOptions(controls.postcode, this.postcodeOptions)
    this.filteredDesignationOptions = filterOptions(controls.designation, this.designationOptions)
    this.filteredStreetOptions = filterOptions(controls.street, this.streetOptions)
    this.filteredHouseNumberOptions = filterOptions(controls.houseNumber, this.houseNumberOptions)
  }


  private loadAddressById(addressId: string) {
    this.dbService.getAddressAtomicById(addressId)
      .subscribe(address => {
        this.address = address
        this.service.loadAddress(address)
      })
  }

  onCancel() {
    console.log('cancel')
    this.dialogRef.close(new AddressResult(null, AddressStatus.CANCELLATION))
  }
}

export class AddressResult {
  address: Address
  status: AddressStatus

  constructor(address: Address, status: AddressStatus) {
    this.address = address
    this.status = status
  }
}

export enum AddressStatus { UPDATED, NO_CHANGES, CANCELLATION, FAILURE }
