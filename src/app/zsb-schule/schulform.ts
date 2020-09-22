export interface Schulform {
  id: number
  desc: string
}

export function schulformDescById(id: number, schulformen: Schulform[]) {
  let desc = ''

  schulformen.forEach(it => {
    if (it.id === id) {
      desc = it.desc
      return
    }
  })

  return desc
}
