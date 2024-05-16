import {School} from '../../zsb-school/school'

export class Email {
  private readonly msg: string
  private readonly addressees: string[]
  private readonly schools: School[]
  private readonly subject: string

  constructor(msg: string, addressees: string[], schools: School[], subject: string) {
    this.msg = msg
    this.addressees = addressees
    this.schools = schools
    this.subject = subject
  }

  getMsg(): string {
    return this.msg
  }

  getAddressees(): string[] {
    return this.addressees
  }

  getSchools(): School[] {
    return this.schools
  }

  getSubject(): string {
    return this.subject
  }

}
