import {Component, OnDestroy, OnInit} from '@angular/core'
import {EventService} from '../../shared/event.service'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
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
import {atSchoolProperty} from './event-properties'
import {internProperty} from './event-properties'
import {ChangeDetectorRef} from '@angular/core'

@Component({
  selector: 'app-zsb-events-detail',
  templateUrl: './zsb-events-detail.component.html',
  styleUrls: ['./zsb-events-detail.component.css']
})
export class ZsbEventsDetailComponent implements OnInit, OnDestroy {

  // TODO: eingegebene Daten speichern

  constructor(
    public service: EventService,
    private dbService: DatabaseService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
  }

  public categories: Observable<Category[]>
  public levels: Observable<Level[]>
  public schools: School[] = []
  public institutions: Institution[] = []
  public eventId: string = undefined
  public report: Report = undefined
  public hostIsSchool = true
  filteredSchools: Observable<School[]>
  schoolSub: Subscription
  typeSelection = ''
  protected readonly atSchoolProperty = atSchoolProperty
  protected readonly internProperty = internProperty
  someChecked = false

  getPropertyKeys(type: any) {
    return Object.keys(type)
  }

  onSelectionChange(event: any) {
    this.typeSelection = event.value
  }

  initToggle(toggleName: string, param: any) {
    const toggleControl = this.service.getDetailForm().get(toggleName)
    param = toggleControl.value
    toggleControl.valueChanges.subscribe((value) => {
      param = value
      this.cdr.detectChanges()
    })
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
  }

  displayFnSchool(school: School): string {
    return school?.name ?? ''
  }

  private schoolFilter(value: string): School[] {
    const filterValue = value.toLowerCase()
    return this.schools.filter(school => school.name.toLowerCase().includes(filterValue))
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
    /*this.service.getDetailForm().get('hostToggle').valueChanges.subscribe(isSchool => {
      this.hostIsSchool = isSchool
    })*/
  }

  onSubmit() {
    console.log('submit')
    console.log(this.service.getDetailForm().value)
    let isPost = false
    console.log(this.eventId)
    if (!this.eventId) {
      isPost = true
    }
    console.log(isPost)
    this.service.insertOrUpdateCurrentEvent(isPost)
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
    /*this.dbService.getSchoolByIdAtomic(schoolId).subscribe(school => {
      this.service.initFormWithSchool(school)
    })*/
  }

  private loadNewFormWithPreFilledInstitution(institutionId: any) {
    /*this.dbService.getInstitutionByIdAtomic(institutionId).subscribe(institution => {
      this.service.initFormWithInstitution(institution)
    })*/
  }

  schoolIsSelected = () => typeof this.service.getDetailForm().get('school').value !== 'string'
}
