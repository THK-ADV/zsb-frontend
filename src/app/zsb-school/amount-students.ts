export interface AmountStudents {
  id: number
  range: string
}

export function amountStudentsTextById(id: number, amountStudentsList: AmountStudents[]) {
  let range = ''

  amountStudentsList.forEach(it => {
    if (it.id === id) {
      range = it.range
      return
    }
  })

  return range
}
