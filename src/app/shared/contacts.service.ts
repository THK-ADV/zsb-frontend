import {Injectable} from '@angular/core'
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms'
import {Contact, ContactSalutation, ContactFunction} from '../zsb-contact/contact'
import {Observable} from 'rxjs'
import {DatabaseService} from './database.service'

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  contactFunctions: Observable<ContactFunction[]>
  contactSalutationOptions: Observable<ContactSalutation[]>
  contactForm: UntypedFormGroup

  constructor(private dbService: DatabaseService) {
    this.contactFunctions = this.dbService.getContactFunctions()
    this.contactSalutationOptions = this.dbService.getContactSalutationOptions()
    this.contactForm = new UntypedFormGroup({
      contact_id: new UntypedFormControl(null),
      surname: new UntypedFormControl('', Validators.required),
      firstname: new UntypedFormControl(''),
      salutation: new UntypedFormControl(null, Validators.required),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      feature: new UntypedFormControl(null, Validators.required)
    })
  }

  public searchForm: UntypedFormGroup = new UntypedFormGroup({
    searchKey: new UntypedFormControl(''),
    enableEdit: new UntypedFormControl(false)
  })

  initializeContactForm() {
    this.contactForm.setValue({
      contact_id: null,
      surname: '',
      firstname: '',
      salutation: null,
      email: '',
      feature: null
    })
  }

  populateContactForm(contact: Contact) {
    this.contactForm.setValue({
      contact_id: contact.contact_id,
      surname: contact.surname,
      firstname: contact.firstname,
      salutation: contact.salutation,
      email: contact.email,
      feature: contact.feature
    })
  }

  /**
   * get the modified Contact from Form
   */
  getContact(): Contact {
    return this.contactForm.value
  }

  clearSearch() {
    this.searchForm.patchValue({searchKey: ''})
  }
}
