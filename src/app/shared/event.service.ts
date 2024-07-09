import {Injectable} from '@angular/core'
import {DatabaseService} from './database.service'
import {DatabaseEvent} from '../zsb-events/event'
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms'
import {NotificationService} from './notification.service'
import {Router} from '@angular/router'
import {formatDate} from '@angular/common'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EventService {

  formGroup: UntypedFormGroup

  constructor(public dbService: DatabaseService,
              private notificationService: NotificationService,
              private router: Router) {
    this.formGroup = new UntypedFormGroup({
      uuid: new UntypedFormControl(null),
      designation: new UntypedFormControl('', Validators.required),
      date: new UntypedFormControl(new Date(), Validators.required),
      category: new UntypedFormControl([0], Validators.required),
      school: new UntypedFormControl(null, Validators.required),
      semester: new UntypedFormControl(''),
      contactPersonSchoolId: new UntypedFormControl(''),
      contactPersonSchool: new UntypedFormControl(null),
      contactPersonUniversityId: new UntypedFormControl(''),
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
  }

  getEvents(): Observable<DatabaseEvent[]> {
    return this.dbService.getEvents()
  }

  deleteEvent(uuid: string) {
    return this.dbService.deleteEvents(uuid)
  }

  initializeFormGroup() {
    this.formGroup.setValue({
      uuid: null,
      designation: '',
      date: new Date(),
      category: [0],
      school: null,
      semester: '',
      contactPersonSchoolId: '',
      contactPersonSchool: null,
      contactPersonUniversityId: '',
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

  loadFormData(event: DatabaseEvent) {
    const contactPersonSchool = event.contact_school?.name ?? ''
    const contactPersonUniversity = event.contact_university?.name ?? ''
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
      designation: event.designation,
      date: new Date(event.date),
      category,
      school: event.school,
      semester: event.schoolyear,
      contactPersonSchoolId: event.contact_school?.id ?? '',
      contactPersonSchool,
      contactPersonUniversityId: event.contact_university?.id ?? '',
      contactPersonUniversity,
      rating: event.rating,
      kaoa,
      lastMinuteInformation,
      generalStuOri,
      runsStuOri,
      endMeeting,
      planMeeting,
      kaoaOther,
      kaoaOtherText,
      talentScouting,
      meeting,
      scouting,
      tsOther,
      tsOtherText,
      thSpecific,
      singleAppt,
      singleConsulting,
      singlePresentation,
      singlePresentationTh,
      singleRunsPresentation,
      singleInformation,
      singleOther,
      singleOtherText,
      schoolFair,
      fairConsulting,
      fairPresentation,
      fairPresentationTh,
      fairRunsPresentation,
      fairInformation,
      fairOther,
      fairOtherText,
      campusDays,
      studentLab,
      internOther,
      internOtherText,
      other: event.other
    })
  }

  // TODO: an Backend anpassen, insert und update aufteilen
  insertOrUpdateCurrentEvent(isPost: boolean, schoolContactId: string, universityContactId: string) {
    console.log('termin erstellen')
    const eventForm = this.formGroup.value
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
    let contactPersonSchool
    let contactPersonUniversity
    if (eventForm.contactPersonSchool !== null) {
      contactPersonSchool = {
        id: null,
        name: eventForm.contactPersonSchool
      }
    } else {
      contactPersonSchool = null
    }
    if (eventForm.contactPersonUniversity !== null) {
      contactPersonUniversity = {
        id: null,
        name: eventForm.contactPersonUniversity
      }
    } else {
      contactPersonUniversity = null
    }
    const eventObject: DatabaseEvent = {
      type: discriminator,
      uuid: eventForm.uuid,
      designation: eventForm.designation,
      schoolyear: eventForm.semester,
      date: eventForm.date,
      contact_school_id: schoolContactId,
      contact_school: contactPersonSchool,
      contact_university_id: universityContactId,
      contact_university: contactPersonUniversity,
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
    if (isPost) {
      console.log('eventObject')
      console.log(eventObject)
      this.dbService.createEvent(eventObject).subscribe(it => {
        if (it.uuid !== undefined) {
          this.notificationService.success(':: Termin erfolgreich erstellt.')
          this.router.navigate(['/'])
        } else {
          this.notificationService.failure('-- Termin konnte nicht erstellt werden.')
        }
      })
    } else {
      console.log(eventObject)
      this.dbService.updateEvent(eventObject).subscribe(it => {
        if (it.uuid !== undefined) {
          this.notificationService.success(':: Termin erfolgreich aktualisiert.')
          this.router.navigate(['/'])
        } else {
          this.notificationService.failure('-- Termin konnte nicht aktualisiert werden.')
        }
      })
    }
  }
}
