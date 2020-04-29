import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Schule} from '../schule';
import {DatabaseService} from '../../shared/database.service';
import {Observable} from 'rxjs';
import {Ort} from '../../zsb-orte/ort';
import {Adresse} from '../../zsb-orte/adresse';
import {SchuleService} from '../../shared/schule.service';
import {NotificationService} from '../../shared/notification.service';

@Component({
  selector: 'app-zsb-schule-detail',
  templateUrl: './zsb-schule-detail.component.html',
  styleUrls: ['./zsb-schule-detail.component.css']
})
export class ZsbSchuleDetailComponent implements OnInit {
  schuleId;
  schule: Observable<Schule>;
  orte: Observable<Ort[]>;
  adressen: Observable<Adresse[]>;

  adresseId: number;
  ortId: number;

  constructor(
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    public service: SchuleService,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.orte = this.dbService.getOrte();
    this.adressen = this.dbService.getAdressen();

    this.route.paramMap.subscribe(params => {
      this.schuleId = params.get('schuleId');

      if (this.schuleId != null) {
        this.schule = this.dbService.getSchuleById(this.schuleId);
        this.schule.subscribe(s => {
          this.adresseId = s.adress_id;
        });

        this.adressen.subscribe(it => {
          const adresse = this.dbService.getAdresseById(it, this.adresseId);
          this.ortId = adresse.ort_id;
        });
      } else {
        this.schule = undefined;
      }
    });
  }

  onSubmit() {
    console.log('SUB');
    if (this.service.form.valid) {
      this.service.insertSchule(this.service.form.value);
      this.service.form.reset();
      this.service.initializeFormGroup();

      this.notificationService.success(':: Schule erflogreich gesichert.');
    } else {
      this.notificationService.failure('Schule konnte nicht gesichert werden.');
    }
  }

  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.notificationService.success(':: Schule erflogreich gesichert.');
  }
}
