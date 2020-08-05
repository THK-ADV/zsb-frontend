import {Injectable} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Schule} from '../zsb-schule/schule';
import {DatabaseService} from './database.service';
import {Observable} from 'rxjs';
import {Adresse} from '../zsb-adresse/adresse';
import {Ort} from '../zsb-adresse/ort';
import {NotificationService} from './notification.service';
import {Kontakt} from '../zsb-schule/kontakt';

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
    // schwerpunkt: new FormControl(null),
    adresse: new FormControl({value: '', disabled: true}),
    ort: new FormControl(0, Validators.required),
    kontakte: new FormArray([new FormControl()]),
    kooperationsvertrag: new FormControl(false),
    anzahl_sus: new FormControl(''),
    kaoa_hochschule: new FormControl(false),
    talentscouting: new FormControl(false)
  });

  // direct access to kontakte as array
  get kontakte(): FormArray {
    return this.formGroup.get('kontakte') as FormArray;
  }

  initializeFormGroup() {
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
  }

  loadFormData(schule: Schule) {
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

  addKontakte(kontakte: Kontakt[]) {
    kontakte.forEach(it => {
      this.addKontakt(it);
    });
  }

  removeKontakt(uuid: string) {
    // get all kontakte from form
    const schule = this.formGroup.value as Schule;
    const formKontakte = schule.kontakte;

    // find kontakt to be removed
    const wantedKontakt = formKontakte.find(it => it.uuid === uuid);
    const wantedIndex = formKontakte.indexOf(wantedKontakt);

    // remove contact
    formKontakte.splice(wantedIndex);

    // update form-array
    this.kontakte.clear();
    this.addKontakte(formKontakte);

    // update form
    // this.formGroup.patchValue({kontakte: this.kontakte});
    console.log('removed kontakt ' + uuid + ' from this schule');
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

  deleteSchule(schule: Schule) {
    // implement? theoretically not really needed.
  }

  // receive kontakt from db
  ensureKontaktId(kontakt: Kontakt, action: (kontaktId: string) => void) {
    if (kontakt === undefined || kontakt === null || kontakt.name === undefined || kontakt.email === undefined) {
      action(null);
    } else {
      this.dbService.updateOrCreateKontakt(kontakt).subscribe(it => {
        action(it.uuid);
      });
    }
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
        schule.kontakt_ids = schule.kontakte.map(it => it.uuid);
        schule.schwerpunkt = 'unbekannt';

        if (schule.schule_id === undefined || schule.schule_id === null) {
          this.dbService.createSchule(schule).subscribe(it => {
            if (it.schule_id !== undefined) {
              notificationService.success(':: Schule erfolgreich aktualisiert.');
            } else {
              notificationService.failure('-- Schule konnte nicht aktualisiert werden.');
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
