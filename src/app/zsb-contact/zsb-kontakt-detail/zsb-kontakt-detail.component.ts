import {Component, OnInit} from '@angular/core'
import {DatabaseService} from '../../shared/database.service'
import {Contact} from '../contact'
import {ContactsService} from '../../shared/contacts.service'
import {MatDialogRef} from '@angular/material/dialog'
import {NotificationService} from '../../shared/notification.service'

@Component({
  selector: 'app-zsb-kontakt',
  templateUrl: './zsb-kontakt-detail.component.html',
  styleUrls: ['./zsb-kontakt-detail.component.css']
})
export class ZsbKontaktDetailComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ZsbKontaktDetailComponent>,
    private notificationService: NotificationService,
    private dbService: DatabaseService,
    public service: ContactsService) {
  }

  uuid: string = undefined
  kontakt: Contact = undefined

  ngOnInit(): void {
    this.service.contactForm.enable()

    // initialize form
    this.service.initializeContactForm()

    // load existing kontakt, if available
    if (this.uuid !== undefined) {
      console.log('load kontakt: ' + this.uuid)
      this.dbService.getContactById(this.uuid).subscribe(it => {
        this.service.populateContactForm(it)
        this.kontakt = it
      })
    }
  }

  onSubmit() {
    // get possible modified kontakt from form
    const editedKontakt = this.service.getContact()

    // check if anything changed
    if (this.kontakt.uuid === editedKontakt.uuid
      && this.kontakt.surname === editedKontakt.surname
      && this.kontakt.firstname === editedKontakt.firstname
      && this.kontakt.email === editedKontakt.email
      && this.kontakt.function === editedKontakt.function
      && this.kontakt.salutation === editedKontakt.salutation) {
      // nothing has changed.
      this.onClose()
      return
    }

    // save edited kontakt to db
    this.dbService.updateOrCreateContact(editedKontakt).subscribe(it => {
      // show success dialog and close detail view
      this.notificationService.success('Kontakt wurde erfolgreich aktualisiert.')
      this.onClose(it)
    }, error => {
      // show failure dialog and remain in dialog
      console.log(error)
      this.notificationService.failure('Kontakt konnte nicht gesichert werden. Bitte versuchen sie es später nochmal.')
    })
  }

  onClose(result?: Contact) {
    this.dialogRef.close(result)
  }
}
