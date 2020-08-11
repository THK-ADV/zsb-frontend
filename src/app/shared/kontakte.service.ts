import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Kontakt, KontaktAnrede, KontaktFunktion} from '../zsb-kontakt/kontakt';
import {Observable} from 'rxjs';
import {DatabaseService} from './database.service';

@Injectable({
  providedIn: 'root'
})
export class KontakteService {

  kontaktFunktionen: Observable<KontaktFunktion[]>;
  kontaktAnredeOptionen: Observable<KontaktAnrede[]>;

  constructor(private dbService: DatabaseService) {
    this.kontaktFunktionen = this.dbService.getKontaktFunktionen();
    this.kontaktAnredeOptionen = this.dbService.getKontaktAnredeOptionen();
  }

  public kontaktForm: FormGroup = new FormGroup({
    uuid: new FormControl(null),
    name: new FormControl('', Validators.required),
    vorname: new FormControl(''),
    anrede: new FormControl(0, Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    funktion: new FormControl('', Validators.required),
  });

  public searchForm: FormGroup = new FormGroup({
    searchKey: new FormControl(''),
    enableEdit: new FormControl(false)
  });

  initializeKontaktForm() {
    this.kontaktForm.setValue({
      uuid: null,
      name: '',
      vorname: '',
      anrede: 0,
      email: '',
      funktion: '',
    });
  }

  populateKontaktForm(kontakt: Kontakt) {
    this.kontaktForm.setValue({
      uuid: kontakt.uuid,
      name: kontakt.name,
      vorname: kontakt.vorname,
      anrede: kontakt.anrede,
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

  clearSearch() {
    this.searchForm.patchValue({searchKey: ''});
  }
}
