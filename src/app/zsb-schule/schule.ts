import {Ort} from '../zsb-adresse/ort';
import {Adresse} from '../zsb-adresse/adresse';
import {Kontakt} from './Kontakt';

export interface Schule {
  schule_id: number;
  name: string;
  schulform: number;
  schwerpunkt: string;
  kooperationsvertrag: boolean;
  adress_id: number;
  ort_id: number;
  anzahl_sus: number;
  kaoa_hochschule: boolean;
  talentscouting: boolean;
  kontakt_a_id: string;
  kontakt_b_id: string;
  stubo_kontakt_id: string;
  kontakt_a: Kontakt;
  kontakt_b: Kontakt;
  stubo_kontakt: Kontakt;
  adresse: Adresse;
  ort: Ort;
}
