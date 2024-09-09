import {Component, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {DatabaseService} from '../../shared/database.service'
import {forkJoin, Observable, Subscription} from 'rxjs'
import {Address} from '../../zsb-address/address'
import {SchoolService} from '../../shared/school.service'
import {NotificationService} from '../../shared/notification.service'
import {SchoolType} from '../schoolType'
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog'
import {AddressStatus} from '../../zsb-address/zsb-address.component'
import {AddressService} from '../../shared/address.service'
import {Contact, ContactFunction} from '../../zsb-contact/contact'
import {ZsbContactDetailComponent} from '../../zsb-contact/zsb-contact-detail/zsb-contact-detail.component'
import {ZsbContactSearchComponent} from '../../zsb-contact/zsb-contact-search/zsb-contact-search.component'
import {AbstractControl, ValidationErrors} from '@angular/forms'
import {CooperationPartner} from '../cooperationPartner'
import {KaoaSupervisor} from '../kaoaSupervisor'
import {TalentScout} from '../talentScout'
import {MatTableDataSource} from '@angular/material/table'

@Component({
  selector: 'app-zsb-school-detail',
  templateUrl: './zsb-school-detail.component.html',
  styleUrls: ['./zsb-school-detail.component.css']
})
export class ZsbSchoolDetailComponent implements OnInit {
  private address: Address
  schoolId: string
  contacts: Contact[] = []
  addresses: Address[]
  contactData: MatTableDataSource<Contact>
  contactFunctions: ContactFunction[]
  schoolTypes: Observable<SchoolType[]>
  cooperationPartners: Observable<CooperationPartner[]>
  kaoaSupervisors: Observable<KaoaSupervisor[]>
  talentScouts: Observable<TalentScout[]>
  addressId: string
  displayedContactColumns: Array<string> = [
    'contactName',
    'contactFeature',
    'contactActions'
  ]

  addressUndefined = true

  private subs: Subscription[] = []

  constructor(
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    private addressService: AddressService,
    public service: SchoolService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.schoolTypes = this.dbService.getSchoolType()
    this.cooperationPartners = this.dbService.getCooperationPartner()
    this.kaoaSupervisors = this.dbService.getKaoaSupervisors()
    this.talentScouts = this.dbService.getTalentScouts()
    this.contactData = new MatTableDataSource(this.contacts)
    this.service.initializeFormGroup()
    this.subs.push(
      this.dbService.getContactFunctions().subscribe(functions =>
        this.contactFunctions = functions
      )
    )

    this.subs.push(
      this.route.paramMap.subscribe(params => {
        this.schoolId = params.get('schoolId')
        if (this.schoolId != null) {
          this.loadSchool(this.schoolId)
        }
      })
    )

  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe())
  }

  private loadSchool(uuid: string) {
    this.service.dbService.getSchoolById(uuid).subscribe(school => {
      this.addressId = school.address_id
      this.subs.push(
        this.dbService.getAddressAtomicById(this.addressId).subscribe(address => {
          this.address = address
          const contactsIds = school.contacts_ids === undefined ? [] : school.contacts_ids
          if (contactsIds.length === 0) { // Wenn keine Kontakte vorhanden sind
            this.service.loadFormData(school, this.address, [])
            this.addressUndefined = false
          } else {
            forkJoin(contactsIds.map(id => this.dbService.getContactById(id))).subscribe(contacts => {
              this.contacts = contacts
              this.service.loadFormData(school, this.address, this.contacts)
              this.contactData = new MatTableDataSource(this.contacts)
              this.addressUndefined = false
            })
          }
        })
      )
    })
  }

  onSubmit() {
    const school = this.service.formGroup.value
    const cleanedContacts = []
    school.contacts.forEach(it => {
      if (it != null) {
        cleanedContacts.push(it)
      }
    })
    school.contacts = cleanedContacts
    if (school.address !== undefined || school.school_id === null) {
      school.city = this.address.city
      school.address = this.address
      this.service.insertOrUpdateSchool(school, this.notificationService)
    } else {
      school.address_id = this.addressId
      this.service.updateSchoolWithoutNewAddress(school, this.notificationService)
    }
  }

  onClear() {
    this.service.formGroup.reset()
    this.service.initializeFormGroup()
    this.ngOnInit()
    this.notificationService.success(':: Formular zurückgesetzt.')
  }

  changeAddress() {
    if (this.addressId === undefined) this.addressId = null
    AddressService.openAddressDialog(this.dialog, this.addressId)
      .subscribe(addressResult => {
        if (addressResult === undefined) {
          this.notificationService.failure('Adresse konnte nicht aktualisiert werden.')
          return
        }

        if (addressResult.status === AddressStatus.CANCELLATION) return
        this.address = addressResult.address
        this.notificationService.success('Adresse aktualisiert.')
        if (this.address !== undefined) {
          this.service.formGroup.patchValue(
            {address: this.service.getReadableAddress(this.address, this.address.city)}
          )
          this.addressUndefined = false
        }
      })
  }

  getFormValidationErrors() {
    Object.keys(this.service.formGroup.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.service.formGroup.get(key).errors
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError])
        })
      }
    })
  }

  showContactDetail(contact: Contact) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.width = '30%'
    dialogConfig.data = contact
    const dialogRef = this.dialog.open(ZsbContactDetailComponent, dialogConfig)
    dialogRef.componentInstance.contact = contact

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return
      }
      this.service.updateContact(result as Contact)
    })
  }

  getContactFunctionDescById(id: number) {
    let desc = 'Unbekannt'

    if (this.contactFunctions !== undefined && this.contactFunctions !== null) {
      this.contactFunctions.forEach(it => {
        if (desc === 'Unbekannt') {
          if (it.id === id) {
            desc = it.desc
          }
        }
      })
    }
    return desc
  }

  private createDialog(): MatDialogRef<ZsbContactSearchComponent, Contact> {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.width = '30%'
    return this.dialog.open(ZsbContactSearchComponent, dialogConfig)
  }

  addContact() {
    this.createDialog()
      .afterClosed()
      .subscribe(chosenContact => {
        if (chosenContact === undefined) {
          return
        }
        this.updateContacts(chosenContact)
      })
  }

  private updateContacts(newContact: Contact) {
    this.service.addContact(newContact)
    this.contacts.push(newContact)
    this.contactData.data = [...this.contacts]
  }

  removeContact(contact: Contact) {
    const index = this.contacts.findIndex(c => c.contact_id === contact.contact_id)
    if (index >= 0) {
      this.contacts.splice(index, 1)
      this.contactData.data = [...this.contacts]
      this.service.removeContact(contact)
    }
  }
}
