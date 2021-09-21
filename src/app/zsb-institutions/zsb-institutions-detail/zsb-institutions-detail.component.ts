import {Component, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {InstitutionsService} from '../institutions.service'
import {NotificationService} from '../../shared/notification.service'
import {MatDialog} from '@angular/material/dialog'
import {Institution} from '../institution'
import {AddressService} from '../../shared/address.service'
import {AddressStatus} from '../../zsb-address/zsb-address.component'

@Component({
  selector: 'app-zsb-institutions-detail',
  templateUrl: './zsb-institutions-detail.component.html',
  styleUrls: ['./zsb-institutions-detail.component.css']
})
export class ZsbInstitutionsDetailComponent implements OnInit {

  private institutionId: string
  private institution: Institution

  addressUndefined: boolean


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public service: InstitutionsService,
    private notificationService: NotificationService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.service.initializeInstForm()
    this.route.paramMap.subscribe(params => {
      this.institutionId = params.get('institutionId')

      if (this.institutionId != null && this.editMode()) {
        this.service.dbService.getInstitutionAtomic(this.institutionId).subscribe(it => {
          this.institution = it as Institution
          this.service.loadFormData(this.institution)
          this.service.updateAddressInForm(this.institution.address)
          this.addressUndefined = false
        })
      } else {
        this.institution = {
          uuid: null,
          designation: null,
          email: null,
          address_id: null
        }
        this.addressUndefined = true
      }
    })
  }

  editMode() {
    return this.institutionId !== 'new'
  }

  onSubmit() {
    const institutionFromForm = this.service.getInstForm().value
    this.institution.email = institutionFromForm.email
    this.institution.designation = institutionFromForm.designation

    let observer
    if (institutionFromForm.uuid == null) {
      observer = this.service.dbService.createInstitution(this.institution)
    } else {
      observer = this.service.dbService.updateInstitution(this.institution)
    }

    observer.subscribe(result => {
      if (this.institutionId != null) {
        this.notifyUpdate(result.uuid !== undefined)
      } else {
        this.notifyInsert(result.uuid !== undefined)
      }
    })
  }

  changeAddress() {
    let addressId = null
    if (this.institution !== undefined) {
      addressId = this.institution.address_id
    }
    this.addressUndefined = addressId == null
    AddressService.openAddressDialog(this.dialog, addressId)
      .subscribe(addressResult => {
        if (addressResult === undefined) {
          this.notificationService.failure('Adresse konnte nicht aktualisiert werden.')
          return
        }

        if (addressResult.status === AddressStatus.CANCELLATION) return

        this.institution.address = addressResult.address
        this.institution.address_id = addressResult.address.address_id
        this.service.updateAddressInForm(this.institution.address)
        this.notificationService.success('Adresse aktualisiert.')
        this.addressUndefined = false
      })
  }

  onClear() {
    this.service.getInstForm().reset()
    this.ngOnInit()
    this.notificationService.success('Formular zurückgesetzt')
    this.addressUndefined = true
  }

  notifyInsert(success: boolean) {
    if (success) {
      this.notificationService.success('Institution erfolgreich erstellt.')
      this.router.navigate(['/institutions'])
    } else {
      this.notificationService.failure('Institution konnte nicht erstellt werden.')
    }
  }

  notifyUpdate(success: boolean) {
    if (success) {
      this.notificationService.success('Institution erfolgreich aktualisiert.')
      this.router.navigate(['/institutions'])
    } else {
      this.notificationService.failure('Institution konnte nicht aktualisiert werden.')
    }
  }

  getInstitutionId() {
    return this.institutionId
  }
}
