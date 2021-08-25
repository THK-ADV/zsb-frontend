import {Injectable} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Address} from '../zsb-address/address'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
import {AddressResult, ZsbAddressComponent} from '../zsb-address/zsb-address.component'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor() {
  }

  public formGroup: FormGroup = new FormGroup({
    addressId: new FormControl(null),
    governmentDistrict: new FormControl('', Validators.required), // regierungsbezirk
    constituency: new FormControl('', Validators.required), // kreis
    postcode: new FormControl('', Validators.required),
    designation: new FormControl('', Validators.required), // designation
    street: new FormControl('', Validators.required),
    houseNumber: new FormControl('', Validators.required)
  })

  static getStandardDialogConfig(): MatDialogConfig {
    const config = new MatDialogConfig()
    config.disableClose = true
    config.width = '40%'
    return config
  }

  static openAddressDialog(
    dialog: MatDialog,
    uuid?: string,
    config: MatDialogConfig = this.getStandardDialogConfig()
  ): Observable<AddressResult> {
    const ref = dialog.open(ZsbAddressComponent, config)
    ref.componentInstance.addressId = uuid
    return ref.afterClosed()
  }

  initializeFormGroup() {
    this.formGroup.setValue({
      addressId: null,
      governmentDistrict: '',
      constituency: '',
      postcode: '',
      designation: '',
      street: '',
      houseNumber: ''
    })
  }

  loadAddress(address: Address) {
    this.formGroup.setValue({
      addressId: address.address_id,
      governmentDistrict: address.city.governmentDistrict,
      constituency: address.city.constituency,
      postcode: address.city.postcode,
      designation: address.city.designation,
      street: address.street,
      houseNumber: address.houseNumber
    })
  }

}
