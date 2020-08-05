import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Schule} from '../zsb-schule/schule';
import {Ort} from './ort';
import {Adresse} from './adresse';
import {DatabaseService} from '../shared/database.service';
import {AdresseService} from '../shared/adresse.service';
import {map, startWith} from 'rxjs/operators';
import {MatDialogRef} from '@angular/material/dialog';

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

  schuleObservable: Observable<Schule>;
  orteObservable: Observable<Ort[]>;
  orte: Ort[];
  adressenObservable: Observable<Adresse[]>;
  adressen: Adresse[];

  schuleId: string;
  adresseId: string;
  ortId: string;

  initialAdresse: Adresse;

  regierungsbezirkOptionsComplete: string[] = [];
  // regierungsbezirkOptions: string[] = [];
  filteredRegierungsbezirkOptions: Observable<string[]>;

  kreisOptionsComplete: string[] = [];
  kreisOptions: string[] = [];
  filteredKreisOptions: Observable<string[]>;

  plzOptionsComplete: string[] = [];
  plzOptions: string[] = [];
  filteredPlzOptions: Observable<string[]>;

  bezeichnungOptionsComplete: string[] = [];
  bezeichnungOptions: string[] = [];
  filteredBezeichnungOptions: Observable<string[]>;

  strasseOptionsComplete: string[] = [];
  strasseOptions: string[] = [];
  filteredStrasseOptions: Observable<string[]>;

  hausnummerOptionsComplete: string[] = [];
  hausnummerOptions: string[] = [];
  filteredHausnummerOptions: Observable<string[]>;

  private static equalsWithoutId(adresseA: Adresse, adresseB: Adresse): boolean {
    return adresseA.strasse === adresseA.strasse
      && adresseA.hausnummer === adresseB.hausnummer
      && adresseA.ort.regierungsbezirk === adresseB.ort.regierungsbezirk
      && adresseA.ort.kreis === adresseB.ort.kreis
      && adresseA.ort.plz === adresseB.ort.plz
      && adresseA.ort.bezeichnung === adresseB.ort.bezeichnung;
  }

  ngOnInit(): void {
    this.service.initializeFormGroup();
    this.initializeInteractiveForm();
    this.loadDataFromDB();

    this.schuleId = this.service.currentSchuleId;
    this.adresseId = this.service.currentAdresseId;

    if (this.schuleId != null && this.adresseId != null) {
      this.schuleObservable = this.dbService.getSchuleByIdAtomic(this.schuleId);
      this.schuleObservable.subscribe(schule => {
        if (+this.adresseId !== +schule.adress_id) {
          console.log('Given should be equal to requested: ' + this.adresseId + ' === ' + schule.adress_id);
          console.log('given adresseId does not match with schule.adress_id; using schule.adress_id');
          this.adresseId = schule.adress_id;
        }

        this.adressenObservable.subscribe(adressen => {
          this.initialAdresse = this.dbService.getAdresseFromArrayByAdressId(adressen, this.adresseId);
          this.ortId = this.initialAdresse.ort_id;

          // get all values and filter duplicates
          this.regierungsbezirkOptionsComplete = this.filterDuplicates(adressen.map(it => it.ort.regierungsbezirk));
          this.kreisOptionsComplete = this.filterDuplicates(adressen.map(it => it.ort.kreis));
          this.plzOptionsComplete = this.filterDuplicates(adressen.map(it => it.ort.plz.toString()));
          this.bezeichnungOptionsComplete = this.filterDuplicates(adressen.map(it => it.ort.bezeichnung));
          this.strasseOptionsComplete = this.filterDuplicates(adressen.map(it => it.strasse));
          this.hausnummerOptionsComplete = this.filterDuplicates(adressen.map(it => it.hausnummer));

          this.service.loadSchule(schule);
          this.updateAutocomplete();
        });
      });
    } else {
      this.schuleObservable = undefined;
      this.adressenObservable = undefined;
    }
  }

  filterDuplicates(array) {
    return array.filter((it, index) => array.indexOf(it) === index);
  }

  onSubmit() {
    const newOrt: Ort = {
      regierungsbezirk: this.service.formGroup.value.regierungsbezirk,
      kreis: this.service.formGroup.value.kreis,
      bezeichnung: this.service.formGroup.value.bezeichnung,
      plz: this.service.formGroup.value.plz,
      ort_id: undefined
    };

    this.service.currentAdresse = {
      adress_id: undefined,
      strasse: this.service.formGroup.value.strasse,
      hausnummer: this.service.formGroup.value.hausnummer,
      ort_id: undefined,
      ort: newOrt
    };

    if (this.initialAdresse !== undefined && ZsbAdresseComponent.equalsWithoutId(this.service.currentAdresse, this.initialAdresse)) {
      this.service.currentAdresse = undefined;
      console.log('Nothing changed here.');
    }

    this.onClose();
  }

  onClose() {
    this.dialogRef.close();
  }

  private initializeInteractiveForm() {
    this.service.formGroup.valueChanges.subscribe(() => this.updateValidOptions());
    this.service.formGroup.controls.regierungsbezirk.valueChanges.subscribe(() => this.removeInvalidFormDataByBezirk());
    this.service.formGroup.controls.kreis.valueChanges.subscribe(() => this.removeInvalidFormDataByKreis());
    this.service.formGroup.controls.plz.valueChanges.subscribe(() => this.removeInvalidFormDataByPlz());
    this.service.formGroup.controls.bezeichnung.valueChanges.subscribe(() => this.removeInvalidFormDataByBezeichnung());
    this.service.formGroup.controls.strasse.valueChanges.subscribe(() => this.removeInvalidFormDataByStrasse());
  }

  private loadDataFromDB() {
    this.orteObservable = this.dbService.getOrte();
    this.orteObservable.subscribe(orte => this.orte = orte);
    this.adressenObservable = this.dbService.getAdressenAtomic();
    this.adressenObservable.subscribe(adressen => this.adressen = adressen);
  }

  private updateAutocomplete() {
    const controls = this.service.formGroup.controls;

    this.filteredRegierungsbezirkOptions = this.filterOptions(controls.regierungsbezirk, this.regierungsbezirkOptionsComplete);
    this.filteredKreisOptions = this.filterOptions(controls.kreis, this.kreisOptions);
    this.filteredPlzOptions = this.filterOptions(controls.plz, this.plzOptions);
    this.filteredBezeichnungOptions = this.filterOptions(controls.plz, this.bezeichnungOptions);
    this.filteredStrasseOptions = this.filterOptions(controls.strasse, this.strasseOptions);
    this.filteredHausnummerOptions = this.filterOptions(controls.hausnummer, this.hausnummerOptions);
  }

  filterOptions(control, options): Observable<string[]> {
    return control.valueChanges.pipe(
      startWith(''),
      map(it => this._filter(it, options))
    );
  }

  // update all valid options based on the current inputs
  private updateValidOptions() {
    const selectedBezirk = this.service.formGroup.value.regierungsbezirk;
    this.kreisOptions = this.kreisOptionsComplete
      .filter(kreis => this.adressen.some(it => it.ort.kreis === kreis && it.ort.regierungsbezirk === selectedBezirk));

    const selectedKreis = this.service.formGroup.value.kreis;
    this.plzOptions = this.plzOptionsComplete
      .filter(plz => this.adressen.some(it => it.ort.plz === +plz && it.ort.kreis === selectedKreis));

    const selectedPlz = this.service.formGroup.value.plz;
    this.bezeichnungOptions = this.bezeichnungOptionsComplete.filter(
      bezeichnung => this.orte
        .find(ort => ort.bezeichnung === bezeichnung && ort.plz === +selectedPlz) !== undefined || selectedPlz === ''
    );

    const selectedBezeichnung = this.service.formGroup.value.bezeichnung;
    this.strasseOptions = this.strasseOptionsComplete.filter(
      strasse => this.adressen.some(it => it.strasse === strasse && it.ort.bezeichnung === selectedBezeichnung)
    );

    const selectedStrasse = this.service.formGroup.value.strasse;
    this.hausnummerOptions = this.hausnummerOptionsComplete.filter(
      hausnummer => this.adressen.some(it => it.hausnummer === hausnummer && it.strasse === selectedStrasse)
    );
  }

  private replaceValueIfNotInOptions(newValue: string, options: string[]): string {
    if (!options.some(it => it === newValue)) {
      return '';
    }
    return newValue;
  }

  private removeInvalidFormDataByBezirk() {
    let newKreis = this.service.formGroup.value.kreis;
    newKreis = this.replaceValueIfNotInOptions(newKreis, this.kreisOptions);
    this.service.formGroup.patchValue({kreis: newKreis});
  }

  private removeInvalidFormDataByKreis() {
    let newPlz = this.service.formGroup.value.plz;
    newPlz = this.replaceValueIfNotInOptions(newPlz, this.plzOptions);
    this.service.formGroup.patchValue({plz: newPlz});
  }

  private removeInvalidFormDataByPlz() {
    let newBezeichnung = this.service.formGroup.value.bezeichnung;
    newBezeichnung = this.replaceValueIfNotInOptions(newBezeichnung, this.bezeichnungOptions);
    this.service.formGroup.patchValue({bezeichnung: newBezeichnung});
  }

  private removeInvalidFormDataByBezeichnung() {
    let newStrasse = this.service.formGroup.value.strasse;
    newStrasse = this.replaceValueIfNotInOptions(newStrasse, this.strasseOptions);
    this.service.formGroup.patchValue({strasse: newStrasse});
  }

  private removeInvalidFormDataByStrasse() {
    let newHausnummer = this.service.formGroup.value.hausnummer;
    newHausnummer = this.replaceValueIfNotInOptions(newHausnummer, this.hausnummerOptions);
    this.service.formGroup.patchValue({hausnummer: newHausnummer});
  }

  private _filter(value, options: string[]): string[] {
    const filterValue = value.toLowerCase();

    return options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}
