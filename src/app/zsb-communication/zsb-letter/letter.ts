import {School} from '../../zsb-school/school'

export class Letter {
  private readonly msg: string
  private readonly addressees: School[]
  // tslint:disable-next-line:variable-name
  private readonly signature_id: number

  constructor(msg: string, addressees: School[], signatureId: number) {
    this.msg = msg
    this.addressees = addressees
    this.signature_id = signatureId
  }

  getMsg(): string {
    return this.msg
  }

  getAddressees(): School[] {
    return this.addressees
  }

  getSignature_id(): number {
    return this.signature_id
  }
}
