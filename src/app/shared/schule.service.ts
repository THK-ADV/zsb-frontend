import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Schule} from '../zsb-schule/schule';
import {DatabaseService} from './database.service';
import {Observable} from 'rxjs';
import {Adresse} from '../zsb-adresse/adresse';
import {Ort} from '../zsb-adresse/ort';
import {NotificationService} from './notification.service';
import {Kontakt} from '../zsb-schule/Kontakt';

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
    kontakt_a_name: new FormControl(''),
    kontakt_a_mail: new FormControl('', Validators.email),
    kontakt_b_name: new FormControl(''),
    kontakt_b_mail: new FormControl('', Validators.email),
    stubo_name: new FormControl(''),
    stubo_mail: new FormControl('', Validators.email),
    kooperationsvertrag: new FormControl(false),
    anzahl_sus: new FormControl(''),
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
      kontakt_a_name: '',
      kontakt_a_mail: '',
      kontakt_b_name: '',
      kontakt_b_mail: '',
      stubo_name: '',
      stubo_mail: '',
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
      schwerpunkt: schule.schwerpunkt,
      adresse: this.getReadableAdresse(schule.adresse, schule.ort),
      ort: schule.ort.ort_id,
      kontakt_a_name: schule.kontakt_a?.name ?? '',
      kontakt_a_mail: schule.kontakt_a?.email ?? '',
      kontakt_b_name: schule.kontakt_b?.name ?? '',
      kontakt_b_mail: schule.kontakt_b?.email ?? '',
      stubo_name: schule.stubo_kontakt?.name ?? '',
      stubo_mail: schule.stubo_kontakt?.email ?? '',
      kooperationsvertrag: schule.kooperationsvertrag,
      anzahl_sus: +schule.anzahl_sus,
      kaoa_hochschule: schule.kaoa_hochschule,
      talentscouting: schule.talentscouting
    });
  }

  updateSchuleWithoutNewAdresse(schule: Schule, notificationService: NotificationService) {
    schule = this.buildUpdatedKontakte(schule);
    this.ensureKontaktId(schule.kontakt_a, kontaktAID => {
      this.ensureKontaktId(schule.kontakt_b, kontaktBID => {
        this.ensureKontaktId(schule.stubo_kontakt, kontaktStuBoID => {
          const newSchule = {
            schule_id: schule.schule_id,
            name: schule.name,
            schulform: schule.schulform,
            schwerpunkt: schule.schwerpunkt,
            adress_id: schule.adress_id,
            ort_id: undefined,
            kooperationsvertrag: schule.kooperationsvertrag,
            anzahl_sus: +schule.anzahl_sus,
            kaoa_hochschule: schule.kaoa_hochschule,
            talentscouting: schule.talentscouting,
            kontakt_a_id: kontaktAID,
            kontakt_b_id: kontaktBID,
            stubo_kontakt_id: kontaktStuBoID,
            adresse: undefined,
            ort: undefined,
          };

          if (newSchule.schule_id == null) {
            // TODO error not create!
            this.newSchule = this.dbService.createSchule(newSchule);
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
        });
      });
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

  buildUpdatedKontakte(schule): Schule {
    const kontaktA = {
      uuid: null,
      name: schule.kontakt_a_name,
      email: schule.kontakt_a_mail
    };

    const kontaktB = {
      uuid: null,
      name: schule.kontakt_b_name,
      email: schule.kontakt_b_mail
    };

    const stubo = {
      uuid: null,
      name: schule.stubo_name,
      email: schule.stubo_mail
    };

    schule.kontakt_a = kontaktA;
    schule.kontakt_b = kontaktB;
    schule.stubo_kontakt = stubo;

    return schule;
  }

  insertOrUpdateSchule(schule: Schule, notificationService: NotificationService) {
    const ortObservable = this.dbService.updateOrCreateOrt(schule.ort);
    ortObservable.subscribe(newOrt => {
      const adresse = {
        adress_id: null,
        ort_id: newOrt.ort_id,
        strasse: schule.adresse.strasse,
        hausnummer: schule.adresse.hausnummer,
        ort: null
      };
      const adresseObservable = this.dbService.updateOrCreateAdresse(adresse);

      adresseObservable.subscribe(newAdresse => {
        schule.adress_id = newAdresse.adress_id;
        schule.adresse = null;

        schule = this.buildUpdatedKontakte(schule);

        this.ensureKontaktId(schule.kontakt_a, kontaktAID => {
          this.ensureKontaktId(schule.kontakt_b, kontaktBID => {
            this.ensureKontaktId(schule.stubo_kontakt, kontaktStuBoID => {
              schule.kontakt_a_id = kontaktAID;
              schule.kontakt_b_id = kontaktBID;
              schule.stubo_kontakt_id = kontaktStuBoID;

              if (schule.schule_id === undefined) {
                this.dbService.createSchule(schule);
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
        });
      });
    });
  }
}
