import {City} from './city'

export interface Address {
  id: string
  street: string
  houseNumber: string
  city_id: string
  city: City
}
