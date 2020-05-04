import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Schule} from '../zsb-schule/schule';

@Injectable({
  providedIn: 'root'
})
export class SchuleService {

  formGroup: FormGroup = new FormGroup({
    $key: new FormControl(null),
    name: new FormControl('', Validators.required),
    schulform: new FormControl(''),
    schwerpunkt: new FormControl(null),
    adresse: new FormControl(0, Validators.required),
    ort: new FormControl(0, Validators.required),
    schulleitung_mail: new FormControl('', Validators.email),
    stubo_mail: new FormControl(''),
    kooperationsvertrag: new FormControl(null),
    schueleranzahl: new FormControl(''),
    kaoa_hochschule: new FormControl(false),
    talentscouting: new FormControl(false)
  });

  initializeFormGroup() {
    this.formGroup.setValue({
      $key: null,
      name: '',
      schulform: '',
      schwerpunkt: '',
      adresse: null,
      ort: null,
      schulleitung_mail: '',
      stubo_mail: '',
      kooperationsvertrag: false,
      schueleranzahl: '',
      kaoa_hochschule: false,
      talentscouting: false
    });
  }

  loadFormData(schule: Schule) {
    this.formGroup.setValue({
      $key: schule.schule_id,
      name: schule.name,
      schulform: schule.schulform,
      schwerpunkt: schule.schwerpunkt,
      adresse: schule.adress_id,
      ort: schule.ort.ort_id,
      schulleitung_mail: schule.schulleitung_mail,
      stubo_mail: schule.stubo_mail,
      kooperationsvertrag: schule.kooperationsvertrag,
      schueleranzahl: schule.schueleranzahl,
      kaoa_hochschule: schule.kaoa_hochschule,
      talentscouting: schule.talentscouting
    });
  }

  insertSchule(schule: Schule) {
  }

  updateSchule(schule: Schule) {
  }

  deleteSchule(schule: Schule) {
  }
}
