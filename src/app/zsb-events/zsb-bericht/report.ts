import {Event} from '../event'

export interface Report {
  uuid: string
  titel: string
  text: string
  veranstaltung_id: string
  veranstaltung?: Event
}
