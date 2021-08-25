import {School} from '../zsb-school/school'
import {Institution} from '../zsb-institutions/institution'

export interface Host {
  uuid: string
  university_id: string
  institution_id: string
  university?: School
  institution?: Institution
}
