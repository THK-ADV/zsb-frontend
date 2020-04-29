import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DatabaseService} from './database.service';
import {Schule} from '../zsb-schule/schule';

@Injectable({
  providedIn: 'root'
})
export class SchuleService {

  constructor(dbService: DatabaseService) {
  }

  form: FormGroup = new FormGroup({
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
    this.form.setValue({
      $key: null,
      name: '',
      schulform: '',
      schwerpunkt: '',
      adresse: 0,
      ort: 0,
      schulleitung_mail: '',
      stubo_mail: '',
      kooperationsvertrag: false,
      schueleranzahl: '',
      kaoa_hochschule: false,
      talentscouting: false
    });
  }

  insertSchule(schule: Schule) {
  }

  updateSchule(schule: Schule) {
  }

  deleteSchule(schule: Schule) {
  }
}
