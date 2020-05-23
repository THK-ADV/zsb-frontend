import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Schule} from '../schule';
import {DatabaseService} from '../../shared/database.service';
import {Observable} from 'rxjs';
import {Ort} from '../../zsb-orte/ort';
import {Adresse} from '../../zsb-orte/adresse';
import {SchuleService} from '../../shared/schule.service';
import {NotificationService} from '../../shared/notification.service';
import {Schulform} from '../schulform';

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

  adresseId: number;
  ortId: number;

  enableAdress = false;

  constructor(
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    public service: SchuleService,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.orteObservable = this.dbService.getOrte();
    this.adressenObservable = this.dbService.getAdressen();


    this.schulformen = this.dbService.getSchulform();
    // this.dbService.getSchulform().subscribe(schulformen => {
    //   this.schulformen = schulformen;
    // });

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

  }

  onSubmit() {
    console.log('SUB');
    if (this.service.formGroup.valid) {
      this.service.insertOrUpdateSchule(this.service.formGroup.value);
      this.service.formGroup.reset();
      this.service.initializeFormGroup();

      this.notificationService.success(':: Schule erflogreich gesichert.');
    } else {
      this.notificationService.failure('Schule konnte nicht gesichert werden.');
    }
  }

  onClear() {
    console.log('CLEAR');
    this.service.formGroup.reset();
    this.service.initializeFormGroup();
    this.notificationService.success(':: Formular zurückgesetzt.');
  }
}
