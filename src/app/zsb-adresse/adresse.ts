import {Ort} from './ort';

export interface Adresse {
  adress_id: string;
  strasse: string;
  hausnummer: string;
  ort_id: string;
  ort: Ort;
}
