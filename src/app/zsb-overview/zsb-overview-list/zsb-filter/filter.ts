import {SchoolWithEvents} from '../zsb-overview-list.component'

interface Filter {
  filter(data: SchoolWithEvents[], criteria: any): SchoolWithEvents[]
}

export class SchoolNameFilter implements Filter {
  filter(data: SchoolWithEvents[], criteria: string): SchoolWithEvents[] {
    const schoolName = criteria
    return data.filter(item => item.school.name.toLowerCase().includes(schoolName.toLowerCase()))
  }
}
