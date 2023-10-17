import {Injectable} from '@angular/core'
import {DatabaseService} from '../shared/database.service'
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms'
import {Institution} from './institution'
import {Address} from '../zsb-address/address'
import {getReadableAddress} from '../shared/functions'

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {

  constructor(public dbService: DatabaseService) {
  }

  private instForm: UntypedFormGroup = new UntypedFormGroup({
    uuid: new UntypedFormControl(null),
    designation: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    address: new UntypedFormControl({value: '', disabled: true}, Validators.required)
  })

  initializeInstForm() {
    this.instForm.setValue({
      uuid: null,
      designation: '',
      email: '',
      address: ''
    })
  }

  loadFormData(institution: Institution) {
    this.instForm.setValue({
      uuid: institution.uuid,
      designation: institution.designation,
      email: institution.email,
      address: institution.address.city
    })
  }

  updateAddressInForm(newAddress: Address) {
    this.instForm.patchValue({
      address: getReadableAddress(newAddress, newAddress.city)
    })
  }

  getInstForm(): UntypedFormGroup {
    return this.instForm
  }

  deleteInstitution(uuid: string) {
    return this.dbService.deleteInstitution(uuid)
  }

  getInstitutions() {
    return this.dbService.getAllInstitutions()
  }
}
