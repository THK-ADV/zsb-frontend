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

  schuleId: string
  adresseId: string
  ortId: string

  initialAdresse: Adresse

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
    return adresseA.strasse === adresseA.strasse
      && adresseA.hausnummer === adresseB.hausnummer
      && adresseA.ort.regierungsbezirk === adresseB.ort.regierungsbezirk
      && adresseA.ort.kreis === adresseB.ort.kreis
      && adresseA.ort.plz === adresseB.ort.plz
      && adresseA.ort.bezeichnung === adresseB.ort.bezeichnung
  }

  ngOnInit(): void {
    this.service.initializeFormGroup()
    this.loadDataFromDB()

    this.schuleId = this.service.currentSchuleId
    this.adresseId = this.service.currentAdresseId

    // init autocomplete
    this.adressenObservable.subscribe(adressen => {
      // get all values and filter duplicates
      this.regierungsbezirkOptions = filterDuplicates(adressen.map(it => it.ort.regierungsbezirk.trim()))
      this.kreisOptions = filterDuplicates(adressen.map(it => it.ort.kreis.trim()))
      this.plzOptions = filterDuplicates(adressen.map(it => it.ort.plz.toString().trim()))
      this.bezeichnungOptions = filterDuplicates(adressen.map(it => it.ort.bezeichnung.trim()))
      this.strasseOptions = filterDuplicates(adressen.map(it => it.strasse.trim()))
      this.hausnummerOptions = filterDuplicates(adressen.map(it => it.hausnummer.trim()))

      this.updateAutocomplete()

      // load data from schule (if given)
      if (this.schuleId != null && this.adresseId != null) {
        this.initialAdresse = this.dbService.getAdresseFromArrayByAdressId(adressen, this.adresseId)
        this.ortId = this.initialAdresse.ort_id

        this.schuleObservable = this.dbService.getSchuleByIdAtomic(this.schuleId)
        this.schuleObservable.subscribe(schule => {
          if (this.adresseId !== schule.adress_id) {
            console.log('Given should be equal to requested: ' + this.adresseId + ' === ' + schule.adress_id)
            console.log('given adresseId does not match with schule.adress_id; using schule.adress_id')
            this.adresseId = schule.adress_id
          }

          this.service.loadAdresseFromSchule(schule)
        })
      } else {
        this.schuleObservable = undefined
        this.adressenObservable = undefined
      }
    })
  }


  onSubmit() {
    const newOrt: Ort = {
      regierungsbezirk: this.service.formGroup.value.regierungsbezirk,
      kreis: this.service.formGroup.value.kreis,
      bezeichnung: this.service.formGroup.value.bezeichnung,
      plz: this.service.formGroup.value.plz,
      ort_id: undefined
    }

    this.service.currentAdresse = {
      adress_id: undefined,
      strasse: this.service.formGroup.value.strasse,
      hausnummer: this.service.formGroup.value.hausnummer,
      ort_id: undefined,
      ort: newOrt
    }

    if (this.initialAdresse !== undefined && ZsbAdresseComponent.equalsWithoutId(this.service.currentAdresse, this.initialAdresse)) {
      this.service.currentAdresse = undefined
      console.log('Nothing changed here.')
    }

    this.onClose()
  }

  onClose() {
    this.dialogRef.close()
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


}
