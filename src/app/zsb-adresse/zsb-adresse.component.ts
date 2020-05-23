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

  // selected values, used for autocomplete and filtering
  selectedPlz;
  selectedBeschreibung;
  selectedStrasse;
  selectedHausnummer;

  schuleId: number;
  adresseId: number;
  ortId: number;

  plzOptionsComplete: string[] = [];
  plzOptions: string[] = [];
  bezeichnungOptionsComplete: string[] = [];
  bezeichnungOptions: string[] = [];
  filteredPlzOptions: Observable<string[]>;
  filteredOrtOptions: Observable<string[]>;
  filteredStrasseOptions: Observable<string[]>;
  filteredHausnummerOptions: Observable<string[]>;


  ngOnInit(): void {
    this.service.initializeFormGroup();
    this.service.formGroup.valueChanges.subscribe(() => this.updateValidOptions());


    this.orteObservable = this.dbService.getOrte();
    this.orteObservable.subscribe(orte => this.orte = orte);
    this.adressenObservable = this.dbService.getAdressenAtomic();

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

          this.selectedPlz = schule.ort.plz;
          this.selectedBeschreibung = schule.ort.bezeichnung;
          this.selectedStrasse = schule.adresse.strasse;
          this.selectedHausnummer = schule.adresse.hausnummer;

          this.adressenObservable.subscribe(it => {
            const plzArray = it.map(value => value.ort.plz.toString());
            const ortArray = it.map(value => value.ort.bezeichnung);
            const adresse = this.dbService.getAdresseFromArrayByAdressId(it, this.adresseId);
            this.ortId = adresse.ort_id;

            this.plzOptionsComplete = plzArray;
            this.bezeichnungOptionsComplete = ortArray;
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

    this.filteredOrtOptions = this.service.formGroup.controls.bezeichnung.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.bezeichnungOptions))
    );
  }

  private updateValidOptions() {
    this.bezeichnungOptions = this.bezeichnungOptionsComplete.filter(
      bezeichnung => this.orte
        .find(ort => ort.bezeichnung === bezeichnung && ort.plz === +this.service.formGroup.value.plz) !== undefined
    );

    // TODO
    //  update strasse
    //  update hausnr.
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();

    return options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}
