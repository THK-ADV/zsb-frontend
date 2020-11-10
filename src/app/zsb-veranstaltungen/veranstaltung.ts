import {Veranstalter} from './veranstalter'

export interface Veranstaltung {
  uuid: string
  bezeichnung: string
  veranstalter_id: string
  kategorie: number[]
  thema: string
  datum: string
  anzahlSus: string
  stufe: number[]
  ablauf: string
  durchlaeufe: string
  ansprechpartner: string
  veranstalter?: Veranstalter
}
