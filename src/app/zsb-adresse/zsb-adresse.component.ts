import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Schule} from '../zsb-schule/schule';
import {Ort} from './ort';
import {Adresse} from './adresse';
import {DatabaseService} from '../shared/database.service';
import {ActivatedRoute} from '@angular/router';
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
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<ZsbAdresseComponent>) {
  }

  schuleObservable: Observable<Schule>;
  orteObservable: Observable<Ort[]>;
  orte: Ort[];
  adressenObservable: Observable<Adresse[]>;
  adressen: Adresse[];

  schuleId: number;
  adresseId: number;
  ortId: number;

  initialAdresse: Adresse;

  plzOptionsComplete: string[] = [];
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
          const plzDoubles = adressen.map(value => value.ort.plz.toString());
          this.plzOptionsComplete = plzDoubles.filter((it, index) => plzDoubles.indexOf(it) === index);
          const bezDoubles = adressen.map(value => value.ort.bezeichnung);
          this.bezeichnungOptionsComplete = bezDoubles.filter((it, index) => bezDoubles.indexOf(it) === index);
          const strasseDoubles = adressen.map(value => value.strasse);
          this.strasseOptionsComplete = strasseDoubles.filter((it, index) => strasseDoubles.indexOf(it) === index);
          const hnrDoubles = adressen.map(value => value.hausnummer);
          this.hausnummerOptionsComplete = hnrDoubles.filter((it, index) => hnrDoubles.indexOf(it) === index);

          this.service.loadSchule(schule);
          this.updateAutocomplete();
        });
      });
    } else {
      this.schuleObservable = undefined;
      this.adressenObservable = undefined;
    }
  }

  onSubmit() {
    const newOrt: Ort = {
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

    if (ZsbAdresseComponent.equalsWithoutId(this.service.currentAdresse, this.initialAdresse)) {
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
    this.filteredPlzOptions = controls.plz.valueChanges.pipe(
      startWith(''),
      map(plz => this._filter(plz, this.plzOptionsComplete))
    );

    this.filteredBezeichnungOptions = controls.bezeichnung.valueChanges.pipe(
      startWith(''),
      map(bezeichnung => this._filter(bezeichnung, this.bezeichnungOptions))
    );

    this.filteredStrasseOptions = controls.strasse.valueChanges.pipe(
      startWith(''),
      map(strasse => this._filter(strasse, this.strasseOptions))
    );

    this.filteredHausnummerOptions = controls.hausnummer.valueChanges.pipe(
      startWith(''),
      map(hausnummer => this._filter(hausnummer, this.hausnummerOptions))
    );

    console.log(this.plzOptionsComplete);
    console.log(this.filteredPlzOptions);
  }

  private updateValidOptions() {
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

  private removeInvalidFormDataByPlz() {
    let newBezeichnung = this.service.formGroup.value.bezeichnung;
    if (this.bezeichnungOptions.find(it => it === newBezeichnung) === undefined) {
      newBezeichnung = '';
    }

    this.service.formGroup.patchValue({bezeichnung: newBezeichnung});
  }

  private removeInvalidFormDataByBezeichnung() {
    let newStrasse = this.service.formGroup.value.strasse;
    if (!this.strasseOptions.some(it => it === newStrasse)) {
      newStrasse = '';
    }

    this.service.formGroup.patchValue({strasse: newStrasse});
  }

  private removeInvalidFormDataByStrasse() {
    let newHausnummer = this.service.formGroup.value.hausnummer;
    if (!this.hausnummerOptions.some(it => it === newHausnummer)) {
      newHausnummer = '';
    }

    this.service.formGroup.patchValue({hausnummer: newHausnummer});
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();

    return options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}
