import {School} from '../../zsb-school/school'

export class Email {
  private readonly msg: string
  private readonly addressees: string[]
  private readonly schoolIds: string[]
  private readonly subject: string

  constructor(msg: string, addressees: string[], schoolIds: string[], subject: string) {
    this.msg = msg
    this.addressees = addressees
    this.schoolIds = schoolIds
    this.subject = subject
  }

  getMsg(): string {
    return this.msg
  }

  getAddressees(): string[] {
    return this.addressees
  }

  getSchoolIds(): string[] {
    return this.schoolIds
  }

  getSubject(): string {
    return this.subject
  }
}
