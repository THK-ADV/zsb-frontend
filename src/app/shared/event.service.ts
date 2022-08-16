import {Injectable} from '@angular/core'
import {DatabaseService} from './database.service'
import {iif, Observable} from 'rxjs'
import {Event} from '../zsb-events/event'
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms'
import {NotificationService} from './notification.service'
import {Host} from '../zsb-events/host'
import {Institution} from '../zsb-institutions/institution'
import {School} from '../zsb-school/school'
import {mergeMap, tap} from 'rxjs/operators'
import {Router} from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(public dbService: DatabaseService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  private detailForm: FormGroup = new FormGroup({
    uuid: new FormControl(null),
    date: new FormControl(new Date(), Validators.required),
    designation: new FormControl('', Validators.required),
    topic: new FormControl('', Validators.required),
    hostToggle: new FormControl(true),
    school: new FormControl(null),
    institution: new FormControl(null),
    category: new FormControl([0], Validators.required),
    level: new FormControl([0], Validators.required),
    amountStudents: new FormControl(0, Validators.required),
    annotations: new FormControl(''), // Ablauf
    contactPerson: new FormControl(''),
    report_btn: new FormControl({value: '', disabled: true}),
    host_id: new FormControl(null)
  }, {validators: this.selectedHostRequired()})

  getEvents(): Observable<Event[]> {
    return this.dbService.getAllEvents()
  }

  deleteEvent(uuid: string) {
    return this.dbService.deleteEvents(uuid)
  }

  getDetailForm(): FormGroup {
    return this.detailForm
  }

  initializeDetailForm() {
    this.detailForm.setValue({
      uuid: null,
      date: new Date(),
      designation: '',
      topic: '',
      hostToggle: true,
      school: null,
      institution: null,
      category: [0],
      level: [0],
      amountStudents: 0,
      annotations: '',
      contactPerson: '',
      report_btn: {value: '', disabled: true},
      host_id: null
    })
  }

  loadFormData(event: Event) {
    const isUniversityHost = event.host.university_id !== null

    this.detailForm.setValue({
      uuid: event.uuid,
      date: new Date(event.date),
      designation: event.designation,
      topic: event.topic,
      hostToggle: isUniversityHost,
      school: event.host.university_id,
      institution: event.host.institution_id,
      category: event.category,
      level: event.level,
      amountStudents: event.amountStudents,
      annotations: event.annotations,
      contactPerson: event.contactPerson,
      report_btn: {value: '', disabled: true},
      host_id: event.host_id
    })
  }

  insertOrUpdateCurrentEvent() {
    const eventForm = this.detailForm.value
    eventForm.date = new Date(eventForm.date).toISOString()

    const isUniversityHost = eventForm.hostToggle as boolean
    let host: Host

    if (isUniversityHost) {
      host = {
        uuid: eventForm.host_id,
        university_id: eventForm.school.school_id ?? null,
        institution_id: null
      }
    } else {
      host = {
        uuid: eventForm.host_id,
        university_id: null,
        institution_id: eventForm.institution.uuid ?? null
      }
    }

    let updatedHostObservable: Observable<Host>
    if (eventForm.host_id === undefined
      || eventForm.host_id === ''
      || eventForm.host_id === null) {
      console.log('Create Veranstalter:')
      updatedHostObservable = this.dbService.createHost(host)
    } else {
      console.log('Update Veranstalter:')
      updatedHostObservable = this.dbService.updateHost(host)
    }

    updatedHostObservable
      .pipe(
        mergeMap(hostWithId => {
          eventForm.host_id = hostWithId.uuid
          return iif(
            () => eventForm.uuid === null || eventForm.uuid === undefined,
            this.dbService.createEvent(eventForm)
              .pipe(
                tap(it => {
                  if (it.uuid !== undefined) {
                    this.notificationService.success(':: Termin erfolgreich erstellt.')
                    this.router.navigate(['/', 'events'])
                  } else {
                    this.notificationService.failure('-- Termin konnte nicht erstellt werden.')
                  }
                })
              ),

            this.dbService.updateEvent(eventForm)
              .pipe(
                tap(
                  it => {
                    if (it.uuid !== undefined) {
                      this.notificationService.success(':: Termin erfolgreich aktualisiert.')
                      this.router.navigate(['/', 'events'])
                    } else {
                      this.notificationService.failure('-- Termin konnte nicht aktualisiert werden.')
                    }
                  })
              )
          )
        })
      )
      .subscribe()
  }

  selectedHostRequired() {
    // const isUniversityHost = this.detailForm.value.hostToggle as boolean

    return (fg: FormGroup): ValidationErrors | null => {
      const isUniversityHost = fg.get('hostToggle').value as boolean
      const school = fg.get('school').value
      const institution = fg.get('institution').value

      if ((isUniversityHost && (school === undefined || school === '' || school === null))
        || (!isUniversityHost && (institution === undefined || institution === '' || institution === null))) {
        return {selectedHostRequired: 'Bitte einen Veranstalter wählen.'} as ValidationErrors
      }

      return null
    }
  }

  initFormWithSchool(school: School) {
    this.detailForm.patchValue({
      hostToggle: true,
      school: school.id,
    })
  }

  initFormWithInstitution(institution: Institution) {
    this.detailForm.patchValue({
      hostToggle: false,
      institution: institution.uuid,
    })
  }
}
