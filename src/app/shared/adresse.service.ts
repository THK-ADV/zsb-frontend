import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Schule} from '../zsb-schule/schule';
import {Adresse} from '../zsb-adresse/adresse';

@Injectable({
  providedIn: 'root'
})
export class AdresseService {

  constructor() {
  }

  public currentSchuleId: number = undefined;
  public currentAdresseId: number = undefined;
  public currentAdresse: Adresse = undefined;

  public formGroup: FormGroup = new FormGroup({
    adresseId: new FormControl(null),
    plz: new FormControl('', Validators.required),
    bezeichnung: new FormControl('', Validators.required),
    strasse: new FormControl('', Validators.required),
    hausnummer: new FormControl('', Validators.required)
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
