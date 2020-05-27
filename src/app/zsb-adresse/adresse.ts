import {Ort} from '../zsb-orte/ort';

export interface Adresse {
  adress_id: number;
  strasse: string;
  hausnummer: string;
  ort_id: number;
  ort: Ort;
}
