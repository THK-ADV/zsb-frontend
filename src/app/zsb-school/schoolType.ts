export interface SchoolType {
  id: number
  desc: string
}

export function schulformDescById(id: number, schulformen: SchoolType[]) {
  let desc = ''

  schulformen.forEach(it => {
    if (it.id === id) {
      desc = it.desc
      return
    }
  })

  return desc
}
