import {Component, OnInit} from '@angular/core'
import {EventService} from '../../shared/event.service'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
import {ActivatedRoute} from '@angular/router'
import {Observable} from 'rxjs'
import {Category} from '../category'
import {Level} from '../level'
import {School} from '../../zsb-school/school'
import {Institution} from '../../zsb-institutions/institution'
import {NotificationService} from '../../shared/notification.service'
import {Report} from '../zsb-report/report'
import {ZsbReportComponent} from '../zsb-report/zsb-report.component'
import {DatabaseService} from '../../shared/database.service'

@Component({
  selector: 'app-zsb-events-detail',
  templateUrl: './zsb-events-detail.component.html',
  styleUrls: ['./zsb-events-detail.component.css']
})
export class ZsbEventsDetailComponent implements OnInit {
  public categories: Observable<Category[]>
  public levels: Observable<Level[]>
  public schools: Observable<School[]>
  public institutions: Observable<Institution[]>
  public eventId: string = undefined
  public report: Report = undefined
  public hostIsSchool = true

  constructor(
    public service: EventService,
    private dbService: DatabaseService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.service.initializeDetailForm()
    this.initHostToggle()

    // initialize lists for all dropdowns
    this.categories = this.service.dbService.getCategories()
    this.levels = this.service.dbService.getLevels()
    this.schools = this.service.dbService.getSchoolsAtomic()
    this.institutions = this.service.dbService.getAllInstitutions()


    // check routeParam
    this.route.paramMap.subscribe(paramMap => {
      const parameter = paramMap.get('eventId')
      if (parameter === 'new') {
        this.checkQueryParametersAndPreloadAvailableData()
      } else {
        this.eventId = parameter
        this.loadEvent(parameter)
      }
    })
  }

  private checkQueryParametersAndPreloadAvailableData() {
    this.route.queryParams.subscribe(params => {
      const copyId = params.copy
      const schoolId = params.school_id
      const institutionId = params.institution_id
      if (copyId !== undefined) {
        this.loadEventWithoutId(copyId)
        return
      }
      if (schoolId !== undefined) {
        this.loadNewFormWithPreFilledSchool(schoolId)
      }
      if (institutionId !== undefined) {
        this.loadNewFormWithPreFilledInstitution(institutionId)
      }
    })
  }

  private loadEventWithoutId(uuid: string) {
    this.service.dbService.getEventById(uuid).subscribe(event => {
      event.uuid = null
      this.service.loadFormData(event)
    })
  }

  private loadEvent(uuid: string) {
    this.service.dbService.getEventById(uuid).subscribe(event => {
      this.service.loadFormData(event)

      this.service.dbService.getAllReports().subscribe(reports => {
        reports.forEach(it => {
          if (it.event_id === event.uuid) this.report = it
        })
      })
    })
  }

  private initHostToggle() {
    this.service.getDetailForm().get('hostToggle').valueChanges.subscribe(isSchool => {
      this.hostIsSchool = isSchool
    })
  }

  onSubmit() {
    console.log('submit')
    this.service.insertOrUpdateCurrentEvent(this.notificationService)
  }

  onClear() {
    console.log('CLEAR')
    this.service.getDetailForm().reset()
    this.service.initializeDetailForm()
    this.ngOnInit()
    this.notificationService.success(':: Formular zurückgesetzt.')
  }

  editReport(report?: Report) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.width = '30%'
    const dialogRef = this.dialog.open(ZsbReportComponent, dialogConfig)
    dialogRef.componentInstance.reportId = report?.uuid
    dialogRef.componentInstance.eventId = this.service.getDetailForm().controls.uuid.value

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return
      }
      this.report = result
    })
  }

  private loadNewFormWithPreFilledSchool(schoolId: string) {
    this.dbService.getSchoolByIdAtomic(schoolId).subscribe(school => {
      this.service.initFormWithSchool(school)
    })
  }

  private loadNewFormWithPreFilledInstitution(institutionId: any) {
    this.dbService.getInstitutionByIdAtomic(institutionId).subscribe( institution => {
      this.service.initFormWithInstitution(institution)
    })
  }
}
