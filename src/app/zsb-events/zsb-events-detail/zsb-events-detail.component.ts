import {Component, OnDestroy, OnInit} from '@angular/core'
import {EventService} from '../../shared/event.service'
import {MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig} from '@angular/material/legacy-dialog'
import {ActivatedRoute} from '@angular/router'
import {Observable, Subscription} from 'rxjs'
import {Category} from '../category'
import {Level} from '../level'
import {School} from '../../zsb-school/school'
import {Institution} from '../../zsb-institutions/institution'
import {NotificationService} from '../../shared/notification.service'
import {Report} from '../zsb-report/report'
import {ZsbReportComponent} from '../zsb-report/zsb-report.component'
import {DatabaseService} from '../../shared/database.service'
import {map, startWith} from 'rxjs/operators'

@Component({
  selector: 'app-zsb-events-detail',
  templateUrl: './zsb-events-detail.component.html',
  styleUrls: ['./zsb-events-detail.component.css']
})
export class ZsbEventsDetailComponent implements OnInit, OnDestroy {
  public categories: Observable<Category[]>
  public levels: Observable<Level[]>
  public schools: School[] = []
  public institutions: Institution[] = []
  public eventId: string = undefined
  public report: Report = undefined
  public hostIsSchool = true
  filteredSchools: Observable<School[]>
  filteredInstitutions: Observable<Institution[]>
  schoolSub: Subscription
  institutionSub: Subscription

  constructor(
    public service: EventService,
    private dbService: DatabaseService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
  }

  ngOnDestroy(): void {
        this.schoolSub.unsubscribe()
    }

  ngOnInit(): void {
    this.service.initializeDetailForm()
    this.initHostToggle()

    // initialize lists for all dropdowns
    this.categories = this.service.dbService.getCategories()
    this.levels = this.service.dbService.getLevels()
    this.schoolSub = this.service.dbService.getSchoolsAtomic().subscribe(schools => this.schools = schools)
    this.institutionSub = this.service.dbService.getAllInstitutions().subscribe(institutions => this.institutions = institutions)

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
    this.filteredSchools = this.service.getDetailForm().get('school').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : this.displayFnSchool(value)),
        map(name => name ? this.schoolFilter(name) : this.schools.slice())
      )
    this.filteredInstitutions = this.service.getDetailForm().get('institution').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : this.displayFnInstitution(value)),
        map(designation => designation ? this.institutionFilter(designation) : this.institutions)
      )
  }

  displayFnSchool(school: School): string {
    return school?.name ?? ''
  }

  displayFnInstitution(institution: Institution): string {
    return institution?.designation ?? ''
  }

  private schoolFilter(value: string): School[] {
    const filterValue = value.toLowerCase()
    return this.schools.filter(school => school.name.toLowerCase().includes(filterValue))
  }

  private institutionFilter(value: string): Institution[] {
    const filterValue = value.toLowerCase()
    return this.institutions.filter(institution => institution.designation.toLowerCase().includes(filterValue))
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
    this.service.insertOrUpdateCurrentEvent()
  }

  onClear() {
    console.log('CLEAR')
    this.service.getDetailForm().reset()
    this.service.initializeDetailForm()
    this.service.getDetailForm().get('school').reset(undefined, {emitEvent: false})
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

  schoolIsSelected = () => typeof this.service.getDetailForm().get('school').value !== 'string'

  institutionIsSelected = () => typeof this.service.getDetailForm().get('institution').value !== 'string'
}
