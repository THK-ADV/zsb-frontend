import {Injectable} from '@angular/core'
import {AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms'
import {School} from '../zsb-school/school'
import {DatabaseService} from './database.service'
import {Observable} from 'rxjs'
import {Address} from '../zsb-address/address'
import {City} from '../zsb-address/city'
import {NotificationService} from './notification.service'
import {Contact} from '../zsb-contact/contact'
import {Router} from '@angular/router'
import {getReadableAddress} from './functions'

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  newSchool: Observable<School>
  formGroup: UntypedFormGroup
  contacts: UntypedFormArray

  constructor(public dbService: DatabaseService,
              private router: Router) {
    this.contacts = new UntypedFormArray([])
    this.formGroup = new UntypedFormGroup({
      school_id: new UntypedFormControl(null),
      name: new UntypedFormControl('', Validators.required),
      schooltype: new UntypedFormControl('', Validators.required),
      phoneNumber: new UntypedFormControl('', Validators.required),
      email: new UntypedFormControl('', Validators.required),
      website: new UntypedFormControl('', Validators.required),
      comment: new UntypedFormControl(''),
      address: new UntypedFormControl({value: '', disabled: true}, Validators.required),
      city: new UntypedFormControl(0),
      contacts: this.contacts,
      cooperationContract: new UntypedFormControl(false),
      amount_students11: new UntypedFormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(150)
      ]),
      amount_students12: new UntypedFormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(150)
      ]),
      amount_students13: new UntypedFormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(150)
      ]),
      cooperationPartner: new UntypedFormControl('', Validators.required),
      kaoaSupervisor: new UntypedFormControl('', Validators.required),
      talentScout: new UntypedFormControl('', Validators.required),
    })
  }

  initializeFormGroup() {
    this.contacts.clear()
    this.formGroup.setValue({
      school_id: null,
      name: '',
      schooltype: '',
      phoneNumber: '',
      email: '',
      website: '',
      comment: '',
      address: null,
      city: null,
      contacts: [],
      cooperationContract: false,
      amount_students11: '',
      amount_students12: '',
      amount_students13: '',
      cooperationPartner: '',
      kaoaSupervisor: '',
      talentScout: ''
    })
  }

  loadFormData(school: School) {
    this.contacts.clear()
    this.addContacts(school.contacts)
    this.formGroup.setValue({
      school_id: school.id,
      name: school.name,
      schooltype: school.type,
      phoneNumber: school.phonenumber,
      email: school.email,
      website: school.website,
      comment: school.comment,
      amount_students11: school.amount_students11,
      amount_students12: school.amount_students12,
      amount_students13: school.amount_students13,
      address: getReadableAddress(school.address, school.address.city),
      city: school.address.city,
      contacts: school.contacts,
      cooperationContract: school.cooperationcontract,
      cooperationPartner: school.cooperationpartner,
      kaoaSupervisor: school.kaoaSupervisor,
      talentScout: school.talentscout,
    })
  }

  addContact(contact: Contact) {
    const contactAlreadyExists = this.contacts.controls.some(c => c.value.contact_id === contact.contact_id)
    if (!contactAlreadyExists) {
      this.contacts.push(new UntypedFormControl(contact))
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

  updateSchoolWithoutNewAddress(schoolForm: any, notificationService: NotificationService) {
    const schoolObject: School = {
      id: schoolForm.school_id,
      name: schoolForm.name,
      type: schoolForm.schooltype,
      comment: schoolForm.comment,
      amount_students11: schoolForm.amount_students11,
      amount_students12: schoolForm.amount_students12,
      amount_students13: schoolForm.amount_students13,
      phonenumber: schoolForm.phoneNumber,
      email: schoolForm.email,
      website: schoolForm.website,
      cooperationpartner: schoolForm.cooperationPartner,
      kaoaSupervisor: schoolForm.kaoaSupervisor,
      talentscout: schoolForm.talentScout,
      cooperationcontract: schoolForm.cooperationContract,
      address_id: schoolForm.address_id,
      address: schoolForm.address,
      contacts_ids: schoolForm.contacts.map(it => it.contact_id),
      contacts: schoolForm.contacts
    }

    if (schoolObject.id == null) {
      notificationService.failure('-- Can\'t update "school" without id. Please contact your administrator')
      return
    } else {
      this.newSchool = this.dbService.updateSchool(schoolObject)
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

  insertOrUpdateSchool(schoolForm: any, notificationService: NotificationService) {
    const schoolObject: School = {
      id: schoolForm.school_id,
      name: schoolForm.name,
      type: schoolForm.schooltype,
      comment: schoolForm.comment,
      amount_students11: schoolForm.amount_students11,
      amount_students12: schoolForm.amount_students12,
      amount_students13: schoolForm.amount_students13,
      phonenumber: schoolForm.phoneNumber,
      email: schoolForm.email,
      website: schoolForm.website,
      cooperationpartner: schoolForm.cooperationPartner,
      kaoaSupervisor: schoolForm.kaoaSupervisor,
      talentscout: schoolForm.talentScout,
      cooperationcontract: schoolForm.cooperationContract,
      address_id: schoolForm.address_id,
      address: schoolForm.address,
      contacts_ids: schoolForm.contacts.map(it => it.contact_id),
      contacts: schoolForm.contacts,
    }
    const cityObservable = this.dbService.updateOrCreateCity(schoolForm.city)
    cityObservable.subscribe(newCity => {
      const address = {
        id: null,
        street: schoolObject.address.street,
        houseNumber: schoolObject.address.houseNumber,
        city_id: newCity.id,
        city: null
      }
      const addressObservable = this.dbService.updateOrCreateAddress(address)

      addressObservable.subscribe(newAddress => {
        schoolObject.address_id = newAddress.id
        schoolObject.address = null
        schoolObject.contacts_ids = schoolObject.contacts.map(it => it.contact_id)

        // check if school already exists
        if (schoolObject.id === undefined || schoolObject.id === null) {
          this.dbService.createSchool(schoolObject).subscribe(it => {
            if (it.id !== undefined) {
              notificationService.success(':: Schule erfolgreich erstellt.')
              // return to overview
              this.router.navigate(['/'])
            } else {
              notificationService.failure('-- Schule konnte nicht erstellt werden.')
            }
          })
        } else {
          const result = this.dbService.updateSchool(schoolObject)
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
