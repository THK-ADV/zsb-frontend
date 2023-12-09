import {Component, OnDestroy, OnInit} from '@angular/core'
import {EventService} from '../../shared/event.service'
import {MatDialog} from '@angular/material/dialog'
import {ActivatedRoute} from '@angular/router'
import {Observable, Subscription} from 'rxjs'
import {Category} from '../category'
import {Level} from '../level'
import {School} from '../../zsb-school/school'
import {NotificationService} from '../../shared/notification.service'
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

  public categories: Observable<Category[]>
  public levels: Observable<Level[]>
  public schools: School[] = []
  public eventId: string = undefined
  filteredSchools: Observable<School[]>
  private subs: Subscription[] = []
  typeSelection = ''
  protected readonly atSchoolProperty = atSchoolProperty
  protected readonly internProperty = internProperty

  constructor(
    public service: EventService,
    private dbService: DatabaseService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.service.initializeFormGroup()
    this.categories = this.service.dbService.getCategories()
    this.levels = this.service.dbService.getLevels()

    this.subs.push(
      this.service.dbService.getSchoolsAtomic().subscribe(schools =>
        this.schools = schools
      )
    )

    this.subs.push(
      this.route.paramMap.subscribe(params => {
        this.eventId = params.get('eventId')
        if (this.eventId != null) {
          this.loadEvent(this.eventId)
        }
      })
    )

    this.filteredSchools = this.service.formGroup.get('school').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : this.displayFnSchool(value)),
        map(name => name ? this.schoolFilter(name) : this.schools.slice())
      )
  }

  onSelectionChange(event: any) {
    this.typeSelection = event.value
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }
  displayFnSchool(school: School): string {
    return school?.name ?? ''
  }

  private schoolFilter(value: string): School[] {
    const filterValue = value.toLowerCase()
    return this.schools.filter(school => school.name.toLowerCase().includes(filterValue))
  }

  getCheckboxValue(formControlName: string): boolean {
    return this.service.formGroup.get(formControlName)?.value || false
  }

  updateCheckboxValue(formControlName: string) {
    const currentValue = this.service.formGroup.get(formControlName)?.value
    this.service.formGroup.get(formControlName).setValue(!currentValue)
  }

  private loadEvent(uuid: string) {
    this.service.dbService.getEventById(uuid).subscribe(event => {
      this.service.loadFormData(event)
      this.typeSelection = this.service.formGroup.get('category').value
    })
  }

  onSubmit() {
    let isPost = false
    if (!this.eventId) {
      isPost = true
    }
    this.service.insertOrUpdateCurrentEvent(isPost)
  }

  onClear() {
    console.log('CLEAR')
    this.service.formGroup.reset()
    this.service.initializeFormGroup()
    this.service.formGroup.get('school').reset(undefined, {emitEvent: false})
    this.ngOnInit()
    this.notificationService.success(':: Formular zurückgesetzt.')
  }
}
