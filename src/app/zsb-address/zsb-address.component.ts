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
  selector: 'app-zsb-adresse',
  templateUrl: './zsb-address.component.html',
  styleUrls: ['./zsb-address.component.css']
})
export class ZsbAddressComponent implements OnInit {

  constructor(
    public service: AddressService,
    private dbService: DatabaseService,
    public dialogRef: MatDialogRef<ZsbAddressComponent>) {
  }

  schuleObservable: Observable<School>
  orteObservable: Observable<City[]>
  orte: City[]
  adressenObservable: Observable<Address[]>
  adressen: Address[]

  public adresseId: string // filled via dialog
  private adresse: Address

  // options for all autocomplete inputs
  regierungsbezirkOptions: string[] = []
  filteredRegierungsbezirkOptions: Observable<string[]>
  kreisOptions: string[] = []
  filteredKreisOptions: Observable<string[]>
  plzOptions: string[] = []
  filteredPlzOptions: Observable<string[]>
  bezeichnungOptions: string[] = []
  filteredBezeichnungOptions: Observable<string[]>
  strasseOptions: string[] = []
  filteredStrasseOptions: Observable<string[]>
  hausnummerOptions: string[] = []
  filteredHausnummerOptions: Observable<string[]>

  private static equalsWithoutId(adresseA: Address, adresseB: Address): boolean {
    return adresseA.street === adresseB.street
      && adresseA.houseNumber === adresseB.houseNumber
      && adresseA.city.governmentDistrict === adresseB.city.governmentDistrict
      && adresseA.city.constituency === adresseB.city.constituency
      && adresseA.city.postcode === adresseB.city.postcode
      && adresseA.city.designation === adresseB.city.designation
  }

  ngOnInit(): void {
    this.service.initializeFormGroup()
    this.loadDataFromDB()
    this.initAutocomplete()

    if (this.addressId === undefined) {
      console.log('Adresse ID not given.')
      return
    }

    // not a uuid --> load empty form
    if (this.addressId === null) {
      return
    }

    this.loadAdresseById(this.addressId)
  }

  initAutocomplete() {
    this.adressenObservable.subscribe(adressen => {
      // get all values and filter duplicates
      this.regierungsbezirkOptions = filterDuplicates(adressen.map(it => it.city.governmentDistrict.trim()))
      this.kreisOptions = filterDuplicates(adressen.map(it => it.city.constituency.trim()))
      this.plzOptions = filterDuplicates(adressen.map(it => it.city.postcode.toString().trim()))
      this.bezeichnungOptions = filterDuplicates(adressen.map(it => it.city.designation.trim()))
      this.strasseOptions = filterDuplicates(adressen.map(it => it.street.trim()))
      this.hausnummerOptions = filterDuplicates(adressen.map(it => it.houseNumber.trim()))

      this.updateAutocomplete()
    })
  }


  onSubmit() {
    let adresseId = null
    if (this.addressId !== null) {
      adresseId = this.address.address_id
    }

    // maybe save ort id if nothing has changed. Should be covered by backend but would be cleaner here
    const newOrt: City = {
      governmentDistrict: this.service.formGroup.value.regierungsbezirk,
      constituency: this.service.formGroup.value.kreis,
      designation: this.service.formGroup.value.bezeichnung,
      postcode: this.service.formGroup.value.plz,
      ort_id: undefined
    }

    const newAdresse = {
      adress_id: adresseId,
      street: this.service.formGroup.value.strasse,
      houseNumber: this.service.formGroup.value.hausnummer,
      ort_id: undefined,
      city: newOrt
    }

    if (this.address !== undefined && ZsbAddressComponent.equalsWithoutId(this.address, newAdresse)) {
      console.log('Nothing changed here.')
      this.dialogRef.close(new AddressResult(this.address, AdresseStatus.NO_CHANGES))
    } else {
      console.log('return new/updated adresse')
      this.dbService.updateOrCreateCity(newOrt).subscribe(ort => {
        newAdresse.ort_id = ort.ort_id
        this.dbService.updateOrCreateAddress(newAdresse)
          .subscribe(result => {
            if (result === undefined) {
              this.dialogRef.close(new AddressResult(null, AdresseStatus.FAILURE))
            } else {
              this.dbService.getAddressAtomicById(result.address_id).subscribe(atomicAdresse => {
                this.dialogRef.close(new AddressResult(atomicAdresse, AdresseStatus.UPDATED))
              })
            }
          })
      })
    }
  }

  private loadDataFromDB() {
    this.orteObservable = this.dbService.getCities()
    this.orteObservable.subscribe(orte => this.orte = orte)
    this.adressenObservable = this.dbService.getAddressesAtomic()
    this.adressenObservable.subscribe(adressen => this.adressen = adressen)
  }

  private updateAutocomplete() {
    const controls = this.service.formGroup.controls

    this.filteredRegierungsbezirkOptions = filterOptions(controls.governmentDistrict, this.regierungsbezirkOptions)
    this.filteredKreisOptions = filterOptions(controls.constituency, this.kreisOptions)
    this.filteredPlzOptions = filterOptions(controls.postcode, this.plzOptions)
    this.filteredBezeichnungOptions = filterOptions(controls.designation, this.bezeichnungOptions)
    this.filteredStrasseOptions = filterOptions(controls.street, this.strasseOptions)
    this.filteredHausnummerOptions = filterOptions(controls.houseNumber, this.hausnummerOptions)
  }


  private loadAdresseById(adresseId: string) {
    this.dbService.getAddressAtomicById(adresseId)
      .subscribe(adresse => {
        this.adresse = adresse
        this.service.loadAddress(adresse)
      })
  }

  onCancel() {
    this.dialogRef.close(new AddressResult(null, AdresseStatus.CANCELLATION))
  }
}

export class AddressResult {
  adresse: Address
  status: AdresseStatus

  constructor(adresse: Address, status: AdresseStatus) {
    this.adresse = adresse
    this.status = status
  }
}

export enum AdresseStatus { UPDATED, NO_CHANGES, CANCELLATION, FAILURE }
