import {Schule} from '../../zsb-schule/schule'

export class Letter {
  private readonly msg: string
  private readonly addressees: Schule[]
  // tslint:disable-next-line:variable-name
  private readonly signature_id: number

  constructor(msg: string, addressees: Schule[], signatureId: number) {
    this.msg = msg
    this.addressees = addressees
    this.signature_id = signatureId
  }

  getMsg(): string {
    return this.msg
  }

  getAddressees(): Schule[] {
    return this.addressees
  }

  getSignature_id(): number {
    return this.signature_id
  }
}
