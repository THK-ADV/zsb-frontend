import {Injectable} from '@angular/core'
import {DatabaseService} from '../shared/database.service'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Institution} from './institution'
import {Adresse} from '../zsb-adresse/adresse'
import {getReadableAdresse} from '../shared/functions'

@Injectable({
  providedIn: 'root'
})
export class InstitutionenService {

  constructor(public dbService: DatabaseService) {
  }

  private instForm: FormGroup = new FormGroup({
    uuid: new FormControl(null),
    bezeichnung: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    adresse: new FormControl({value: '', disabled: true}, Validators.required)
  })

  initializeInstForm() {
    this.instForm.setValue({
      uuid: null,
      bezeichnung: '',
      email: '',
      adresse: ''
    })
  }

  loadFormData(institution: Institution) {
    this.instForm.setValue({
      uuid: institution.uuid,
      bezeichnung: institution.bezeichnung,
      email: institution.email,
      adresse: institution.adresse.ort
    })
  }

  updateAdresseInForm(newAdresse: Adresse) {
    this.instForm.patchValue({
      adresse: getReadableAdresse(newAdresse, newAdresse.ort)
    })
  }

  getInstForm(): FormGroup {
    return this.instForm
  }

  deleteInstitution(uuid: string) {
    return this.dbService.deleteInstitution(uuid)
  }

  getInstitutionen() {
    return this.dbService.getAllInstitutionen()
  }
}
