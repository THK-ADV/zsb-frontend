import {Address} from '../zsb-address/address'
import {Contact} from '../zsb-contact/contact'
import {SchoolType, schoolTypeDescById} from './schoolType'

export interface School {
  id: string
  name: string
  type: number
  comment: string
  amount_students11: number
  amount_students12: number
  amount_students13: number
  phonenumber: string
  email: string
  website: string
  cooperationpartner: number
  kaoaSupervisor: number
  talentscout: number
  cooperationcontract: boolean
  address_id: string
  address: Address
  contacts_ids: string[]
  contacts: Contact[]
}

export function completeSchoolAsString(school: School, schoolTypes: SchoolType[]): string {
  let concatenatedString = school.name
  concatenatedString += schoolTypeDescById(school.type, schoolTypes)
  if (school.cooperationcontract) concatenatedString += 'Kooperationsvertrag'
  // TODO
  // if (school.kaoa_university) concatenatedString += 'kaoa'
  // if (school.talentscouting) concatenatedString += 'Talentscouting'
  // concatenatedString += amountStudentsTextById(school.amount_students, amountStudentsList)
  concatenatedString += school.address.city.postcode
  concatenatedString += school.address.city.designation
  concatenatedString += school.address.city.governmentDistrict
  concatenatedString += school.address.city.constituency
  concatenatedString += school.address.street + ' ' + school.address.houseNumber

  school.contacts.forEach(contact => {
    concatenatedString += contact.surname
  })

  return concatenatedString
}
