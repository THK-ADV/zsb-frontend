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
import {ZsbContactDetailComponent} from '../../zsb-contact/zsb-kontakt-detail/zsb-contact-detail.component'
import {ZsbKontaktSearchComponent} from '../../zsb-contact/zsb-kontakt-search/zsb-kontakt-search.component'
import {ValidationErrors} from '@angular/forms'
import {CooperationPartner} from '../cooperationPartner'

@Component({
  selector: 'app-zsb-schule-detail',
  templateUrl: './zsb-schule-detail.component.html',
  styleUrls: ['./zsb-schule-detail.component.css']
})
export class ZsbSchuleDetailComponent implements OnInit {

  private adresse: Address
  schuleId: string
  adressenObservable: Observable<Address[]>
  schulformen: Observable<SchoolType[]>
  anzahlSusRanges: Observable<AmountStudents[]>
  kontaktFunktionen: ContactFunction[]
  kooperationspartner: CooperationPartner[]

  adresseId: string
  ortId: string

  constructor(
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    private adresseService: AddressService,
    public service: SchoolService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.service.initializeFormGroup()
    this.adressenObservable = this.dbService.getAddresses()

    this.schulformen = this.dbService.getSchoolType()
    this.anzahlSusRanges = this.dbService.getAmountStudents()

    // fill kontakt funktionen
    this.dbService.getContactFunctions().subscribe(funktionen => {
      this.kontaktFunktionen = funktionen
    })

    this.dbService.getCooperationPartner().subscribe(partner => {
      this.kooperationspartner = partner
    })

    this.route.paramMap.subscribe(params => {
      this.schuleId = params.get('schuleId')

      if (this.schuleId != null) {
        // load existing schule
        this.dbService.getSchoolByIdAtomic(this.schuleId).subscribe(schule => {
          this.service.loadFormData(schule)
          this.adresseId = schule.address_id
          this.adressenObservable.subscribe(it => {
            const adresse = this.dbService.getAddressFromArrayByAddressId(it, this.addressId)
            this.ortId = adresse.city_id
          })
        })
      }
    })
  }

  onSubmit() {
    const schule = this.service.formGroup.value

    // remove nulls from kontakte-array
    const cleanedKontakte = []
    schule.kontakte.forEach(it => {
      if (it != null) {
        cleanedKontakte.push(it)
      }
    })
    schule.kontakte = cleanedKontakte

    if (this.address !== undefined) {
      schule.ort = this.address.city
      schule.adresse = this.address
      this.service.insertOrUpdateSchool(schule, this.notificationService)
    } else {
      schule.adress_id = this.addressId
      this.service.updateSchoolWithoutNewAddress(schule, this.notificationService)
    }
  }

  onClear() {
    console.log('CLEAR')
    this.service.formGroup.reset()
    this.service.initializeFormGroup()
    this.ngOnInit()
    this.notificationService.success(':: Formular zurückgesetzt.')
  }

  changeAdresse() {
    if (this.addressId === undefined) this.adresseId = null

    AddressService.openAddressDialog(this.dialog, this.addressId)
      .subscribe(adresseResult => {
        if (adresseResult === undefined) {
          this.notificationService.failure('Adresse konnte nicht aktualisiert werden.')
          return
        }

        if (adresseResult.status === AddressStatus.CANCELLATION) return

        // adresse update
        this.adresse = adresseResult.address
        this.notificationService.success('Adresse aktualisiert.')
        if (this.address !== undefined) {
          this.service.formGroup.patchValue(
            {address: this.service.getReadableAddress(this.address, this.address.city)}
          )
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

  showKontaktDetail(kontaktId: string) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.width = '30%'
    const dialogRef = this.dialog.open(ZsbContactDetailComponent, dialogConfig)
    dialogRef.componentInstance.uuid = kontaktId

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return
      }

      const kontakt = result as Contact
      console.log('new name: ' + kontakt?.surname)

      this.service.updateContact(kontakt)
    })
  }

  getKontaktFunktionDescById(id: number) {
    let desc = 'Unbekannt'

    if (this.kontaktFunktionen !== undefined && this.kontaktFunktionen !== null) {
      this.kontaktFunktionen.forEach(it => {
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

  addKontakt() {
    const dialogRef = this.createDialog(ZsbKontaktSearchComponent)
    dialogRef.afterClosed().subscribe(it => {
      // do nothing, if nothing got added
      if (it === undefined) {
        return
      }

      const newKontakt = it as Contact
      this.service.addContact(newKontakt)
    })

    console.log('Add kontakt')
  }
}
