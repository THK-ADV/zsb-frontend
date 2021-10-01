import {City} from './city'

export interface Address {
  address_id: string
  street: string
  houseNumber: string
  city_id: string
  city: City
}
