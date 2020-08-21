import {Kontakt} from '../zsb-kontakt/kontakt';

export interface Veranstaltung {
  uuid: string;
  bezeichnung: string;
  veranstalterId: number;
  kategorie: number;
  thema: string;
  vortragsart: number;
  datum: string;
  kontaktpersonId: number;
  anzahlSus: number;
  stufe: number;
  ablauf: string;
  durchlaeufe: string;
  veranstalter?: Veranstaltung;
  kontaktperson?: Kontakt;
}
