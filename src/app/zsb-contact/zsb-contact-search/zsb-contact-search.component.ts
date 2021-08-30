import {Component, OnInit} from '@angular/core'
import {combineContactName, Contact} from '../contact'
import {MatDialogRef} from '@angular/material/dialog'
import {NotificationService} from '../../shared/notification.service'
import {DatabaseService} from '../../shared/database.service'
import {ContactsService} from '../../shared/contacts.service'
import {Observable} from 'rxjs'
import {filterOptions} from '../../shared/functions'

@Component({
  selector: 'app-zsb-contact-search',
  templateUrl: './zsb-contact-search.component.html',
  styleUrls: ['./zsb-contact-search.component.css']
})
export class ZsbContactSearchComponent implements OnInit {

  currentContacts: Contact[]
  filteredContactNames: Observable<string[]>

  constructor(
    private dialogRef: MatDialogRef<ZsbContactSearchComponent>,
    private notificationService: NotificationService,
    private dbService: DatabaseService,
    public service: ContactsService) {
  }

  ngOnInit(): void {
    // init form
    this.service.initializeContactForm()
    this.service.contactForm.disable()

    // get all contacts from db
    this.dbService.getContacts().subscribe(contacts => {
      this.currentContacts = contacts
      this.updateSearchAutoComplete()
    })

    // disable/enable form depending on toggle
    this.service.searchForm.get('enableEdit').valueChanges.subscribe(newVal => {
      if (newVal) {
        this.service.clearSearch()
        this.service.contactForm.enable()
        this.service.searchForm.get('searchKey').disable()
        this.service.initializeContactForm()
      } else {
        this.service.contactForm.disable()
        this.service.searchForm.get('searchKey').enable()
      }
    })

    // update search
    this.service.searchForm.get('searchKey').valueChanges.subscribe(newSearchKey => {
      this.updateContactBySearchKey(newSearchKey)
    })
  }

  updateSearchAutoComplete() {
    const unorderedNames = this.currentContacts.map(it => combineContactName(it))
    this.filteredContactNames = filterOptions(
      this.service.searchForm.controls.searchKey,
      this.sortArrayAlphabetically(unorderedNames)
    )
  }

  onSubmit() {
    const isNewContact = this.service.searchForm.get('enableEdit').value as boolean
    const contact = this.service.getContact()
    if (isNewContact) {
      // create in db and close dialog
      this.dbService.updateOrCreateContact(contact).subscribe(createdContact => {
        this.onClose(createdContact)
      })
    } else {
      // close dialog and provide selected contact
      this.onClose(contact)
    }
  }

  onClose(result?: Contact) {
    this.dialogRef.close(result)
  }

  private updateContactBySearchKey(newSearchKey: string) {
    const contact = this.currentContacts.find(it => combineContactName(it) === newSearchKey)
    if (contact !== undefined) {
      this.service.populateContactForm(contact)
    } else {
      this.service.initializeContactForm()
    }
  }

  sortArrayAlphabetically(array: string[]): string[] {
    return array.sort((a, b) => {
      const textA = a.toUpperCase()
      const textB = b.toUpperCase()
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
  }
}