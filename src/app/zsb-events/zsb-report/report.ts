import {Event} from '../event'

export interface Report {
  uuid: string
  title: string
  text: string
  event_id: string
  event?: Event
}
