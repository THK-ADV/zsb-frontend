import {Address} from '../zsb-address/address'

export interface Institution {
  uuid: string
  bezeichnung: string
  email: string
  adress_id: string
  adresse?: Address
}
