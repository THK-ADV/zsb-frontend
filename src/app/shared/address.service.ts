import {Injectable} from '@angular/core'
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms'
import {Address} from '../zsb-address/address'
import {MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig} from '@angular/material/legacy-dialog'
import {AddressResult, AddressStatus, ZsbAddressComponent} from '../zsb-address/zsb-address.component'
import {Observable} from 'rxjs'
import {tap} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor() {
  }

  public formGroup: UntypedFormGroup = new UntypedFormGroup({
    addressId: new UntypedFormControl(null),
    governmentDistrict: new UntypedFormControl('', Validators.required), // regierungsbezirk
    constituency: new UntypedFormControl('', Validators.required), // kreis
    postcode: new UntypedFormControl('', Validators.required),
    designation: new UntypedFormControl('', Validators.required), // designation
    street: new UntypedFormControl('', Validators.required),
    houseNumber: new UntypedFormControl('', Validators.required)
  })

  static getStandardDialogConfig(): MatDialogConfig {
    const config = new MatDialogConfig()
    config.disableClose = false
    config.width = '40%'
    return config
  }

  static openAddressDialog(
    dialog: MatDialog,
    uuid?: string,
    config: MatDialogConfig = this.getStandardDialogConfig()
  ): Observable<AddressResult> {
    const ref = dialog.open(ZsbAddressComponent, config)
    const s = ref.backdropClick().subscribe(() => ref.close(new AddressResult(null, AddressStatus.CANCELLATION)))
    ref.componentInstance.addressId = uuid
    return ref.afterClosed().pipe(tap(() => s.unsubscribe()))
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
