export interface AmountStudents {
  id: number
  range: string
}

export function anzahlSusTextById(id: number, anzahlSusList: AmountStudents[]) {
  let range = ''

  anzahlSusList.forEach(it => {
    if (it.id === id) {
      range = it.range
      return
    }
  })

  return range
}
