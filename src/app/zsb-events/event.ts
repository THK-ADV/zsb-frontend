import {ContactSchool, ContactUniversity} from './eventContacts'

export interface Event {
  uuid: string
  designation: string
  date: string
  category: string
  school: string
  semester: string
  contactPersonSchool: string
  contactPersonUniversity: string
  rating: string
  kaoa: boolean,
  lastMinuteInformation: boolean,
  generalStuOri: boolean,
  runsStuOri: number,
  endMeeting: boolean,
  planMeeting: boolean,
  kaoaOther: boolean,
  kaoaOtherText: string,
  talentScouting: boolean,
  meeting: boolean,
  scouting: boolean,
  tsOther: boolean,
  tsOtherText: string,
  thSpecific: boolean,
  singleAppt: boolean,
  singleConsulting: boolean,
  singlePresentation: boolean,
  singlePresentationTh: boolean,
  singleRunsPresentation: number,
  singleInformation: boolean,
  singleOther: boolean,
  singleOtherText: string,
  schoolFair: boolean,
  fairConsulting: boolean,
  fairPresentation: boolean,
  fairPresentationTh: boolean,
  fairRunsPresentation: number,
  fairInformation: boolean,
  fairOther: boolean,
  fairOtherText: string,
  campusDays: boolean,
  studentLab: boolean,
  internOther: boolean,
  internOtherText: string,
  other: string
}

export interface DatabaseEvent {
  type: string
  designation: string
  uuid: string
  schoolyear: string
  date: string
  contact_school_id: string
  contact_school: ContactSchool
  contact_university_id: string
  contact_university: ContactUniversity
  other: string
  school_id: string
  school: string
  rating: string
  schoolCategory: string[]
  kAoACategory: string[]
  kAoARuns: number
  kAoAOther: string
  talentscoutCategory: string[]
  talentscoutOther: string
  thSpecificCategory: string[]
  thRunsSingle: number
  thOtherSingle: string
  thRunsFair: number
  thOtherFair: string
  internCategory: string[]
  internOther: string
}

export function completeEventAsString(event: Event): string {
  /*let concatenatedString = event.designation
  concatenatedString += event.categoryNames
  concatenatedString += event.topic
  concatenatedString += event.contactPerson
  concatenatedString += event.host*/

  return 'concatenatedString'
}
