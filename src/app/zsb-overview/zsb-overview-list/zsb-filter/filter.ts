import {SchoolWithEvents} from '../zsb-overview-list.component'

export interface Filter {
  filter(data: SchoolWithEvents): boolean
}

export class SchoolNameFilter implements Filter {
  private schoolName: string
  constructor(schoolName: string) {
    this.schoolName = schoolName
  }
  filter(data: SchoolWithEvents): boolean {
    return data.school.name.toLowerCase().includes(this.schoolName.toLowerCase())
  }
}

export class SchoolTypeFilter implements Filter {
  private schoolType: number

  constructor(schoolType: number) {
    this.schoolType = schoolType
  }
  filter(data: SchoolWithEvents): boolean {
    return data.school.type === this.schoolType
  }
}

export class GovernmentDistrictFilter implements Filter {
  private governmentDistrict: string

  constructor(governmentDistrict: string) {
    this.governmentDistrict = governmentDistrict
  }
  filter(data: SchoolWithEvents): boolean {
    return data.school.address.city.governmentDistrict === this.governmentDistrict
  }
}

export class ConstituencyFilter implements Filter {
  private constituency: string

  constructor(constituency: string) {
    this.constituency = constituency
  }
  filter(data: SchoolWithEvents): boolean {
    return data.school.address.city.constituency === this.constituency
  }
}

export class DesignationFilter implements Filter {
  private designation: string

  constructor(designation: string) {
    this.designation = designation
  }
  filter(data: SchoolWithEvents): boolean {
    return data.school.address.city.designation === this.designation
  }
}

export class AmountStudentsFilter implements Filter {
  private lower: number
  private upper: number

  constructor(lower: number, upper: number) {
    this.lower = lower
    this.upper = upper
  }
  filter(data: SchoolWithEvents): boolean {
    const  sum = data.school.amount_students11 + data.school.amount_students12 + data.school.amount_students13
    return this.lower <= sum && sum <= this.upper
  }
}

export class KAoAFilter implements Filter {
  private kaoa: boolean

  constructor(kaoa: boolean) {
    this.kaoa = kaoa
  }
  filter(data: SchoolWithEvents): boolean {
    if (this.kaoa === false) {
      return data.school.kaoaSupervisor === 0
    } else {
      return data.school.kaoaSupervisor > 0
    }
  }
}

export class TalentscoutingFilter implements Filter {
  private talentscout: boolean

  constructor(talentscout: boolean) {
    this.talentscout = talentscout
  }
  filter(data: SchoolWithEvents): boolean {
    if (this.talentscout === false) {
      return data.school.talentscout === 0
    } else {
      return data.school.talentscout > 0
    }
  }
}

export class CooperationFilter implements Filter {
  private cooperationcontract: boolean

  constructor(cooperationcontract: boolean) {
    this.cooperationcontract = cooperationcontract
  }
  filter(data: SchoolWithEvents): boolean {
    return data.school.cooperationcontract === this.cooperationcontract
  }
}

export class CompositeFilter implements Filter {
  private filters: Filter[]

  constructor(filters: Filter[]) {
    this.filters = filters
  }
  filter(data: SchoolWithEvents): boolean {
    return this.filters.every(f => f.filter(data))
  }
}
