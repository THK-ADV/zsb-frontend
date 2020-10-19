import {Adresse} from '../zsb-adresse/adresse'

export interface Institution {
  uuid: string
  bezeichnung: string
  email: string
  adress_id: string
  adresse?: Adresse
}
