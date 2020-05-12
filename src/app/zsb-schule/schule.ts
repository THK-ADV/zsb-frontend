import {Ort} from '../zsb-orte/ort';
import {Adresse} from '../zsb-orte/adresse';

export interface Schule {
  schule_id: number;
  name: string;
  schulform: number;
  schwerpunkt: string;
  kooperationsvertrag: boolean;
  adress_id: number;
  ort_id: number;
  schulleitung_mail: string;
  stubo_mail: string;
  schueleranzahl: number;
  kaoa_hochschule: boolean;
  talentscouting: boolean;
  adresse: Adresse;
  ort: Ort;
}
