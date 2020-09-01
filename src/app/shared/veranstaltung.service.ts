import {Injectable} from '@angular/core'
import {DatabaseService} from './database.service'
import {Observable} from 'rxjs'
import {Veranstaltung} from '../zsb-veranstaltungen/veranstaltung'
import {Kategorie} from '../zsb-veranstaltungen/kategorie'
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms'
import {NotificationService} from './notification.service'
import {Veranstalter} from '../zsb-veranstaltungen/veranstalter'

@Injectable({
  providedIn: 'root'
})
export class VeranstaltungService {

  constructor(public dbService: DatabaseService) {
    this.dbService.getKategorien().subscribe(it => this.kategorien = it)
  }

  private kategorien: Kategorie[] = []
  private detailForm: FormGroup = new FormGroup({
    uuid: new FormControl(null),
    datum: new FormControl(new Date(), Validators.required),
    bezeichnung: new FormControl('', Validators.required),
    thema: new FormControl('', Validators.required),
    veranstalterToggle: new FormControl(true),
    schule: new FormControl(null),
    institution: new FormControl(null),
    kategorie: new FormControl(0, Validators.required),
    stufe: new FormControl(0, Validators.required),
    anzahlSus: new FormControl(0, Validators.required),
    vortragsart: new FormControl(0, Validators.required),
    ablauf: new FormControl(''),
    durchlaeufe: new FormControl(''),
    berichtBtn: new FormControl({value: '', disabled: true}),
    kontaktperson_id: new FormControl('', Validators.required),
    veranstalter_id: new FormControl(null)
  }, {validators: this.selectedVeranstalterRequired()})

  getVeranstaltungen(): Observable<Veranstaltung[]> {
    return this.dbService.getAllVeranstaltungen()
  }

  getKategorien(): Kategorie[] {
    return this.kategorien
  }

  deleteVeranstaltung(uuid: string) {
    return this.dbService.deleteVeranstaltung(uuid)
  }

  getDetailForm(): FormGroup {
    return this.detailForm
  }

  initializeDetailForm() {
    this.detailForm.setValue({
      uuid: null,
      datum: new Date(),
      bezeichnung: '',
      thema: '',
      veranstalterToggle: true,
      schule: null,
      institution: null,
      kategorie: 0,
      stufe: 0,
      anzahlSus: 0,
      vortragsart: 0,
      ablauf: '',
      durchlaeufe: '',
      berichtBtn: {value: '', disabled: true},
      kontaktperson_id: '',
      veranstalter_id: null
    })
  }

  loadFormData(veranstaltung: Veranstaltung) {
    const isHochschulVeranstalter = veranstaltung.veranstalter.hochschul_id !== null

    console.log(veranstaltung.veranstalter)

    this.detailForm.setValue({
      uuid: veranstaltung.uuid,
      datum: new Date(veranstaltung.datum),
      bezeichnung: veranstaltung.bezeichnung,
      thema: veranstaltung.thema,
      veranstalterToggle: isHochschulVeranstalter,
      schule: veranstaltung.veranstalter.hochschul_id,
      institution: veranstaltung.veranstalter.institution_id,
      kategorie: veranstaltung.kategorie,
      stufe: veranstaltung.stufe,
      anzahlSus: veranstaltung.anzahlSus,
      vortragsart: veranstaltung.vortragsart,
      ablauf: veranstaltung.ablauf,
      durchlaeufe: veranstaltung.durchlaeufe,
      berichtBtn: {value: '', disabled: true},
      kontaktperson_id: veranstaltung.kontaktperson_id,
      veranstalter_id: veranstaltung.veranstalter_id
    })
  }

  insertOrUpdateCurrentVeranstaltung(notificationService: NotificationService) {
    const veranstaltungForm = this.detailForm.value
    veranstaltungForm.datum = new Date(veranstaltungForm.datum).toISOString()

    const isHochschulVeranstalter = veranstaltungForm.veranstalterToggle as boolean
    let veranstalter: Veranstalter

    if (isHochschulVeranstalter) {
      veranstalter = {
        uuid: veranstaltungForm.veranstalter_id,
        hochschul_id: veranstaltungForm.schule ? veranstaltungForm.schule : null,
        institution_id: null
      }
    } else {
      veranstalter = {
        uuid: veranstaltungForm.veranstalter_id,
        hochschul_id: null,
        institution_id: veranstaltungForm.institution ? veranstaltungForm.institution : null
      }
    }

    let updatedVeranstalterObservable: Observable<Veranstalter>
    if (veranstaltungForm.veranstalter_id === undefined
      || veranstaltungForm.veranstalter_id === ''
      || veranstaltungForm.veranstalter_id === null) {
      console.log('Create Veranstalter:')
      updatedVeranstalterObservable = this.dbService.createVeranstalter(veranstalter)
    } else {
      console.log('Update Veranstalter:')
      updatedVeranstalterObservable = this.dbService.updateVeranstalter(veranstalter)
    }

    updatedVeranstalterObservable.subscribe(veranstalterWithId => {
      veranstaltungForm.veranstalter_id = veranstalterWithId.uuid
      if (veranstaltungForm.uuid === undefined || veranstaltungForm.uuid === null) {
        this.dbService.createVeranstaltung(veranstaltungForm).subscribe(it => {
          if (it.uuid !== undefined) {
            notificationService.success(':: Veranstaltung erfolgreich erstellt.')
          } else {
            notificationService.failure('-- Veranstaltung konnte nicht erstellt werden.')
          }
        })
      } else {
        this.dbService.updateVeranstaltung(veranstaltungForm).subscribe(it => {
          if (it.uuid !== undefined) {
            notificationService.success(':: Veranstaltung erfolgreich aktualisiert.')
          } else {
            notificationService.failure('-- Veranstaltung konnte nicht aktualisiert werden.')
          }
        })
      }
    })
  }

  selectedVeranstalterRequired() {
    // const isHochschulVeranstalter = this.detailForm.value.veranstalterToggle as boolean

    return (fg: FormGroup): ValidationErrors | null => {
      const isHochschulVeranstalter = fg.get('veranstalterToggle').value as boolean
      const schule = fg.get('schule').value
      const institution = fg.get('institution').value

      if ((isHochschulVeranstalter && (schule === undefined || schule === '' || schule === null))
        || (!isHochschulVeranstalter && (institution === undefined || institution === '' || institution === null))) {
        return {selectedVeranstalterRequired: 'Bitte einen Veranstalter wählen.'} as ValidationErrors
      }

      return null
    }
  }
}
