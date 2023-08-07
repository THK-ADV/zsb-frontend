import {Component, OnDestroy, OnInit} from '@angular/core'
import {combineContactName, Contact} from '../contact'
import {MatDialogRef} from '@angular/material/dialog'
import {NotificationService} from '../../shared/notification.service'
import {DatabaseService} from '../../shared/database.service'
import {ContactsService} from '../../shared/contacts.service'
import {Observable, Subscription} from 'rxjs'
import {filterOptions} from '../../shared/functions'

@Component({
  selector: 'app-zsb-contact-search',
  templateUrl: './zsb-contact-search.component.html',
  styleUrls: ['./zsb-contact-search.component.css']
})
export class ZsbContactSearchComponent implements OnInit, OnDestroy {

  currentContacts: Contact[]
  filteredContactNames: Observable<string[]>

  private subs: Subscription[] = []

  constructor(
    private dialogRef: MatDialogRef<ZsbContactSearchComponent, Contact>,
    private notificationService: NotificationService,
    private dbService: DatabaseService,
    public service: ContactsService
  ) {
  }

  ngOnInit(): void {
    // init form
    this.service.initializeContactForm()
    this.service.contactForm.disable()

    // get all contacts from db
    this.subs.push(
      this.dbService.getContacts().subscribe(contacts => {
        this.currentContacts = contacts
        this.updateSearchAutoComplete()
      })
    )

    // disable/enable form depending on toggle
    this.subs.push(
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
    )

    // update search
    this.subs.push(
      this.service.searchForm.get('searchKey').valueChanges.subscribe(newSearchKey => {
        this.updateContactBySearchKey(newSearchKey)
      })
    )
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe())
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
      this.subs.push(
        this.dbService.updateOrCreateContact(contact).subscribe(createdContact => {
          this.onClose(createdContact)
        })
      )
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

// redundant declaration in functions.ts
  sortArrayAlphabetically(array: string[]): string[] {
    return array.sort((a, b) => {
      const textA = a.toUpperCase()
      const textB = b.toUpperCase()
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
  }
}
