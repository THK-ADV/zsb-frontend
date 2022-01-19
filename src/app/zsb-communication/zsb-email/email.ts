export class Email {
  private readonly msg: string
  private readonly addressees: string[]
  private readonly subject: string

  constructor(msg: string, addressees: string[], subject: string) {
    this.msg = msg
    this.addressees = addressees
    this.subject = subject
  }

  getMsg(): string {
    return this.msg
  }

  getAddressees(): string[] {
    return this.addressees
  }

  getSubject(): string {
    return this.subject
  }

}
