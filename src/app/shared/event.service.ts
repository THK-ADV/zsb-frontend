import {Injectable} from '@angular/core'
import {DatabaseService} from './database.service'
import {Observable} from 'rxjs'
import {DatabaseEvent, Event} from '../zsb-events/event'
import {UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators} from '@angular/forms'
import {NotificationService} from './notification.service'
import {tap} from 'rxjs/operators'
import {Router} from '@angular/router'
import {formatDate} from '@angular/common'

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
    designation: new UntypedFormControl('', Validators.required),
    date: new UntypedFormControl(new Date(), Validators.required),
    category: new UntypedFormControl([0], Validators.required),
    school: new UntypedFormControl(null),
    semester: new UntypedFormControl(''),
    contactPersonSchool: new UntypedFormControl(null),
    contactPersonUniversity: new UntypedFormControl(null),
    rating: new UntypedFormControl(''),
    kaoa: new UntypedFormControl(false),
    lastMinuteInformation: new UntypedFormControl(false),
    generalStuOri: new UntypedFormControl(false),
    runsStuOri: new UntypedFormControl(0),
    endMeeting: new UntypedFormControl(false),
    planMeeting: new UntypedFormControl(false),
    kaoaOther: new UntypedFormControl(false),
    kaoaOtherText: new UntypedFormControl(''),
    talentScouting: new UntypedFormControl(false),
    meeting: new UntypedFormControl(false),
    scouting: new UntypedFormControl(false),
    tsOther: new UntypedFormControl(false),
    tsOtherText: new UntypedFormControl(''),
    thSpecific: new UntypedFormControl(false),
    singleAppt: new UntypedFormControl(false),
    singleConsulting: new UntypedFormControl(false),
    singlePresentation: new UntypedFormControl(false),
    singlePresentationTh: new UntypedFormControl(false),
    singleRunsPresentation: new UntypedFormControl(0),
    singleInformation: new UntypedFormControl(false),
    singleOther: new UntypedFormControl(false),
    singleOtherText: new UntypedFormControl(''),
    schoolFair: new UntypedFormControl(false),
    fairConsulting: new UntypedFormControl(false),
    fairPresentation: new UntypedFormControl(false),
    fairPresentationTh: new UntypedFormControl(false),
    fairRunsPresentation: new UntypedFormControl(0),
    fairInformation: new UntypedFormControl(false),
    fairOther: new UntypedFormControl(false),
    fairOtherText: new UntypedFormControl(''),
    campusDays: new UntypedFormControl(false),
    studentLab: new UntypedFormControl(false),
    internOther: new UntypedFormControl(false),
    internOtherText: new UntypedFormControl(''),
    other: new UntypedFormControl('')
  })

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
      designation: '',
      date: new Date(),
      category: [0],
      school: null,
      semester: '',
      contactPersonSchool: null,
      contactPersonUniversity: null,
      rating: '',
      kaoa: false,
      lastMinuteInformation: false,
      generalStuOri: false,
      runsStuOri: 0,
      endMeeting: false,
      planMeeting: false,
      kaoaOther: false,
      kaoaOtherText: '',
      talentScouting: false,
      meeting: false,
      scouting: false,
      tsOther: false,
      tsOtherText: '',
      thSpecific: false,
      singleAppt: false,
      singleConsulting: false,
      singlePresentation: false,
      singlePresentationTh: false,
      singleRunsPresentation: 0,
      singleInformation: false,
      singleOther: false,
      singleOtherText: '',
      schoolFair: false,
      fairConsulting: false,
      fairPresentation: false,
      fairPresentationTh: false,
      fairRunsPresentation: 0,
      fairInformation: false,
      fairOther: false,
      fairOtherText: '',
      campusDays: false,
      studentLab: false,
      internOther: false,
      internOtherText: '',
      other: ''
    })
  }

  loadFormData(event: Event) {
    this.detailForm.setValue({
      uuid: event.uuid,
      designation: event.designation,
      date: new Date(event.date),
      category: event.category,
      school: event.school,
      semester: event.semester,
      contactPersonSchool: event.contactPersonSchool,
      contactPersonUniversity: event.contactPersonUniversity,
      rating: event.rating,
      kaoa: event.kaoa,
      lastMinuteInformation: event.lastMinuteInformation,
      generalStuOri: event.generalStuOri,
      runsStuOri: event.runsStuOri,
      endMeeting: event.endMeeting,
      planMeeting: event.planMeeting,
      kaoaOther: event.kaoaOther,
      kaoaOtherText: event.kaoaOtherText,
      talentScouting: event.talentScouting,
      meeting: event.meeting,
      scouting: event.scouting,
      tsOther: event.tsOther,
      tsOtherText: event.tsOtherText,
      thSpecific: event.thSpecific,
      singleAppt: event.singleAppt,
      singleConsulting: event.singleConsulting,
      singlePresentation: event.singlePresentation,
      singlePresentationTh: event.singlePresentationTh,
      singleRunsPresentation: event.singleRunsPresentation,
      singleInformation: event.singleInformation,
      singleOther: event.singleOther,
      singleOtherText: event.singleOtherText,
      schoolFair: event.schoolFair,
      fairConsulting: event.fairConsulting,
      fairPresentation: event.fairPresentation,
      fairPresentationTh: event.fairPresentationTh,
      fairRunsPresentation: event.fairRunsPresentation,
      fairInformation: event.fairInformation,
      fairOther: event.fairOther,
      fairOtherText: event.fairOtherText,
      campusDays: event.campusDays,
      studentLab: event.studentLab,
      internOther: event.internOther,
      internOtherText: event.internOtherText,
      other: event.other
    })
  }

  insertOrUpdateCurrentEvent(isPost: boolean) {
    const eventForm = this.detailForm.value
    let discriminator = ''
    switch (eventForm.category) {
      case 'atSchool':
        discriminator = 'AnSchuleTermin'
        break
      case 'intern':
        discriminator = 'BeiUnsTermin'
        break
      case 'atThird':
        discriminator = 'BeiDrittenTermin'
        break
    }
    eventForm.date = formatDate(new Date(eventForm.date), 'yyyy-MM-dd', 'en-US')
    // TODO: schöner
    // Terminart
    eventForm.schoolCategory = []
    if (eventForm.kaoa) {
      eventForm.schoolCategory.push('KAoA')
    }
    if (eventForm.talentScouting) {
      eventForm.schoolCategory.push('Talentscouting')
    }
    if (eventForm.thSpecific) {
      eventForm.schoolCategory.push('TH-spezifisch')
    }

    // KAoA
    eventForm.kaoaCategory = []
    if (eventForm.lastMinuteInformation) {
      eventForm.kaoaCategory.push('Last Minute Information')
    }
    if (eventForm.generalStuOri) {
      eventForm.kaoaCategory.push('Vortrag Allgemeine StuOri')
    }
    if (eventForm.endMeeting) {
      eventForm.kaoaCategory.push('Schuljahresendgespräch')
    }
    if (eventForm.planMeeting) {
      eventForm.kaoaCategory.push('Schuljahresplanungsgespräch')
    }
    if (eventForm.kaoaOther) {
      eventForm.kaoaCategory.push('Sonstiges')
    }

    // Talentscout
    eventForm.talentscoutCategory = []
    if (eventForm.meeting) {
      eventForm.talentscoutCategory.push('Gespräch')
    }
    if (eventForm.scouting) {
      eventForm.talentscoutCategory.push('Scouting')
    }
    if (eventForm.tsOther) {
      eventForm.talentscoutCategory.push('Sonstiges')
    }

    // TH-spezifisch
    eventForm.thSpecificCategory = []
    if (eventForm.singleAppt) {
      eventForm.thSpecificCategory.push('Einzeltermin')
    }
    if (eventForm.singleConsulting) {
      eventForm.thSpecificCategory.push('Beratung Einzeltermin')
    }
    if (eventForm.singlePresentation) {
      eventForm.thSpecificCategory.push('Fachvortrag Einzeltermin')
    }
    if (eventForm.singlePresentationTh) {
      eventForm.thSpecificCategory.push('Vortrag \'Technology, Arts, Sciences\' Einzeltermin')
    }
    if (eventForm.singleInformation) {
      eventForm.thSpecificCategory.push('Informationsstand Einzeltermin')
    }
    if (eventForm.singleOther) {
      eventForm.thSpecificCategory.push('Sonstiges Einzeltermin')
    }
    if (eventForm.schoolFair) {
      eventForm.thSpecificCategory.push('Schulmesse')
    }
    if (eventForm.fairConsulting) {
      eventForm.thSpecificCategory.push('Beratung Schulmesse')
    }
    if (eventForm.fairPresentation) {
      eventForm.thSpecificCategory.push('Fachvortrag Schulmesse')
    }
    if (eventForm.fairPresentationTh) {
      eventForm.thSpecificCategory.push('Vortrag \'Technology, Arts, Sciences\' Schulmesse')
    }
    if (eventForm.fairInformation) {
      eventForm.thSpecificCategory.push('Informationsstand Schulmesse')
    }
    if (eventForm.fairOther) {
      eventForm.thSpecificCategory.push('Sonstiges Schulmesse')
    }

    // Bei Uns
    eventForm.internCategory = []
    if (eventForm.campusDays) {
      eventForm.internCategory.push('Campustag(e)')
    }
    if (eventForm.studentLab) {
      eventForm.internCategory.push('Schülerlabor')
    }
    if (eventForm.internOther) {
      eventForm.internCategory.push('Sonstiges')
    }

    console.log('eventForm')
    console.log(eventForm)
    const eventObject: DatabaseEvent = {
      type: discriminator,
      uuid: eventForm.uuid,
      designation: eventForm.designation,
      schoolyear: eventForm.semester,
      date: eventForm.date,
      contact_school: eventForm.contactPersonSchool,
      contact_university: eventForm.contactPersonUniversity,
      other: eventForm.other,
      school_id: eventForm.school.id,
      school: eventForm.school,
      rating: eventForm.rating,
      schoolCategory: eventForm.schoolCategory,
      kAoACategory: eventForm.kaoaCategory,
      kAoARuns: eventForm.runsStuOri,
      kAoAOther: eventForm.kaoaOtherText,
      talentscoutCategory: eventForm.talentscoutCategory,
      talentscoutOther: eventForm.tsOtherText,
      thSpecificCategory: eventForm.thSpecificCategory,
      thRunsSingle: eventForm.singleRunsPresentation,
      thOtherSingle: eventForm.singleOtherText,
      thRunsFair: eventForm.fairRunsPresentation,
      thOtherFair: eventForm.fairOtherText,
      internCategory: eventForm.internCategory,
      internOther: eventForm.internOtherText
    }
    console.log('eventObject')
    console.log(eventObject)
    if (isPost) {
      this.dbService.createEvent(eventObject)
        .pipe(
          tap(
            it => {
                this.notificationService.success(':: Termin erfolgreich erstellt.')
                this.router.navigate(['/', 'events'])
            })
        )
        .subscribe()
    } else {
      this.dbService.updateEvent(eventObject)
        .pipe(
          tap(
            it => {
                this.notificationService.success(':: Termin erfolgreich aktualisiert.')
                this.router.navigate(['/', 'events'])
            })
        )
        .subscribe()
    }
  }
}
