import {KaoaSupervisor} from './kaoaSupervisor'

export interface TalentScout {
  id: number
  desc: string
}

export function talentScoutDescById(id: number, talentScout: TalentScout[]) {
  let desc = ''

  talentScout.forEach(it => {
    if (it.id === id) {
      desc = it.desc
      return
    }
  })

  return desc
}
