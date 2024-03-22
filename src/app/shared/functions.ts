import {Observable} from 'rxjs'
import {map, startWith} from 'rxjs/operators'
import {AbstractControl} from '@angular/forms'
import {Address} from '../zsb-address/address'
import {City} from '../zsb-address/city'

export function filterDuplicates(array: string[]) {
  return array.filter((it, index) => array.indexOf(it) === index)
}

export function filterOptions(control: AbstractControl, options: string[]): string[] {
  return options.filter(option =>
    option.toLowerCase().includes(control.value.trim().toLowerCase())
  )
}

function _filter(value, options: string[]): string[] {
  const valueAsString = value + ''
  const filterValue = valueAsString.toLowerCase()

  return options.filter(option => option.toLowerCase().indexOf(filterValue) === 0)
}

export function sortArrayAlphabetically(array: string[]): string[] {
  return array.sort((a, b) => {
    const textA = a.toUpperCase()
    const textB = b.toUpperCase()
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
  })
}

export function getReadableAddress(address: Address, city: City) {
  return (address.street + ' ' + address.houseNumber + ', ' + city.postcode + ' ' + city.designation).trim()
}
