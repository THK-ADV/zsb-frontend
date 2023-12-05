import {Component, OnDestroy, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {DatabaseService} from '../../shared/database.service'
import {Observable, Subscription} from 'rxjs'
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
import {KAoAWork} from '../kAoAWork'

@Component({
  selector: 'app-zsb-school-detail',
  templateUrl: './zsb-school-detail.component.html',
  styleUrls: ['./zsb-school-detail.component.css']
})
export class ZsbSchoolDetailComponent implements OnInit, OnDestroy {

  private address: Address
  schoolId: string
  addressObservable: Observable<Address[]>
  schoolTypes: Observable<SchoolType[]>
  contactFunctions: ContactFunction[]
  cooperationPartners: Observable<CooperationPartner[]>
  kaoaSupervisors: Observable<KaoaSupervisor[]>
  talentScouts: Observable<TalentScout[]>

  kAoAWork: KAoAWork[] = []

  addressId: string
  cityId: string

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
    this.service.initializeFormGroup()
    this.addressObservable = this.dbService.getAddresses()
    this.schoolTypes = this.dbService.getSchoolType()
    this.cooperationPartners = this.dbService.getCooperationPartner()
    this.kaoaSupervisors = this.dbService.getKaoaSupervisors()
    this.talentScouts = this.dbService.getTalentScouts()

    this.subs.push(
      this.dbService.getContactFunctions().subscribe(functions =>
        this.contactFunctions = functions
      )
    )

    this.subs.push(
      this.route.paramMap.subscribe(params => {
        this.schoolId = params.get('schoolId')

        if (this.schoolId != null) {
          // load existing schule
          this.subs.push(
            this.dbService.getSchoolByIdAtomic(this.schoolId).subscribe(school => {
              this.service.loadFormData(school)
              this.addressId = school.address_id
              this.subs.push(
                this.addressObservable.subscribe(it => {
                  const address = this.dbService.getAddressFromArrayByAddressId(it, this.addressId)
                  this.cityId = address.city_id
                })
              )
              this.addressUndefined = false
            })
          )

          this.subs.push(
            this.dbService.getKAoAWorkBySchoolId(this.schoolId).subscribe(kAoAWork => {
              this.kAoAWork = kAoAWork
            })
          )
        }
      })
    )

  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe())
  }

  onSubmit() {
    const school = this.service.formGroup.value
    console.log(school)
    // remove nulls from contacts-array
    // const cleanedContacts = []
    // school.contacts.forEach(it => {
    //   if (it != null) {
    //     cleanedContacts.push(it)
    //   }
    // })
    // school.contacts = cleanedContacts
    //
    // if (this.address !== undefined) {
    //   school.city = this.address.city
    //   school.address = this.address
    //   this.service.insertOrUpdateSchool(school, this.notificationService)
    // } else {
    //   school.address_id = this.addressId
    //   this.service.updateSchoolWithoutNewAddress(school, this.notificationService)
    // }
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

  showContactDetail(control: AbstractControl) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.width = '30%'
    const dialogRef = this.dialog.open(ZsbContactDetailComponent, dialogConfig)
    dialogRef.componentInstance.contact = control.value as Contact

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
    return this.dialog.open(ZsbContactSearchComponent, dialogConfig)
  }

  addContact() {
    this.createDialog()
      .afterClosed()
      .subscribe(chosenContact => {
        // do nothing, if nothing got added
        if (chosenContact === undefined) {
          return
        }

        this.service.addContact(chosenContact)
      })
  }
}
