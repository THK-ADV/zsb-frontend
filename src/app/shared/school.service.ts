import {Injectable} from '@angular/core'
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms'
import {School} from '../zsb-school/school'
import {DatabaseService} from './database.service'
import {Observable} from 'rxjs'
import {Address} from '../zsb-address/address'
import {City} from '../zsb-address/city'
import {NotificationService} from './notification.service'
import {Contact} from '../zsb-contact/contact'
import {Router} from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private dbService: DatabaseService, private router: Router) {
  }

  newSchool: Observable<School>

  formGroup: FormGroup = new FormGroup({
    school_id: new FormControl(null),
    name: new FormControl('', Validators.required),
    schooltype: new FormControl('', Validators.required),
    // focus: new FormControl(null),
    address: new FormControl({value: '', disabled: true}, Validators.required),
    city: new FormControl(0),
    contacts: new FormArray([]),
    cooperationcontract: new FormControl(false),
    amount_students: new FormControl('', Validators.required),
    kaoa_university: new FormControl(false),
    kaoa_partner: new FormControl(-1),
    talentscouting: new FormControl(false),
    talentscouting_partner: new FormControl(-1)
  })

  // direct access to contacts as array
  get contacts(): FormArray {
    return this.formGroup.get('contacts') as FormArray
  }

  initializeFormGroup() {
    this.contacts.clear()
    this.contacts.push(new FormControl())
    this.formGroup.setValue({
      school_id: null,
      name: '',
      schooltype: '',
      // focus: '',
      address: null,
      city: null,
      contacts: [new FormControl()],
      cooperationcontract: false,
      amount_students: '',
      kaoa_university: false,
      kaoa_partner: -1,
      talentscouting: false,
      talentscouting_partner: -1
    })
    this.contacts.clear()
  }

  loadFormData(school: School) {
    this.contacts.clear()
    this.contacts.push(new FormControl())

    this.formGroup.setValue({
      school_id: school.school_id,
      name: school.name,
      schooltype: school.schooltype,
      // focus: school.focus,
      address: this.getReadableAddress(school.address, school.address.city),
      city: school.address.city.city_id,
      contacts: [new FormControl()],
      cooperationcontract: school.cooperationcontract,
      amount_students: +school.amount_students,
      kaoa_university: school.kaoa_university,
      kaoa_partner: school.kaoa_partner,
      talentscouting: school.talentscouting,
      talentscouting_partner: school.talentscouting_partner
    })

    this.contacts.clear()
    this.addContacts(school.contacts)
  }

  addContact(it: Contact) {
    this.contacts.push(new FormControl(it))
  }

  private addContacts(contacts: Contact[]) {
    contacts.forEach(it => {
      this.addContact(it)
    })
  }

  removeContact(uuid: string) {
    // get all contacts from form
    const formContacts = this.getContactsFromForm()

    // find contact to be removed
    const wantedContact = formContacts.find(it => it.uuid === uuid)
    const wantedIndex = formContacts.indexOf(wantedContact)

    // remove contact
    formContacts.splice(wantedIndex, 1)

    // update form-array
    this.refillFormArray(formContacts)

    // update form
    console.log('removed contact ' + uuid + ' from this school')
  }

  updateContact(updated: Contact) {
    const formContacts = this.getContactsFromForm()

    // get index of old contact
    const oldContact = formContacts.find(it => it.uuid === updated.uuid)
    const index = formContacts.indexOf(oldContact)

    // update contact
    formContacts[index] = updated

    // update form-array
    this.refillFormArray(formContacts)
  }

  /** get all contacts from form */
  private getContactsFromForm(): Contact[] {
    const school = this.formGroup.value as School
    return school.contacts
  }

  private refillFormArray(contacts: Contact[]) {
    this.contacts.clear()
    this.addContacts(contacts)
  }


  updateSchoolWithoutNewAddress(school: School, notificationService: NotificationService) {
    const newSchool = {
      school_id: school.school_id,
      name: school.name,
      schooltype: school.schooltype,
      focus: 'unbekannt',
      address_id: school.address_id,
      city_id: undefined,
      cooperationcontract: school.cooperationcontract,
      amount_students: +school.amount_students,
      kaoa_university: school.kaoa_university,
      kaoa_partner: school.kaoa_partner,
      talentscouting: school.talentscouting,
      talentscouting_partner: school.talentscouting_partner,
      contacts_ids: school.contacts.map(it => it.uuid),
      address: undefined,
      city: undefined
    }

    if (newSchool.school_id == null) {
      notificationService.failure('-- Can\'t update "school" without id. Please contact your administrator')
      return
    } else {
      this.newSchool = this.dbService.updateSchool(newSchool)
    }

    this.newSchool.subscribe(it => {
      if (it.school_id !== undefined) {
        notificationService.success(':: Schule erfolgreich aktualisiert.')
        this.router.navigate(['/'])
      } else {
        notificationService.failure('-- Schule konnte nicht aktualisiert werden.')
      }
    })
  }

  getReadableAddress(address: Address, city: City) {
    return address.street + ' ' + address.houseNumber + ', ' + city.postcode + ' ' + city.designation
  }

  insertOrUpdateSchool(school: School, notificationService: NotificationService) {
    const cityObservable = this.dbService.updateOrCreateCity(school.address.city)
    cityObservable.subscribe(newCity => {
      const address = {
        address_id: null,
        street: school.address.street,
        houseNumber: school.address.houseNumber,
        city_id: newCity.city_id,
        city: null
      }
      const addressObservable = this.dbService.updateOrCreateAddress(address)

      addressObservable.subscribe(newAddress => {
        school.address_id = newAddress.address_id
        school.address = null
        school.contacts_ids = school.contacts.map(it => it.uuid)
        school.focus = 'unbekannt'

        console.log('School before request')
        console.log(school)
        // check if school already exists
        if (school.school_id === undefined || school.school_id === null) {
          this.dbService.createSchool(school).subscribe(it => {
            if (it.school_id !== undefined) {
              notificationService.success(':: Schule erfolgreich erstellt.')
              // return to overview
              this.router.navigate(['/'])
            } else {
              notificationService.failure('-- Schule konnte nicht erstellt werden.')
            }
          })
        } else {
          const result = this.dbService.updateSchool(school)
          result.subscribe(it => {
            if (it.school_id !== undefined) {
              notificationService.success(':: Schule erfolgreich aktualisiert.')
              this.router.navigate(['/'])
            } else {
              notificationService.failure('-- Schule konnte nicht aktualisiert werden.')
            }
          })
        }
      })
    })
  }
}
