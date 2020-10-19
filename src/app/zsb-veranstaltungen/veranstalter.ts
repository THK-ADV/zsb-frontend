import {Schule} from '../zsb-schule/schule'
import {Institution} from '../zsb-institutionen/institution'

export interface Veranstalter {
  uuid: string
  hochschul_id: string
  institution_id: string
  hochschule?: Schule
  institution?: Institution
}
