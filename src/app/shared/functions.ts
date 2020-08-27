import {Observable} from 'rxjs'
import {map, startWith} from 'rxjs/operators'
import {AbstractControl} from '@angular/forms'

export function filterDuplicates(array: string[]) {
  return array.filter((it, index) => array.indexOf(it) === index)
}

export function filterOptions(control: AbstractControl, options: string[]): Observable<string[]> {
  return control.valueChanges.pipe(
    startWith(''),
    map(it => _filter(it, options))
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
