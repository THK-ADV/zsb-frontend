import {Component, Inject, OnInit} from '@angular/core'
import {DatabaseService} from '../../shared/database.service'
import {Contact} from '../contact'
import {ContactsService} from '../../shared/contacts.service'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {NotificationService} from '../../shared/notification.service'

@Component({
  selector: 'app-zsb-contact',
  templateUrl: './zsb-contact-detail.component.html',
  styleUrls: ['./zsb-contact-detail.component.css']
})
export class ZsbContactDetailComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ZsbContactDetailComponent, Contact>,
    @Inject(MAT_DIALOG_DATA) public data: Contact,
    private notificationService: NotificationService,
    private dbService: DatabaseService,
    public service: ContactsService) {
  }

  contact?: Contact = this.data

  ngOnInit(): void {
    this.service.contactForm.enable()

    // initialize form
    this.service.initializeContactForm()

    if (this.contact) {
      this.service.populateContactForm(this.contact)
    }
  }

  onSubmit() {
    // get possible modified contact from form
    const editedContact = this.service.getContact()
    // check if anything changed
    if (this.contact.contact_id === editedContact.contact_id
      && this.contact.surname === editedContact.surname
      && this.contact.firstname === editedContact.firstname
      && this.contact.email === editedContact.email
      && this.contact.feature === editedContact.feature
      && this.contact.salutation === editedContact.salutation) {
      // nothing has changed.
      this.onClose()
      return
    }

    // save edited contact to db
    this.dbService.updateOrCreateContact(editedContact).subscribe(it => {
      // show success dialog and close detail view
      this.notificationService.success('Kontakt wurde erfolgreich aktualisiert.')
      this.onClose(it)
    }, error => {
      // show failure dialog and remain in dialog
      console.log(error)
      this.notificationService.failure('Kontakt konnte nicht gesichert werden. Bitte versuchen Sie es später nochmal.')
    })
  }

  onClose(result?: Contact) {
    this.dialogRef.close(result)
  }
}
