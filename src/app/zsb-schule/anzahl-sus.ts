export interface AnzahlSus {
  id: number
  range: string
}

export function anzahlSusTextById(id: number, anzahlSusList: AnzahlSus[]) {
  let range = ''

  anzahlSusList.forEach(it => {
    if (it.id === id) {
      range = it.range
      return
    }
  })

  return range
}
