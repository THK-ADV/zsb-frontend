import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Kontakt, KontaktFunktion} from '../zsb-kontakt/kontakt';
import {Observable} from 'rxjs';
import {DatabaseService} from './database.service';

@Injectable({
  providedIn: 'root'
})
export class KontakteService {

  kontaktFunktionen: Observable<KontaktFunktion[]>;

  constructor(private dbService: DatabaseService) {
    this.kontaktFunktionen = this.dbService.getKontaktFunktionen();
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
