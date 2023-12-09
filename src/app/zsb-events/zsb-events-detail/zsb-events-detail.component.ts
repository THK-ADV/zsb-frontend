import {Component, OnDestroy, OnInit} from '@angular/core'
import {EventService} from '../../shared/event.service'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
import {ActivatedRoute} from '@angular/router'
import {Observable, Subscription} from 'rxjs'
import {Category} from '../category'
import {Level} from '../level'
import {School} from '../../zsb-school/school'
import {NotificationService} from '../../shared/notification.service'
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
  public eventId: string = undefined
  public report: Report = undefined
  public hostIsSchool = true
  filteredSchools: Observable<School[]>
  schoolSub: Subscription

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

    // initialize lists for all dropdowns
    this.categories = this.service.dbService.getCategories()
    this.levels = this.service.dbService.getLevels()
    this.schoolSub = this.service.dbService.getSchoolsAtomic().subscribe(schools => this.schools = schools)

    // check routeParam
    this.route.paramMap.subscribe(paramMap => {
      this.eventId = paramMap.get('eventId')
      this.loadEvent(this.eventId)
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

  private loadEventWithoutId(uuid: string) {
    this.service.dbService.getEventById(uuid).subscribe(event => {
      event.uuid = null
      this.service.loadFormData(event)
    })
  }

  private loadEvent(uuid: string) {
    this.service.dbService.getEventById(uuid).subscribe(event => {
      this.service.loadFormData(event)
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
}
