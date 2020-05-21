import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Schule} from '../zsb-schule/schule';
import {DatabaseService} from './database.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchuleService {

  constructor(private dbService: DatabaseService) {
  }

  newSchule: Observable<Schule>;

  formGroup: FormGroup = new FormGroup({
    schule_id: new FormControl(null),
    name: new FormControl('', Validators.required),
    schulform: new FormControl(''),
    schwerpunkt: new FormControl(null),
    adresse: new FormControl({value: '', disabled: true}),
    ort: new FormControl(0, Validators.required),
    schulleitung_mail: new FormControl('', Validators.email),
    stubo_mail: new FormControl('', Validators.email),
    kooperationsvertrag: new FormControl(false),
    schueleranzahl: new FormControl(''),
    kaoa_hochschule: new FormControl(false),
    talentscouting: new FormControl(false)
  });

  initializeFormGroup() {
    this.formGroup.setValue({
      schule_id: null,
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
      schule_id: schule.schule_id,
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

  updateSchule(schule: Schule) {
  }

  insertOrUpdateSchule(schule: Schule) {
    const newSchule: Schule = {
      schule_id: schule.schule_id,
      name: schule.name,
      schulform: schule.schulform,
      schwerpunkt: schule.schwerpunkt,
      adress_id: +schule.adresse, // cast to number via + operator
      ort_id: schule.ort.ort_id,
      schulleitung_mail: schule.schulleitung_mail,
      stubo_mail: schule.stubo_mail,
      kooperationsvertrag: schule.kooperationsvertrag,
      schueleranzahl: +schule.schueleranzahl,
      kaoa_hochschule: schule.kaoa_hochschule,
      talentscouting: schule.talentscouting,
      adresse: null,
      ort: null
    };
    console.log('Send Create/Update to server:');
    console.log(newSchule);

    if (newSchule.schule_id == null) {
      this.newSchule = this.dbService.createSchule(newSchule);
    } else {
      this.newSchule = this.dbService.updateSchule(newSchule);
    }
  }

  deleteSchule(schule: Schule) {
  }
}
