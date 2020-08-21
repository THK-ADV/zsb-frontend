import {Kontakt} from '../zsb-kontakt/kontakt';
import {Adresse} from '../zsb-adresse/adresse';

export interface Institution {
  uuid: string;
  bezeichnung: string;
  adress_id: string;
  ansprechpartner_id: string;
  adresse?: Adresse;
  ansprechpartner?: Kontakt;
}
