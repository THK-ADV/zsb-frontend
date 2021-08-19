import {Host} from './host'

export interface Event {
  uuid: string
  designation: string
  host_id: string
  category: number[]
  topic: string
  date: string
  amountStudents: string
  level: number[]
  sequence: string
  runs: string
  contactperson: string
  host?: Host
}
