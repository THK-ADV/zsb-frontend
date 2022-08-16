import {School} from './school'

export interface KAoAWork {
  id?: string,
  name: string,
  content: string,
  school_id: string,
  school?: School
}
