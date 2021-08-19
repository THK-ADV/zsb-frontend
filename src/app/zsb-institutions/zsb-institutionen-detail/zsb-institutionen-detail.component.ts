import {Component, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {InstitutionenService} from '../institutionen.service'
import {NotificationService} from '../../shared/notification.service'
import {MatDialog} from '@angular/material/dialog'
import {Institution} from '../institution'
import {AddressService} from '../../shared/address.service'
import {AdresseStatus} from '../../zsb-address/zsb-address.component'


@Component({
  selector: 'app-zsb-institutionen-detail',
  templateUrl: './zsb-institutionen-detail.component.html',
  styleUrls: ['./zsb-institutionen-detail.component.css']
})
export class ZsbInstitutionenDetailComponent implements OnInit {

  private institutionId: string
  private institution: Institution


  constructor(
    private route: ActivatedRoute,
    public service: InstitutionenService,
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
          this.service.updateAdresseInForm(this.institution.address)
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
    this.institution.bezeichnung = institutionFromForm.bezeichnung

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

  changeAdresse() {
    let adresseId = null
    if (this.institution !== undefined) adresseId = this.institution.adress_id
    AddressService.openAddressDialog(this.dialog, adresseId)
      .subscribe(adresseResult => {
        if (adresseResult === undefined) {
          this.notificationService.failure('Adresse konnte nicht aktualisiert werden.')
          return
        }

        if (adresseResult.status === AdresseStatus.CANCELLATION) return

        this.institution.adresse = adresseResult.address
        this.institution.adress_id = adresseResult.address.address_id
        this.service.updateAdresseInForm(this.institution.address)
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
