import {Schule} from '../zsb-schule/schule';
import {Institution} from './institution';

export interface Veranstalter {
  uuid: string;
  hochschul_id: string;
  institution_id: string;
  hochschule?: Schule;
  institution?: Institution;
}
