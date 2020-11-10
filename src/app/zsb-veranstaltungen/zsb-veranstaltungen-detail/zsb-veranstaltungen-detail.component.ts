import {Component, OnInit} from '@angular/core'
import {VeranstaltungService} from '../../shared/veranstaltung.service'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
import {ActivatedRoute} from '@angular/router'
import {Observable} from 'rxjs'
import {Kategorie} from '../kategorie'
import {Stufe} from '../stufe'
import {Schule} from '../../zsb-schule/schule'
import {Institution} from '../../zsb-institutionen/institution'
import {NotificationService} from '../../shared/notification.service'
import {Bericht} from '../zsb-bericht/bericht'
import {ZsbBerichtComponent} from '../zsb-bericht/zsb-bericht.component'
import {DatabaseService} from '../../shared/database.service'

@Component({
  selector: 'app-zsb-veranstaltungen-detail',
  templateUrl: './zsb-veranstaltungen-detail.component.html',
  styleUrls: ['./zsb-veranstaltungen-detail.component.css']
})
export class ZsbVeranstaltungenDetailComponent implements OnInit {
  public kategorien: Observable<Kategorie[]>
  public stufen: Observable<Stufe[]>
  public schulen: Observable<Schule[]>
  public institutionen: Observable<Institution[]>
  public veranstaltungId: string = undefined
  public bericht: Bericht = undefined
  public veranstalterIsSchule = true

  constructor(
    public service: VeranstaltungService,
    private dbService: DatabaseService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.service.initializeDetailForm()
    this.initVeranstalterToggle()

    // initialize lists for all dropdowns
    this.kategorien = this.service.dbService.getKategorien()
    this.stufen = this.service.dbService.getStufen()
    this.schulen = this.service.dbService.getSchulenAtomic()
    this.institutionen = this.service.dbService.getAllInstitutionen()


    // check routeParam
    this.route.paramMap.subscribe(paramMap => {
      const parameter = paramMap.get('veranstaltungId')
      if (parameter === 'new') {
        this.checkQueryParametersAndPreloadAvailableData()
      } else {
        this.veranstaltungId = parameter
        this.loadVeranstaltung(parameter)
      }
    })
  }

  private checkQueryParametersAndPreloadAvailableData() {
    this.route.queryParams.subscribe(params => {
      const copyId = params.copy
      const schuleId = params.schule_id
      const institutionId = params.institution_id
      if (copyId !== undefined) {
        this.loadVeranstaltungWithoutId(copyId)
        return
      }
      if (schuleId !== undefined) {
        this.loadNewFormWithPreFilledSchule(schuleId)
      }
      if (institutionId !== undefined) {
        this.loadNewFormWithPreFilledInstitution(institutionId)
      }
    })
  }

  private loadVeranstaltungWithoutId(uuid: string) {
    this.service.dbService.getVeranstaltungById(uuid).subscribe(veranstaltung => {
      veranstaltung.uuid = null
      this.service.loadFormData(veranstaltung)
    })
  }

  private loadVeranstaltung(uuid: string) {
    this.service.dbService.getVeranstaltungById(uuid).subscribe(veranstaltung => {
      this.service.loadFormData(veranstaltung)

      this.service.dbService.getAllBerichte().subscribe(berichte => {
        berichte.forEach(it => {
          if (it.veranstaltung_id === veranstaltung.uuid) this.bericht = it
        })
      })
    })
  }

  private initVeranstalterToggle() {
    this.service.getDetailForm().get('veranstalterToggle').valueChanges.subscribe(isSchule => {
      this.veranstalterIsSchule = isSchule
    })
  }

  onSubmit() {
    console.log('submit')
    this.service.insertOrUpdateCurrentVeranstaltung(this.notificationService)
  }

  onClear() {
    console.log('CLEAR')
    this.service.getDetailForm().reset()
    this.service.initializeDetailForm()
    this.ngOnInit()
    this.notificationService.success(':: Formular zurückgesetzt.')
  }

  editBericht(bericht?: Bericht) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.width = '30%'
    const dialogRef = this.dialog.open(ZsbBerichtComponent, dialogConfig)
    dialogRef.componentInstance.berichtId = bericht?.uuid
    dialogRef.componentInstance.veranstaltungId = this.service.getDetailForm().controls.uuid.value

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return
      }
      this.bericht = result
    })
  }

  private loadNewFormWithPreFilledSchule(schuleId: string) {
    this.dbService.getSchuleByIdAtomic(schuleId).subscribe(schule => {
      this.service.initFormWithSchule(schule)
    })
  }

  private loadNewFormWithPreFilledInstitution(institutionId: any) {
    this.dbService.getInstitutionByIdAtomic(institutionId).subscribe( institution => {
      this.service.initFormWithInstitution(institution)
    })
  }
}
