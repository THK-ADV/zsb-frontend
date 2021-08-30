import {Component, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
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


  constructor(
    private route: ActivatedRoute,
    public service: InstitutionsService,
    private notificationService: NotificationService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.institutionId = params.get('institutionId')

      if (this.institutionId != null && this.institutionId !== 'new') {
        this.service.dbService.getInstitutionAtomic(this.institutionId).subscribe(it => {
          this.institution = it as Institution
          this.service.loadFormData(this.institution)
          this.service.updateAddressInForm(this.institution.address)
        })
      } else {
        this.institution = {
          uuid: null,
          designation: null,
          email: null,
          address_id: null
        }
      }
    })
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
    if (this.institution !== undefined) addressId = this.institution.address_id
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
      })
  }

  onClear() {
    this.service.getInstForm().reset()
    this.service.initializeInstForm()
    this.ngOnInit()
    this.notificationService.success('Formular zurückgesetzt')
  }

  notifyInsert(success: boolean) {
    if (success) {
      this.notificationService.success('Institution erfolgreich erstellt.')
    } else {
      this.notificationService.failure('Institution konnte nicht erstellt werden.')
    }
  }

  notifyUpdate(success: boolean) {
    if (success) {
      this.notificationService.success('Institution erfolgreich aktualisiert.')
    } else {
      this.notificationService.failure('Institution konnte nicht aktualisiert werden.')
    }
  }

  getInstitutionId() {
    return this.institutionId
  }
}
