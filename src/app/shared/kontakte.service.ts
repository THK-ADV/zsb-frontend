import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Kontakt} from '../zsb-kontakt/kontakt';

@Injectable({
  providedIn: 'root'
})
export class KontakteService {

  constructor() {
  }

  public kontaktForm: FormGroup = new FormGroup({
    uuid: new FormControl(null),
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    funktion: new FormControl('', Validators.required),
  });

  initializeKontaktForm() {
    this.kontaktForm.setValue({
      uuid: null,
      name: '',
      email: '',
      funktion: '',
    });
  }

  populateKontaktForm(kontakt: Kontakt) {
    this.kontaktForm.setValue({
      uuid: kontakt.uuid,
      name: kontakt.name,
      email: kontakt.email,
      funktion: kontakt.funktion,
    });
  }

  /**
   * get the modified Kontakt from Form
   */
  getKontakt(): Kontakt {
    return this.kontaktForm.value;
  }
}
