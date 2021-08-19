import {Injectable} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Contact, ContactSalutation, ContactFunction} from '../zsb-contact/contact'
import {Observable} from 'rxjs'
import {DatabaseService} from './database.service'

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  contactFunctions: Observable<ContactFunction[]>
  contactSalutationOptions: Observable<ContactSalutation[]>

  constructor(private dbService: DatabaseService) {
    this.contactFunctions = this.dbService.getContactFunctions()
    this.contactSalutationOptions = this.dbService.getContactSalutationOptions()
  }

  public contactForm: FormGroup = new FormGroup({
    uuid: new FormControl(null),
    surname: new FormControl('', Validators.required),
    firstname: new FormControl(''),
    salutation: new FormControl(0, Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    function: new FormControl('', Validators.required)
  })

  public searchForm: FormGroup = new FormGroup({
    searchKey: new FormControl(''),
    enableEdit: new FormControl(false)
  })

  initializeContactForm() {
    this.contactForm.setValue({
      uuid: null,
      surname: '',
      firstname: '',
      salutation: 0,
      email: '',
      function: ''
    })
  }

  populateContactForm(contact: Contact) {
    this.contactForm.setValue({
      uuid: contact.uuid,
      surname: contact.surname,
      firstname: contact.firstname,
      salutation: contact.salutation,
      email: contact.email,
      function: contact.function
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
