import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Schule} from '../schule';
import {DatabaseService} from '../../shared/database.service';
import {Observable} from 'rxjs';
import {Ort} from '../../zsb-adresse/ort';
import {Adresse} from '../../zsb-adresse/adresse';
import {SchuleService} from '../../shared/schule.service';
import {NotificationService} from '../../shared/notification.service';
import {Schulform} from '../schulform';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ZsbAdresseComponent} from '../../zsb-adresse/zsb-adresse.component';
import {AdresseService} from '../../shared/adresse.service';
import {AnzahlSus} from '../anzahl-sus';
import {KontaktFunktion} from '../kontakt';

@Component({
  selector: 'app-zsb-schule-detail',
  templateUrl: './zsb-schule-detail.component.html',
  styleUrls: ['./zsb-schule-detail.component.css']
})
export class ZsbSchuleDetailComponent implements OnInit {
  schuleId;
  schuleObservable: Observable<Schule>;
  orteObservable: Observable<Ort[]>;
  adressenObservable: Observable<Adresse[]>;
  schulformen: Observable<Schulform[]>;
  anzahlSusRanges: Observable<AnzahlSus[]>;
  kontaktFunktionen: KontaktFunktion[];

  adresseId: string;
  ortId: string;

  constructor(
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    private adresseService: AdresseService,
    public service: SchuleService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.orteObservable = this.dbService.getOrte();
    this.adressenObservable = this.dbService.getAdressen();

    this.schulformen = this.dbService.getSchulform();
    this.anzahlSusRanges = this.dbService.getAnzahlSus();

    // fill kontakt funktionen
    this.dbService.getKontaktFunktionen().subscribe(funktionen => {
      this.kontaktFunktionen = funktionen;
    });

    this.route.paramMap.subscribe(params => {
      this.schuleId = params.get('schuleId');

      if (this.schuleId != null) {
        this.schuleObservable = this.dbService.getSchuleByIdAtomic(this.schuleId);
        this.schuleObservable.subscribe(schule => {
          this.service.loadFormData(schule);
          this.adresseId = schule.adress_id;
          this.adressenObservable.subscribe(it => {
            const adresse = this.dbService.getAdresseFromArrayByAdressId(it, this.adresseId);
            this.ortId = adresse.ort_id;
          });
        });
      } else {
        this.schuleObservable = undefined;
      }
    });

    console.log('finished init (schule-detail-component)');
  }

  onSubmit() {
    console.log('SUB');

    const schule = this.service.formGroup.value;

    // remove nulls from kontakte-array
    const cleanedKontakte = [];
    schule.kontakte.forEach(it => {
      if (it != null) {
        cleanedKontakte.push(it);
      }
    });
    schule.kontakte = cleanedKontakte;

    if (this.adresseService.currentAdresse !== undefined) {
      schule.ort = this.adresseService.currentAdresse.ort;
      schule.adresse = this.adresseService.currentAdresse;
      this.service.insertOrUpdateSchule(schule, this.notificationService);
    } else {
      schule.adress_id = this.adresseId;
      this.service.updateSchuleWithoutNewAdresse(schule, this.notificationService);
    }
  }

  onClear() {
    console.log('CLEAR');
    this.service.formGroup.reset();
    this.service.initializeFormGroup();
    this.notificationService.success(':: Formular zurückgesetzt.');
  }

  changeAdresse() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '40%';

    this.adresseService.currentAdresseId = this.adresseId;
    this.adresseService.currentSchuleId = this.schuleId;
    this.dialog.open(ZsbAdresseComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(it => {
      console.log(it);
      const adresse = this.adresseService.currentAdresse;
      if (adresse !== undefined) {
        this.service.formGroup.patchValue({adresse: this.service.getReadableAdresse(adresse, adresse.ort)});
      }
    });
  }

  getKontaktFunktionDescById(id: number) {
    let desc = 'Unbekannt';

    if (this.kontaktFunktionen !== undefined && this.kontaktFunktionen !== null) {
      this.kontaktFunktionen.forEach(it => {
        if (desc === 'Unbekannt') {
          if (it.id === id) {
            desc = it.desc;
          }
        }
      });
    }

    return desc;
  }

  addKontakt() {
    console.log('Add kontakt');
  }
}
