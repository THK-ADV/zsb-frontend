import {Ort} from '../zsb-orte/ort';
import {Adresse} from '../zsb-orte/adresse';

export interface Schule {
  schule_id: number;
  name: string;
  schulform: string;
  schwerpunkt: string;
  kooperationsvertrag: boolean;
  adress_id: number;
  schulleitung_mail: string;
  stubo_mail: string;
  schueleranzahl: number;
  kaoa_hochschule: boolean;
  talenscouting: boolean;
  adresse: Adresse;
  ort: Ort;
}
