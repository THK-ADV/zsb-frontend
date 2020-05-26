import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Schule} from '../zsb-schule/schule';
import {Ort} from '../zsb-orte/ort';
import {Adresse} from '../zsb-orte/adresse';
import {DatabaseService} from '../shared/database.service';
import {ActivatedRoute} from '@angular/router';
import {AdresseService} from '../shared/adresse.service';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-zsb-adresse',
  templateUrl: './zsb-adresse.component.html',
  styleUrls: ['./zsb-adresse.component.css']
})
export class ZsbAdresseComponent implements OnInit {

  constructor(
    public service: AdresseService,
    private dbService: DatabaseService,
    private route: ActivatedRoute) {
  }

  schuleObservable: Observable<Schule>;
  orteObservable: Observable<Ort[]>;
  orte: Ort[];
  adressenObservable: Observable<Adresse[]>;
  adressen: Adresse[];

  schuleId: number;
  adresseId: number;
  ortId: number;

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


  ngOnInit(): void {
    this.service.initializeFormGroup();
    this.service.formGroup.valueChanges.subscribe(() => this.updateValidOptions());
    this.service.formGroup.controls.plz.valueChanges.subscribe(it => this.removeInvalidFormDataByPlz(it));

    this.orteObservable = this.dbService.getOrte();
    this.orteObservable.subscribe(orte => this.orte = orte);
    this.adressenObservable = this.dbService.getAdressenAtomic();
    this.adressenObservable.subscribe(adressen => this.adressen = adressen);

    this.route.paramMap.subscribe(params => {
      this.schuleId = +params.get('schuleId');
      this.adresseId = +params.get('adresseId');

      if (this.schuleId != null && this.adresseId != null) {
        this.schuleObservable = this.dbService.getSchuleByIdAtomic(this.schuleId);
        this.schuleObservable.subscribe(schule => {
          if (this.adresseId !== schule.adress_id) {
            console.log('given adresseId does not match with schule.adress_id; using schule.adress_id');
            this.adresseId = schule.adress_id;
          }

          this.adressenObservable.subscribe(it => {
            this.ortId = this.dbService.getAdresseFromArrayByAdressId(it, this.adresseId).ort_id;

            this.plzOptionsComplete = it.map(value => value.ort.plz.toString());
            this.bezeichnungOptionsComplete = it.map(value => value.ort.bezeichnung);
            this.strasseOptionsComplete = it.map(value => value.strasse);
            this.hausnummerOptionsComplete = it.map(value => value.hausnummer);

            this.service.loadSchule(schule);
            this.updateAutocomplete();
          });
        });
      } else {
        this.schuleObservable = undefined;
        this.adressenObservable = undefined;
      }
    });

  }

  onSubmit() {
    console.log('submit adressen changes');
  }

  private updateAutocomplete() {
    this.filteredPlzOptions = this.service.formGroup.controls.plz.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.plzOptionsComplete))
    );

    this.filteredBezeichnungOptions = this.service.formGroup.controls.bezeichnung.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.bezeichnungOptions))
    );

    this.filteredStrasseOptions = this.service.formGroup.controls.strasse.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.strasseOptions))
    );

    this.filteredHausnummerOptions = this.service.formGroup.controls.hausnummer.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.hausnummerOptions))
    );
  }

  private removeInvalidFormDataByPlz(newPlz: number) {
    let newBezeichnung = this.service.formGroup.value.bezeichnung;
    if (this.bezeichnungOptions.find(it => it === newBezeichnung) === undefined) {
      newBezeichnung = '';
    }

    this.service.formGroup.patchValue({
      bezeichnung: newBezeichnung,
    });
    console.log('Set to: \'' + newBezeichnung + '\'.');
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

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();

    return options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}
