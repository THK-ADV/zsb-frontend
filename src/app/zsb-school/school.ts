import {Address} from '../zsb-address/address'
import {Contact} from '../zsb-contact/contact'
import {SchoolType, schoolTypeDescById} from './schoolType'
import {AmountStudents, amountStudentsTextById} from './amount-students'

export interface School {
  school_id: string
  surname: string
  schooltype: number
  focus: string
  cooperationcontract: boolean
  address_id: string
  amount_students: number
  kaoa_university: boolean
  kaoa_partner: number
  talentscouting: boolean
  talentscouting_partner: number
  contacts_ids: string[]
  contacts: Contact[]
  address: Address
}

export function completeSchoolAsString(school: School, schoolTypes: SchoolType[], amountStudentsList: AmountStudents[]): string {
  let concatenatedString = school.surname
  concatenatedString += schoolTypeDescById(school.schooltype, schoolTypes)
  if (school.cooperationcontract) concatenatedString += 'Kooperationsvertrag'
  if (school.kaoa_university) concatenatedString += 'kaoa'
  if (school.talentscouting) concatenatedString += 'Talentscouting'
  concatenatedString += amountStudentsTextById(school.amount_students, amountStudentsList)
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
