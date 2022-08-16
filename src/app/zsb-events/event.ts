import {Host} from './host'

export interface Event {
  uuid: string
  designation: string
  host_id: string
  category: number[]
  topic: string
  date: string
  amountStudents: string
  level: number[]
  annotations: string
  runs: string
  contactPerson: string
  host?: Host
  categoryNames?: string
}

export function completeEventAsString(event: Event): string {
  let concatenatedString = event.designation
  concatenatedString += event.categoryNames
  concatenatedString += event.topic
  concatenatedString += event.contactPerson
  concatenatedString += event.host

  return concatenatedString
}
