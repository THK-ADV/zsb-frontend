import {Ort} from './ort';

export interface Adresse {
  adress_id: number;
  strasse: string;
  hausnummer: string;
  ort_id: number;
  ort: Ort;
}
