import {Host} from './host'
import {EventsListDisplay} from "./zsb-events-list/zsb-events-list.component";

export interface Event {
  uuid: string
  designation: string
  host_id: string
  category: number[]
  topic: string
  date: string
  amountStudents: string
  level: number[]
  sequence: string
  runs: string
  contactPerson: string
  host?: Host
  categoryNames?: string
}

export function completeEventAsString(event: EventsListDisplay): string {
  let concatenatedString = event.designation
  concatenatedString += event.categoryNames
  concatenatedString += event.topic
  concatenatedString += event.contactPerson
  concatenatedString += event.host

  return concatenatedString
}
