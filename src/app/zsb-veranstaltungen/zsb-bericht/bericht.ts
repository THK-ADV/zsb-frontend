import {Veranstaltung} from '../veranstaltung'

export interface Bericht {
  uuid: string
  titel: string
  text: string
  veranstaltung_id: string
  veranstaltung?: Veranstaltung
}
