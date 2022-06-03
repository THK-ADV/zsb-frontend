export interface Contact {
  contact_id: string
  surname: string
  firstname: string
  salutation: number
  email: string
  feature: number
}

export interface ContactFunction {
  id: number
  desc: string
}

export interface ContactSalutation {
  id: number
  desc: string
}


export function combineContactName(contact: Contact): string {
  if (contact.firstname !== undefined && contact.firstname !== '') {
    return contact.surname + ', ' + contact.firstname
  } else if (contact.surname === '') {
    return contact.email
  } else {
    return contact.surname
  }
}
