export interface SchoolType {
  id: number
  desc: string
}

export function schoolTypeDescById(id: number, schoolTypes: SchoolType[]) {
  let desc = ''

  schoolTypes.forEach(it => {
    if (it.id === id) {
      desc = it.desc
      return
    }
  })

  return desc
}
