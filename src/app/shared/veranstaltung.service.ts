import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {Observable} from 'rxjs';
import {Veranstaltung} from '../zsb-veranstaltungen/veranstaltung';
import {Kategorie} from '../zsb-veranstaltungen/kategorie';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class VeranstaltungService {

  private kategorien: Kategorie[] = [];
  private detailForm: FormGroup = new FormGroup({
    uuid: new FormControl(null),
    datum: new FormControl({value: '', disabled: true}),
    bezeichnung: new FormControl(''),
    thema: new FormControl(''),
    veranstalterToggle: new FormControl(true),
    schule: new FormControl(null),
    institution: new FormControl(null),
    kategorie: new FormControl(0),
    stufe: new FormControl(0),
    anzahlSus: new FormControl(0),
    vortragsart: new FormControl(0),
    ablaufUndBewertung: new FormControl(''),
    berichtBtn: new FormControl({value: '', disabled: true}),
    kontakt: new FormControl(''),
    veranstalterId: new FormControl('', Validators.required)
  });

  constructor(public dbService: DatabaseService) {
    this.dbService.getKategorien().subscribe(it => this.kategorien = it);
  }

  getVeranstaltungen(): Observable<Veranstaltung[]> {
    return this.dbService.getAllVeranstaltungen();
  }

  getKategorien(): Kategorie[] {
    return this.kategorien;
  }

  deleteVeranstaltung(uuid: string) {
    return this.dbService.deleteVeranstaltung(uuid);
  }

  getDetailForm(): FormGroup {
    return this.detailForm;
  }

  initializeDetailForm() {
    this.detailForm.setValue({
      uuid: null,
      datum: {value: new FormControl((new Date()).toISOString()), disabled: true},
      bezeichnung: '',
      thema: '',
      veranstalterToggle: true,
      schule: null,
      institution: null,
      kategorie: 0,
      stufe: 0,
      anzahlSus: 0,
      vortragsart: 0,
      ablaufUndBewertung: '',
      berichtBtn: {value: '', disabled: true},
      kontakt: '',
      veranstalterId: ''
    });
  }

  loadFormData(veranstaltung: Veranstaltung) {
    this.detailForm.setValue({
      uuid: veranstaltung.uuid,
      datum: {value: veranstaltung.datum, disabled: true},
      bezeichnung: veranstaltung.bezeichnung,
      thema: veranstaltung.thema,
      veranstalterToggle: true,
      schule: veranstaltung.veranstalter.hochschul_id,
      institution: veranstaltung.veranstalter.institution_id,
      kategorie: veranstaltung.kategorie,
      stufe: veranstaltung.stufe,
      anzahlSus: veranstaltung.anzahlSus,
      vortragsart: veranstaltung.vortragsart,
      ablaufUndBewertung: veranstaltung.ablauf,
      berichtBtn: {value: '', disabled: true},
      kontakt: veranstaltung.kontaktperson_id,
      veranstalterId: ''
    });
  }

  insertOrUpdateCurrentVeranstaltung(notificationService: NotificationService) {
    const veranstalter = this.detailForm.value as Veranstaltung;
    veranstalter.datum = '10.10.2020';

    if (veranstalter.uuid === undefined) {
      this.dbService.createVeranstaltung(veranstalter).subscribe(it => {
        if (it.uuid !== undefined) {
          notificationService.success(':: Veranstaltung erfolgreich erstellt.');
        } else {
          notificationService.failure('-- Veranstaltung konnte nicht erstellt werden.');
        }
      });
    } else {
      this.dbService.updateVeranstaltung(veranstalter).subscribe(it => {
        if (it.uuid !== undefined) {
          notificationService.success(':: Veranstaltung erfolgreich aktualisiert.');
        } else {
          notificationService.failure('-- Veranstaltung konnte nicht aktualisiert werden.');
        }
      });
    }
  }
}
