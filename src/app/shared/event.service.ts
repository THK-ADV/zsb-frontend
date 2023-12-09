import {Injectable} from '@angular/core'
import {DatabaseService} from './database.service'
import {iif, Observable} from 'rxjs'
import {Event} from '../zsb-events/event'
import {UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators} from '@angular/forms'
import {NotificationService} from './notification.service'
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

  private detailForm: UntypedFormGroup = new UntypedFormGroup({
    uuid: new UntypedFormControl(null),
    date: new UntypedFormControl(new Date(), Validators.required),
    designation: new UntypedFormControl('', Validators.required),
    topic: new UntypedFormControl('', Validators.required),
    hostToggle: new UntypedFormControl(true),
    school: new UntypedFormControl(null),
    institution: new UntypedFormControl(null),
    category: new UntypedFormControl([0], Validators.required),
    level: new UntypedFormControl([0], Validators.required),
    amountStudents: new UntypedFormControl(0, Validators.required),
    annotations: new UntypedFormControl(''), // Ablauf
    contactPerson: new UntypedFormControl(''),
    report_btn: new UntypedFormControl({value: '', disabled: true}),
    host_id: new UntypedFormControl(null)
  }, {validators: this.selectedHostRequired()})

  getEvents(): Observable<Event[]> {
    return this.dbService.getAllEvents()
  }

  deleteEvent(uuid: string) {
    return this.dbService.deleteEvents(uuid)
  }

  getDetailForm(): UntypedFormGroup {
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

  loadFormData(event: DatabaseEvent) {
    const kaoa = event.schoolCategory?.includes('KAOA') ?? false
    const talentScouting = event.schoolCategory?.includes('TALENTSCOUT') ?? false
    const thSpecific = event.schoolCategory?.includes('THSPECIFIC') ?? false
    const lastMinuteInformation = event.kAoACategory?.includes('LASTMINUTE') ?? false
    const generalStuOri = event.kAoACategory?.includes('GENERALORIENTATION') ?? false
    const runsStuOri = event.kAoARuns ?? 0
    const endMeeting = event.kAoACategory?.includes('YEARENDING') ?? false
    const planMeeting = event.kAoACategory?.includes('YEARPLANNING') ?? false
    const kaoaOther = event.kAoACategory?.includes('OTHER') ?? false
    const kaoaOtherText = event.kAoAOther ?? ''
    const meeting = event.talentscoutCategory?.includes('CONVERSATION') ?? false
    const scouting = event.talentscoutCategory?.includes('SCOUTING') ?? false
    const tsOther = event.talentscoutCategory?.includes('OTHER') ?? false
    const tsOtherText = event.talentscoutOther ?? ''
    const singleAppt = event.thSpecificCategory?.includes('SINGLEAPPT') ?? false
    const singleConsulting = event.thSpecificCategory?.includes('CONSULTATIONSINGLE') ?? false
    const singlePresentation = event.thSpecificCategory?.includes('TALKSINGLE') ?? false
    const singlePresentationTh = event.thSpecificCategory?.includes('THTALKSINGLE') ?? false
    const singleInformation = event.thSpecificCategory?.includes('INFORMATIONSINGLE') ?? false
    const singleOther = event.thSpecificCategory?.includes('OTHERSINGLE') ?? false
    const schoolFair = event.thSpecificCategory?.includes('SCHOOLFAIR') ?? false
    const fairConsulting = event.thSpecificCategory?.includes('CONSULTATIONFAIR') ?? false
    const fairPresentation = event.thSpecificCategory?.includes('TALKFAIR') ?? false
    const fairPresentationTh = event.thSpecificCategory?.includes('THTALKFAIR') ?? false
    const fairInformation = event.thSpecificCategory?.includes('INFORMATIONFAIR') ?? false
    const fairOther = event.thSpecificCategory?.includes('OTHERFAIR') ?? false
    const fairRunsPresentation = event.thRunsFair ?? 0
    const singleRunsPresentation = event.thRunsSingle ?? 0
    const singleOtherText = event.thOtherSingle ?? ''
    const fairOtherText = event.thOtherFair ?? ''
    const campusDays = event.internCategory?.includes('CAMPUSDAY') ?? false
    const studentLab = event.internCategory?.includes('LAB') ?? false
    const internOther = event.internCategory?.includes('OTHER') ?? false
    const internOtherText = event.internOther ?? ''
    let category = ''
    switch (event.type) {
      case 'AnSchuleTermin':
        category = 'atSchool'
        break
      case 'BeiUnsTermin':
        category = 'intern'
        break
      case 'BeiDrittenTermin':
        category = 'atThird'
    }
    this.formGroup.setValue({
      uuid: event.uuid,
      date: new Date(event.date),
      designation: event.designation,
      topic: event.topic,
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
}
