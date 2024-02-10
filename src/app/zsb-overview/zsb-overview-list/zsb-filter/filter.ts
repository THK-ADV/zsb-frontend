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

export class SchoolTypeFilter implements Filter {
  filter(data: SchoolWithEvents[], criteria: number): SchoolWithEvents[] {
    const schoolType = criteria
    return data.filter(item => item.school.type === schoolType)
  }
}

export class GovernmentDisctrictFilter implements Filter {
  filter(data: SchoolWithEvents[], criteria: string): SchoolWithEvents[] {
    const governmentDistrict = criteria
    return data.filter(item => item.school.address.city.governmentDistrict === governmentDistrict )
  }
}

export class ConstituencyFilter implements Filter {
  filter(data: SchoolWithEvents[], criteria: string): SchoolWithEvents[] {
    const constituency = criteria
    return data.filter(item => item.school.address.city.constituency === constituency )
  }
}

export class DesignationFilter implements Filter {
  filter(data: SchoolWithEvents[], criteria: string): SchoolWithEvents[] {
    const designation = criteria
    return data.filter(item => item.school.address.city.designation === designation )
  }
}

/*export class AmountStudentsFilter implements Filter {
  filter(data: SchoolWithEvents[], criteria: number[]): SchoolWithEvents[] {
    // TODO
  }
}*/

export class KAoAFilter implements Filter {
  filter(data: SchoolWithEvents[], criteria: boolean): SchoolWithEvents[] {
    const kaoa = criteria
    if (kaoa === false) {
      return data.filter(item => item.school.kaoaSupervisor === 0)
    } else {
      return data.filter(item => item.school.kaoaSupervisor > 0)
    }
  }
}

export class TalentscoutingFilter implements Filter {
  filter(data: SchoolWithEvents[], criteria: boolean): SchoolWithEvents[] {
    const talentscout = criteria
    if (talentscout === false) {
      return data.filter(item => item.school.talentscout === 0)
    } else {
      return data.filter(item => item.school.talentscout > 0)
    }
  }
}

export class CooperationFilter implements Filter {
  filter(data: SchoolWithEvents[], criteria: boolean): SchoolWithEvents[] {
    const cooperationcontract = criteria
    return data.filter(item => item.school.cooperationcontract === cooperationcontract)
  }
}

export class CompositeFilter implements Filter {
  private filters: Filter[]

  constructor(filters: Filter[]) {
    this.filters = filters
  }

  filter(data: SchoolWithEvents[], criteria: any): SchoolWithEvents[] {
    let filteredData = [...data]

    for (const filter of this.filters) {
      filteredData = filter.filter(filteredData, criteria)
    }

    return filteredData
  }
}
