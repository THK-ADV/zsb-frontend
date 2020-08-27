import {Kontakt} from '../zsb-kontakt/kontakt'
import {Veranstalter} from './veranstalter'

export interface Veranstaltung {
  uuid: string
  bezeichnung: string
  veranstalter_id: number
  kategorie: number
  thema: string
  vortragsart: number
  datum: string
  kontaktperson_id: string
  anzahlSus: number
  stufe: number
  ablauf: string
  durchlaeufe: string
  veranstalter?: Veranstalter
  kontaktperson?: Kontakt
}
