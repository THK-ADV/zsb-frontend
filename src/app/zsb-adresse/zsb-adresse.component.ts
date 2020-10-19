import {Component, OnInit} from '@angular/core'
import {Observable} from 'rxjs'
import {Schule} from '../zsb-schule/schule'
import {Ort} from './ort'
import {Adresse} from './adresse'
import {DatabaseService} from '../shared/database.service'
import {AdresseService} from '../shared/adresse.service'
import {MatDialogRef} from '@angular/material/dialog'
import {filterDuplicates, filterOptions} from '../shared/functions'

@Component({
  selector: 'app-zsb-adresse',
  templateUrl: './zsb-adresse.component.html',
  styleUrls: ['./zsb-adresse.component.css']
})
export class ZsbAdresseComponent implements OnInit {

  constructor(
    public service: AdresseService,
    private dbService: DatabaseService,
    public dialogRef: MatDialogRef<ZsbAdresseComponent>) {
  }

  schuleObservable: Observable<Schule>
  orteObservable: Observable<Ort[]>
  orte: Ort[]
  adressenObservable: Observable<Adresse[]>
  adressen: Adresse[]

  public adresseId: string // filled via dialog
  private adresse: Adresse

  // options for all autocomplete inputs
  regierungsbezirkOptions: string[] = []
  filteredRegierungsbezirkOptions: Observable<string[]>
  kreisOptions: string[] = []
  filteredKreisOptions: Observable<string[]>
  plzOptions: string[] = []
  filteredPlzOptions: Observable<string[]>
  bezeichnungOptions: string[] = []
  filteredBezeichnungOptions: Observable<string[]>
  strasseOptions: string[] = []
  filteredStrasseOptions: Observable<string[]>
  hausnummerOptions: string[] = []
  filteredHausnummerOptions: Observable<string[]>

  private static equalsWithoutId(adresseA: Adresse, adresseB: Adresse): boolean {
    return adresseA.strasse === adresseB.strasse
      && adresseA.hausnummer === adresseB.hausnummer
      && adresseA.ort.regierungsbezirk === adresseB.ort.regierungsbezirk
      && adresseA.ort.kreis === adresseB.ort.kreis
      && adresseA.ort.plz === adresseB.ort.plz
      && adresseA.ort.bezeichnung === adresseB.ort.bezeichnung
  }

  ngOnInit(): void {
    this.service.initializeFormGroup()
    this.loadDataFromDB()
    this.initAutocomplete()

    if (this.adresseId === undefined) {
      console.log('Adresse ID not given.')
      return
    }

    // not a uuid --> load empty form
    if (this.adresseId === null) {
      return
    }

    this.loadAdresseById(this.adresseId)
  }

  initAutocomplete() {
    this.adressenObservable.subscribe(adressen => {
      // get all values and filter duplicates
      this.regierungsbezirkOptions = filterDuplicates(adressen.map(it => it.ort.regierungsbezirk.trim()))
      this.kreisOptions = filterDuplicates(adressen.map(it => it.ort.kreis.trim()))
      this.plzOptions = filterDuplicates(adressen.map(it => it.ort.plz.toString().trim()))
      this.bezeichnungOptions = filterDuplicates(adressen.map(it => it.ort.bezeichnung.trim()))
      this.strasseOptions = filterDuplicates(adressen.map(it => it.strasse.trim()))
      this.hausnummerOptions = filterDuplicates(adressen.map(it => it.hausnummer.trim()))

      this.updateAutocomplete()
    })
  }


  onSubmit() {
    let adresseId = null
    if (this.adresseId !== null) {
      adresseId = this.adresse.adress_id
    }

    // maybe save ort id if nothing has changed. Should be covered by backend but would be cleaner here
    const newOrt: Ort = {
      regierungsbezirk: this.service.formGroup.value.regierungsbezirk,
      kreis: this.service.formGroup.value.kreis,
      bezeichnung: this.service.formGroup.value.bezeichnung,
      plz: this.service.formGroup.value.plz,
      ort_id: undefined
    }

    const newAdresse = {
      adress_id: adresseId,
      strasse: this.service.formGroup.value.strasse,
      hausnummer: this.service.formGroup.value.hausnummer,
      ort_id: undefined,
      ort: newOrt
    }

    if (this.adresse !== undefined && ZsbAdresseComponent.equalsWithoutId(this.adresse, newAdresse)) {
      console.log('Nothing changed here.')
      this.dialogRef.close(new AdresseResult(this.adresse, AdresseStatus.NO_CHANGES))
    } else {
      console.log('return new/updated adresse')
      this.dbService.updateOrCreateOrt(newOrt).subscribe(ort => {
        newAdresse.ort_id = ort.ort_id
        this.dbService.updateOrCreateAdresse(newAdresse)
          .subscribe(result => {
            if (result === undefined) {
              this.dialogRef.close(new AdresseResult(null, AdresseStatus.FAILURE))
            } else {
              this.dbService.getAdresseAtomicById(result.adress_id).subscribe(atomicAdresse => {
                this.dialogRef.close(new AdresseResult(atomicAdresse, AdresseStatus.UPDATED))
              })
            }
          })
      })
    }
  }

  private loadDataFromDB() {
    this.orteObservable = this.dbService.getOrte()
    this.orteObservable.subscribe(orte => this.orte = orte)
    this.adressenObservable = this.dbService.getAdressenAtomic()
    this.adressenObservable.subscribe(adressen => this.adressen = adressen)
  }

  private updateAutocomplete() {
    const controls = this.service.formGroup.controls

    this.filteredRegierungsbezirkOptions = filterOptions(controls.regierungsbezirk, this.regierungsbezirkOptions)
    this.filteredKreisOptions = filterOptions(controls.kreis, this.kreisOptions)
    this.filteredPlzOptions = filterOptions(controls.plz, this.plzOptions)
    this.filteredBezeichnungOptions = filterOptions(controls.bezeichnung, this.bezeichnungOptions)
    this.filteredStrasseOptions = filterOptions(controls.strasse, this.strasseOptions)
    this.filteredHausnummerOptions = filterOptions(controls.hausnummer, this.hausnummerOptions)
  }


  private loadAdresseById(adresseId: string) {
    this.dbService.getAdresseAtomicById(adresseId)
      .subscribe(adresse => {
        this.adresse = adresse
        this.service.loadAdresse(adresse)
      })
  }

  onCancel() {
    this.dialogRef.close(new AdresseResult(null, AdresseStatus.CANCELLATION))
  }
}

export class AdresseResult {
  adresse: Adresse
  status: AdresseStatus

  constructor(adresse: Adresse, status: AdresseStatus) {
    this.adresse = adresse
    this.status = status
  }
}

export enum AdresseStatus { UPDATED, NO_CHANGES, CANCELLATION, FAILURE }
