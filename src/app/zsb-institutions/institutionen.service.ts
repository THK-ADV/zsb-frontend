import {Injectable} from '@angular/core'
import {DatabaseService} from '../shared/database.service'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Institution} from './institution'
import {Address} from '../zsb-address/address'
import {getReadableAddress} from '../shared/functions'

@Injectable({
  providedIn: 'root'
})
export class InstitutionenService {

  constructor(public dbService: DatabaseService) {
  }

  private instForm: FormGroup = new FormGroup({
    uuid: new FormControl(null),
    designation: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl({value: '', disabled: true}, Validators.required)
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

  updateAdresseInForm(newAdresse: Address) {
    this.instForm.patchValue({
      address: getReadableAddress(newAdresse, newAdresse.city)
    })
  }

  getInstForm(): FormGroup {
    return this.instForm
  }

  deleteInstitution(uuid: string) {
    return this.dbService.deleteInstitution(uuid)
  }

  getInstitutionen() {
    return this.dbService.getAllInstitutions()
  }
}
