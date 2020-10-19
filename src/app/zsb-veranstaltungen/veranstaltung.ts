import {Veranstalter} from './veranstalter'

export interface Veranstaltung {
  uuid: string
  bezeichnung: string
  veranstalter_id: string
  kategorie: number
  thema: string
  vortragsart: number
  datum: string
  anzahlSus: number
  stufe: number
  ablauf: string
  durchlaeufe: string
  veranstalter?: Veranstalter
}
