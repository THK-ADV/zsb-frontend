import {Injectable} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Schule} from '../zsb-schule/schule';
import {DatabaseService} from './database.service';
import {Observable} from 'rxjs';
import {Adresse} from '../zsb-adresse/adresse';
import {Ort} from '../zsb-adresse/ort';
import {NotificationService} from './notification.service';
import {Kontakt} from '../zsb-kontakt/kontakt';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SchuleService {

  constructor(private dbService: DatabaseService, private router: Router) {
  }

  newSchule: Observable<Schule>;

  formGroup: FormGroup = new FormGroup({
    schule_id: new FormControl(null),
    name: new FormControl('', Validators.required),
    schulform: new FormControl('', Validators.required),
    // schwerpunkt: new FormControl(null),
    adresse: new FormControl({value: '', disabled: true}, Validators.required),
    ort: new FormControl(0),
    kontakte: new FormArray([]),
    kooperationsvertrag: new FormControl(false),
    anzahl_sus: new FormControl('', Validators.required),
    kaoa_hochschule: new FormControl(false),
    talentscouting: new FormControl(false)
  });

  // direct access to kontakte as array
  get kontakte(): FormArray {
    return this.formGroup.get('kontakte') as FormArray;
  }

  initializeFormGroup() {
    this.kontakte.clear();
    this.kontakte.push(new FormControl());
    this.formGroup.setValue({
      schule_id: null,
      name: '',
      schulform: '',
      // schwerpunkt: '',
      adresse: null,
      ort: null,
      kontakte: [new FormControl()],
      kooperationsvertrag: false,
      anzahl_sus: '',
      kaoa_hochschule: false,
      talentscouting: false
    });
    this.kontakte.clear();
  }

  loadFormData(schule: Schule) {
    this.kontakte.clear();
    this.kontakte.push(new FormControl());

    this.formGroup.setValue({
      schule_id: schule.schule_id,
      name: schule.name,
      schulform: schule.schulform,
      // schwerpunkt: schule.schwerpunkt,
      adresse: this.getReadableAdresse(schule.adresse, schule.ort),
      ort: schule.ort.ort_id,
      kontakte: [new FormControl()],
      kooperationsvertrag: schule.kooperationsvertrag,
      anzahl_sus: +schule.anzahl_sus,
      kaoa_hochschule: schule.kaoa_hochschule,
      talentscouting: schule.talentscouting
    });

    this.kontakte.clear();
    this.addKontakte(schule.kontakte);
  }

  addKontakt(it: Kontakt) {
    this.kontakte.push(new FormControl(it));
  }

  private addKontakte(kontakte: Kontakt[]) {
    kontakte.forEach(it => {
      this.addKontakt(it);
    });
  }

  removeKontakt(uuid: string) {
    // get all kontakte from form
    const formKontakte = this.getKontakteFromForm();

    // find kontakt to be removed
    const wantedKontakt = formKontakte.find(it => it.uuid === uuid);
    const wantedIndex = formKontakte.indexOf(wantedKontakt);

    // remove contact
    formKontakte.splice(wantedIndex, 1);

    // update form-array
    this.refillFormArray(formKontakte);

    // update form
    console.log('removed kontakt ' + uuid + ' from this schule');
  }

  updateKontakt(updated: Kontakt) {
    const formKontakte = this.getKontakteFromForm();

    // get index of old kontakt
    const oldKontakt = formKontakte.find(it => it.uuid === updated.uuid);
    const index = formKontakte.indexOf(oldKontakt);

    // update kontakt
    formKontakte[index] = updated;

    // update form-array
    this.refillFormArray(formKontakte);
  }

  /** get all kontakte from form */
  private getKontakteFromForm(): Kontakt[] {
    const schule = this.formGroup.value as Schule;
    return schule.kontakte;
  }

  private refillFormArray(kontakte: Kontakt[]) {
    this.kontakte.clear();
    this.addKontakte(kontakte);
  }


  updateSchuleWithoutNewAdresse(schule: Schule, notificationService: NotificationService) {
    console.log('Kontakte before update:');

    schule.kontakte.forEach(it => {
      console.log(it.uuid + ': ' + it.name + ' (' + it.funktion + ') - ' + it.email);
    });

    const newSchule = {
      schule_id: schule.schule_id,
      name: schule.name,
      schulform: schule.schulform,
      schwerpunkt: 'unbekannt',
      adress_id: schule.adress_id,
      ort_id: undefined,
      kooperationsvertrag: schule.kooperationsvertrag,
      anzahl_sus: +schule.anzahl_sus,
      kaoa_hochschule: schule.kaoa_hochschule,
      talentscouting: schule.talentscouting,
      kontakte_ids: schule.kontakte.map(it => it.uuid),
      adresse: undefined,
      ort: undefined,
    };

    if (newSchule.schule_id == null) {
      notificationService.failure('-- Can\'t update "schule" without id. Please contact your administrator');
      return;
    } else {
      this.newSchule = this.dbService.updateSchule(newSchule);
    }

    this.newSchule.subscribe(it => {
      if (it.schule_id !== undefined) {
        notificationService.success(':: Schule erfolgreich aktualisiert.');
      } else {
        notificationService.failure('-- Schule konnte nicht aktualisiert werden.');
      }
    });
  }

  getReadableAdresse(adresse: Adresse, ort: Ort) {
    return adresse.strasse + ' ' + adresse.hausnummer + ', ' + ort.plz + ' ' + ort.bezeichnung;
  }

  insertOrUpdateSchule(schule: Schule, notificationService: NotificationService) {
    const ortObservable = this.dbService.updateOrCreateOrt(schule.ort);
    ortObservable.subscribe(newOrt => {
      const adresse = {
        adress_id: null,
        strasse: schule.adresse.strasse,
        hausnummer: schule.adresse.hausnummer,
        ort_id: newOrt.ort_id,
        ort: null
      };
      const adresseObservable = this.dbService.updateOrCreateAdresse(adresse);

      adresseObservable.subscribe(newAdresse => {
        schule.adress_id = newAdresse.adress_id;
        schule.adresse = null;
        schule.kontakte_ids = schule.kontakte.map(it => it.uuid);
        schule.schwerpunkt = 'unbekannt';

        // check if schule already exists
        if (schule.schule_id === undefined || schule.schule_id === null) {
          this.dbService.createSchule(schule).subscribe(it => {
            if (it.schule_id !== undefined) {
              notificationService.success(':: Schule erfolgreich erstellt.');
              // return to overview
              this.router.navigate(['/']);
            } else {
              notificationService.failure('-- Schule konnte nicht erstellt werden.');
            }
          });
        } else {
          const result = this.dbService.updateSchule(schule);
          result.subscribe(it => {
            if (it.schule_id !== undefined) {
              notificationService.success(':: Schule erfolgreich aktualisiert.');
            } else {
              notificationService.failure('-- Schule konnte nicht aktualisiert werden.');
            }
          });
        }
      });
    });
  }
}
