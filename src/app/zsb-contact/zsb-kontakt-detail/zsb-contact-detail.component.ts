import {Component, OnInit} from '@angular/core'
import {DatabaseService} from '../../shared/database.service'
import {Contact} from '../contact'
import {ContactsService} from '../../shared/contacts.service'
import {MatDialogRef} from '@angular/material/dialog'
import {NotificationService} from '../../shared/notification.service'

@Component({
  selector: 'app-zsb-contact',
  templateUrl: './zsb-contact-detail.component.html',
  styleUrls: ['./zsb-contact-detail.component.css']
})
export class ZsbContactDetailComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ZsbContactDetailComponent>,
    private notificationService: NotificationService,
    private dbService: DatabaseService,
    public service: ContactsService) {
  }

  uuid: string = undefined
  contact: Contact = undefined

  ngOnInit(): void {
    this.service.contactForm.enable()

    // initialize form
    this.service.initializeContactForm()

    // load existing contact, if available
    if (this.uuid !== undefined) {
      console.log('load contact: ' + this.uuid)
      this.dbService.getContactById(this.uuid).subscribe(it => {
        this.service.populateContactForm(it)
        this.contact = it
      })
    }
  }

  onSubmit() {
    // get possible modified contact from form
    const editedContact = this.service.getContact()

    // check if anything changed
    if (this.contact.uuid === editedContact.uuid
      && this.contact.surname === editedContact.surname
      && this.contact.firstname === editedContact.firstname
      && this.contact.email === editedContact.email
      && this.contact.function === editedContact.function
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
      this.notificationService.failure('Kontakt konnte nicht gesichert werden. Bitte versuchen sie es später nochmal.')
    })
  }

  onClose(result?: Contact) {
    this.dialogRef.close(result)
  }
}
