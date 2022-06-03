import {Injectable} from '@angular/core'
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms'
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

  newSchool: Observable<School>
  formGroup: FormGroup
  contacts: FormArray

  constructor(private dbService: DatabaseService, private router: Router) {
    this.contacts = new FormArray([])
    this.formGroup = new FormGroup({
      school_id: new FormControl(null),
      name: new FormControl('', Validators.required),
      schooltype: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      website: new FormControl('', Validators.required),
      comment: new FormControl(''),
      // focus: new FormControl(null),
      address: new FormControl({value: '', disabled: true}, Validators.required),
      city: new FormControl(0),
      contacts: this.contacts,
      cooperationContract: new FormControl(false),
      amount_students11: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(150)
      ]),
      amount_students12: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(150)
      ]),
      amount_students13: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(150)
      ]),
      cooperationPartner: new FormControl('', Validators.required),
      kaoaSupervisor: new FormControl('', Validators.required),
      talentScout: new FormControl('', Validators.required),
    })
  }

  initializeFormGroup() {
    this.contacts.clear()

    this.formGroup.setValue({
      ...this.formGroup.value,
      school_id: null,
      name: '',
      schooltype: '',
      phoneNumber: '',
      email: '',
      website: '',
      comment: '',
      address: null,
      city: null,
      cooperationContract: false,
      amount_students11: '',
      amount_students12: '',
      amount_students13: '',
      cooperationPartner: '',
      kaoaSupervisor: '',
      talentScout: '',
    })
  }

  loadFormData(school: School) {
    this.contacts.clear()

    this.formGroup.setValue({
      ...this.formGroup.value,
      school_id: school.id,
      name: school.name,
      schooltype: school.type,
      phoneNumber: school.phonenumber,
      email: school.email,
      website: school.website,
      comment: school.comment,
      address: this.getReadableAddress(school.address, school.address.city),
      city: school.address.city.city_id,
      cooperationContract: school.cooperationcontract,
      amount_students11: school.amount_students11,
      amount_students12: school.amount_students12,
      amount_students13: school.amount_students13,
      cooperationPartner: school.cooperationpartner,
      kaoaSupervisor: school.kaoaSupervisor,
      talentScout: school.talentscout,
    })

    this.addContacts(school.contacts)
  }

  addContact(contact: Contact) {
    const contactAlreadyExists = this.contacts.controls.some(c => c.value.contact_id === contact.contact_id)
    if (!contactAlreadyExists) {
      this.contacts.push(new FormControl(contact))
    }
  }

  private addContacts(contacts: Contact[]) {
    contacts.forEach(c => this.addContact(c))
  }

  removeContact(control: AbstractControl) {
    const contacts = this.contacts
    const index = contacts.controls.indexOf(control)
    contacts.removeAt(index)
  }

  updateContact(updated: Contact) {
    const formContacts = this.getContactsFromForm()
    const index = formContacts.findIndex(it => it.contact_id === updated.contact_id)
    formContacts[index] = updated
    this.contacts.clear()
    this.addContacts(formContacts)
  }

  /** get all contacts from form */
  private getContactsFromForm(): Contact[] {
    const school = this.formGroup.value as School
    return school.contacts
  }

  updateSchoolWithoutNewAddress(school: School, notificationService: NotificationService) {
    const newSchool = {
      school_id: school.id,
      name: school.name,
      schooltype: school.type,
      phoneNumber: school.phonenumber,
      email: school.email,
      website: school.website,
      comment: school.comment,
      focus: 'unbekannt',
      address_id: school.address_id,
      city_id: undefined,
      cooperationContract: school.cooperationcontract,
      mount_students11: school.amount_students11,
      mount_students12: school.amount_students12,
      mount_students13: school.amount_students13,
      cooperationPartner: school.cooperationpartner,
      kaoaSupervisor: school.kaoaSupervisor,
      talentScout: school.talentscout,
      contacts_ids: school.contacts.map(it => it.contact_id),
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
      if (it.id !== undefined) {
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
        school.contacts_ids = school.contacts.map(it => it.contact_id)

        console.log('School before request')
        console.log(school)
        // check if school already exists
        if (school.id === undefined || school.id === null) {
          this.dbService.createSchool(school).subscribe(it => {
            if (it.id !== undefined) {
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
            if (it.id !== undefined) {
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
