import {Address} from '../zsb-address/address'

export interface Institution {
  uuid: string
  designation: string
  email: string
  address_id: string
  address?: Address
}
