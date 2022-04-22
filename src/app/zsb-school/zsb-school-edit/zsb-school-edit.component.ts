import {Component, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {DatabaseService} from '../../shared/database.service'
import {Observable} from 'rxjs'
import {Address} from '../../zsb-address/address'
import {SchoolService} from '../../shared/school.service'
import {NotificationService} from '../../shared/notification.service'
import {SchoolType} from '../schoolType'
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog'
import {AddressStatus} from '../../zsb-address/zsb-address.component'
import {AddressService} from '../../shared/address.service'
import {AmountStudents} from '../amount-students'
import {Contact, ContactFunction} from '../../zsb-contact/contact'
import {ZsbContactDetailComponent} from '../../zsb-contact/zsb-contact-detail/zsb-contact-detail.component'
import {ZsbContactSearchComponent} from '../../zsb-contact/zsb-contact-search/zsb-contact-search.component'
import {ValidationErrors} from '@angular/forms'
import {CooperationPartner} from '../cooperationPartner'

@Component({
  selector: 'app-zsb-school-edit',
  templateUrl: './zsb-school-edit.component.html',
  styleUrls: ['./zsb-school-edit.component.css']
})
export class ZsbSchoolEditComponent implements OnInit {

  private address: Address
  schoolId: string
  addressObservable: Observable<Address[]>
  schoolTypes: Observable<SchoolType[]>
  amountStudentsRanges: Observable<AmountStudents[]>
  contactFunctions: ContactFunction[]
  cooperationPartners: CooperationPartner[]

  addressId: string
  cityId: string

  addressUndefined = true

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
    this.service.initializeFormGroup()
    this.addressObservable = this.dbService.getAddresses()

    this.schoolTypes = this.dbService.getSchoolType()
    this.amountStudentsRanges = this.dbService.getAmountStudents()

    // fill kontakt funktionen
    this.dbService.getContactFunctions().subscribe(functions => {
      this.contactFunctions = functions
    })

    this.dbService.getCooperationPartner().subscribe(partner => {
      this.cooperationPartners = partner
    })

    this.route.paramMap.subscribe(params => {
      this.schoolId = params.get('schoolId')

      if (this.schoolId != null) {
        // load existing schule
        this.dbService.getSchoolByIdAtomic(this.schoolId).subscribe(school => {
          this.service.loadFormData(school)
          this.addressId = school.address_id
          this.addressObservable.subscribe(it => {
            const address = this.dbService.getAddressFromArrayByAddressId(it, this.addressId)
            this.cityId = address.city_id
          })
          this.addressUndefined = false
        })
      }
    })
  }

  onSubmit() {
    const school = this.service.formGroup.value

    // remove nulls from contacts-array
    const cleanedContacts = []
    school.contacts.forEach(it => {
      if (it != null) {
        cleanedContacts.push(it)
      }
    })
    school.contacts = cleanedContacts

    if (this.address !== undefined) {
      school.city = this.address.city
      school.address = this.address
      this.service.insertOrUpdateSchool(school, this.notificationService)
    } else {
      school.address_id = this.addressId
      this.service.updateSchoolWithoutNewAddress(school, this.notificationService)
    }
  }

  onClear() {
    console.log('CLEAR')
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

        // address update
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

  showContactDetail(contactId: string) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.width = '30%'
    const dialogRef = this.dialog.open(ZsbContactDetailComponent, dialogConfig)
    dialogRef.componentInstance.uuid = contactId

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return
      }

      const contact = result as Contact
      console.log('new name: ' + contact?.surname)

      this.service.updateContact(contact)
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

  private createDialog(component, width: number = 30): MatDialogRef<any> {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.width = '${width}%'

    return this.dialog.open(component, dialogConfig)
  }

  addContact() {
    const dialogRef = this.createDialog(ZsbContactSearchComponent)
    dialogRef.afterClosed().subscribe(it => {
      // do nothing, if nothing got added
      if (it === undefined) {
        return
      }

      const newContact = it as Contact
      this.service.addContact(newContact)
    })

    console.log('Add contact')
  }
}
