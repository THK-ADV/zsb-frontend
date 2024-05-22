export interface CooperationPartner {
  id: number
  desc: string
}

export function cooperationPartnerDescById(id: number, cooperationPartner: CooperationPartner[]) {
  let desc = ''

  cooperationPartner.forEach(it => {
    if (it.id === id) {
      desc = it.desc
      return
    }
  })

  return desc
}
