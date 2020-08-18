import {Adresse} from '../zsb-adresse/adresse';
import {Kontakt} from '../zsb-kontakt/kontakt';

export interface Schule {
  schule_id: string;
  name: string;
  schulform: number;
  schwerpunkt: string;
  kooperationsvertrag: boolean;
  adress_id: string;
  anzahl_sus: number;
  kaoa_hochschule: boolean;
  talentscouting: boolean;
  kontakte_ids: string[];
  kontakte: Kontakt[];
  adresse: Adresse;
}
