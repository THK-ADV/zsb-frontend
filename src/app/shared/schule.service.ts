import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Schule} from '../zsb-schule/schule';
import {DatabaseService} from './database.service';
import {Observable} from 'rxjs';
import {Adresse} from '../zsb-adresse/adresse';
import {Ort} from '../zsb-adresse/ort';
import {NotificationService} from './notification.service';

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
      adresse: this.getReadableAdresse(schule.adresse, schule.ort),
      ort: schule.ort.ort_id,
      schulleitung_mail: schule.schulleitung_mail,
      stubo_mail: schule.stubo_mail,
      kooperationsvertrag: schule.kooperationsvertrag,
      schueleranzahl: schule.schueleranzahl,
      kaoa_hochschule: schule.kaoa_hochschule,
      talentscouting: schule.talentscouting
    });
  }

  updateSchuleWithoutNewAdresse(schule: Schule, notificationService: NotificationService): Observable<Schule> {
    const newSchule = {
      schule_id: schule.schule_id,
      name: schule.name,
      schulform: schule.schulform,
      schwerpunkt: schule.schwerpunkt,
      adress_id: schule.adress_id,
      ort_id: undefined,
      schulleitung_mail: schule.schulleitung_mail,
      stubo_mail: schule.stubo_mail,
      kooperationsvertrag: schule.kooperationsvertrag,
      schueleranzahl: +schule.schueleranzahl,
      kaoa_hochschule: schule.kaoa_hochschule,
      talentscouting: schule.talentscouting,
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

    return this.newSchule;
  }

  deleteSchule(schule: Schule) {
    // implement? theoretically not really needed.
  }

  getReadableAdresse(adresse: Adresse, ort: Ort) {
    return adresse.strasse + ' ' + adresse.hausnummer + ', ' + ort.plz + ' ' + ort.bezeichnung;
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

        console.log('schule mit oder ohne ID ?');
        console.log(schule);
        schule.adresse = null;

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
  }
}
