import {Component, OnInit} from '@angular/core';
import {VeranstaltungService} from '../../shared/veranstaltung.service';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Kategorie} from '../kategorie';
import {Stufe} from '../stufe';
import {Vortragsart} from '../vortragsart';
import {Schule} from '../../zsb-schule/schule';
import {Institution} from '../institution';
import {AnzahlSus} from '../../zsb-schule/anzahl-sus';
import {combineKontaktName, Kontakt} from '../../zsb-kontakt/kontakt';
import {NotificationService} from '../../shared/notification.service';
import {Bericht} from '../bericht';

@Component({
  selector: 'app-zsb-veranstaltungen-detail',
  templateUrl: './zsb-veranstaltungen-detail.component.html',
  styleUrls: ['./zsb-veranstaltungen-detail.component.css']
})
export class ZsbVeranstaltungenDetailComponent implements OnInit {
  public kategorien: Observable<Kategorie[]>;
  public stufen: Observable<Stufe[]>;
  public vortragsarten: Observable<Vortragsart[]>;
  public schulen: Observable<Schule[]>;
  public institutionen: Observable<Institution[]>;
  public veranstalterId: string = undefined;
  public anzahlSus: Observable<AnzahlSus[]>;
  public kontakte: Observable<Kontakt[]>;
  public bericht: Bericht = undefined;
  public veranstalterIsSchule = true;

  constructor(
    public service: VeranstaltungService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.service.initializeDetailForm();
    this.initVeranstalterToggle();

    // initialize lists for all dropdowns
    this.kategorien = this.service.dbService.getKategorien();
    this.stufen = this.service.dbService.getStufen();
    this.vortragsarten = this.service.dbService.getVortragsarten();
    this.schulen = this.service.dbService.getSchulenAtomic();
    this.institutionen = this.service.dbService.getInstitutionen();
    this.anzahlSus = this.service.dbService.getAnzahlSus();
    this.kontakte = this.service.dbService.getKontakte();

    // check routeParam
    this.route.paramMap.subscribe(paramMap => {
      const parameter = paramMap.get('veranstaltungId');
      if (parameter !== 'new') {
        this.veranstalterId = parameter;
        this.loadVeranstaltung(parameter);
      }
    });
  }

  private loadVeranstaltung(uuid: string) {
    this.service.dbService.getVeranstaltungById(uuid).subscribe(veranstaltung => {
      this.service.loadFormData(veranstaltung);
    });
  }

  combineKontaktName(kontakt: Kontakt) {
    return combineKontaktName(kontakt);
  }

  private initVeranstalterToggle() {
    this.service.getDetailForm().get('veranstalterToggle').valueChanges.subscribe(isSchule => {
      this.veranstalterIsSchule = isSchule;
      if (isSchule) {
        // hide institution
      } else {
        // hide schule
      }
    });
  }

  onSubmit() {
    console.log('submit');
    this.service.insertOrUpdateCurrentVeranstaltung(this.notificationService);
  }

  onClear() {
    console.log('CLEAR');
    this.service.getDetailForm().reset();
    this.service.initializeDetailForm();
    this.ngOnInit();
    this.notificationService.success(':: Formular zurückgesetzt.');
  }

  editBericht() {
    alert('Hinweis: Hier wird ein Pop-Up-Fenster entstehen, in welchem der Bericht angepasst bzw. erstellt werden kann.');
    // TODO implement
  }
}
