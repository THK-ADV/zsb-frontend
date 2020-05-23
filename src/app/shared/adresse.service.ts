import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Schule} from '../zsb-schule/schule';

@Injectable({
  providedIn: 'root'
})
export class AdresseService {

  constructor() {
  }

  public formGroup: FormGroup = new FormGroup({
    adresseId: new FormControl(null),
    plz: new FormControl(''),
    bezeichnung: new FormControl('Tets', Validators.required),
    strasse: new FormControl(''),
    hausnummer: new FormControl('')
  });

  initializeFormGroup() {
    this.formGroup.setValue({
      adresseId: null,
      plz: '',
      bezeichnung: '',
      strasse: '',
      hausnummer: ''
    });
  }

  loadSchule(schule: Schule) {
    this.formGroup.setValue({
      adresseId: schule.adress_id,
      plz: schule.ort.plz,
      bezeichnung: schule.ort.bezeichnung,
      strasse: schule.adresse.strasse,
      hausnummer: schule.adresse.hausnummer
    });
  }

  saveAdresse() {
    console.log('call saveAdresse() -> Not implemented.');
    // TODO
    //  - check new Ort? -> save
    //  - check new Adresse? -> save
    //  - save adresseId to schule
  }
}
