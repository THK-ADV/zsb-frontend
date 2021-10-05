import {Address} from '../zsb-address/address'

export interface Institution {
  uuid: string
  designation: string
  email: string
  address_id: string
  address?: Address
}

export function completeInstitutionAsString(institution: Institution): string {
  let concatenatedString = institution.designation
  concatenatedString += institution.email
  concatenatedString += institution.address.city.postcode
  concatenatedString += institution.address.city.designation
  concatenatedString += institution.address.city.governmentDistrict
  concatenatedString += institution.address.city.constituency
  concatenatedString += institution.address.street + ' ' + institution.address.houseNumber

  return concatenatedString
}
