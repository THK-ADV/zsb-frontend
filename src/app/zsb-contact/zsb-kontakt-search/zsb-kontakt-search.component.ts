import {Component, OnInit} from '@angular/core'
import {combineContactName, Contact} from '../contact'
import {MatDialogRef} from '@angular/material/dialog'
import {NotificationService} from '../../shared/notification.service'
import {DatabaseService} from '../../shared/database.service'
import {ContactsService} from '../../shared/contacts.service'
import {Observable} from 'rxjs'
import {filterOptions} from '../../shared/functions'

@Component({
  selector: 'app-zsb-kontakt-search',
  templateUrl: './zsb-kontakt-search.component.html',
  styleUrls: ['./zsb-kontakt-search.component.css']
})
export class ZsbKontaktSearchComponent implements OnInit {

  currentKontakte: Contact[]
  filteredKontakteNames: Observable<string[]>

  constructor(
    private dialogRef: MatDialogRef<ZsbKontaktSearchComponent>,
    private notificationService: NotificationService,
    private dbService: DatabaseService,
    public service: ContactsService) {
  }

  ngOnInit(): void {
    // init form
    this.service.initializeContactForm()
    this.service.contactForm.disable()

    // get all kontakte from db
    this.dbService.getContacts().subscribe(kontakte => {
      this.currentKontakte = kontakte
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
      this.updateKontaktBySearchKey(newSearchKey)
    })
  }

  updateSearchAutoComplete() {
    const unorderedNames = this.currentKontakte.map(it => combineContactName(it))
    this.filteredKontakteNames = filterOptions(
      this.service.searchForm.controls.searchKey,
      this.sortArrayAlphabetically(unorderedNames)
    )
  }

  onSubmit() {
    const isNewKontakt = this.service.searchForm.get('enableEdit').value as boolean
    const kontakt = this.service.getContact()
    if (isNewKontakt) {
      // create in db and close dialog
      this.dbService.updateOrCreateContact(kontakt).subscribe(createdKontakt => {
        this.onClose(createdKontakt)
      })
    } else {
      // close dialog and provide selected kontakt
      this.onClose(kontakt)
    }
  }

  onClose(result?: Contact) {
    this.dialogRef.close(result)
  }

  private updateKontaktBySearchKey(newSearchKey: string) {
    const kontakt = this.currentKontakte.find(it => combineContactName(it) === newSearchKey)
    if (kontakt !== undefined) {
      this.service.populateContactForm(kontakt)
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
