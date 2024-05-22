export interface KaoaSupervisor {
  id: number
  desc: string
}

export function kaoaSupervisorDescById(id: number, kaoaSupervisor: KaoaSupervisor[]) {
  let desc = ''

  kaoaSupervisor.forEach(it => {
    if (it.id === id) {
      desc = it.desc
      return
    }
  })

  return desc
}
