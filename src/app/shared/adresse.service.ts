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

  public currentSchuleId: string = undefined;
  public currentAdresseId: string = undefined;
  public currentAdresse: Adresse = undefined;

  public formGroup: FormGroup = new FormGroup({
    adresseId: new FormControl(null),
    regierungsbezirk: new FormControl('', Validators.required),
    kreis: new FormControl('', Validators.required),
    plz: new FormControl('', Validators.required),
    bezeichnung: new FormControl('', Validators.required),
    strasse: new FormControl('', Validators.required),
    hausnummer: new FormControl('', Validators.required)
  });

  initializeFormGroup() {
    this.formGroup.setValue({
      adresseId: null,
      regierungsbezirk: '',
      kreis: '',
      plz: '',
      bezeichnung: '',
      strasse: '',
      hausnummer: ''
    });
  }

  loadSchule(schule: Schule) {
    this.formGroup.setValue({
      adresseId: schule.adress_id,
      regierungsbezirk: schule.ort.regierungsbezirk,
      kreis: schule.ort.kreis,
      plz: schule.ort.plz,
      bezeichnung: schule.ort.bezeichnung,
      strasse: schule.adresse.strasse,
      hausnummer: schule.adresse.hausnummer
    });
  }
}
