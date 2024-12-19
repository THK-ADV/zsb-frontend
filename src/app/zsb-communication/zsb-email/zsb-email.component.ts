import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core'
import {FormControl, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms'
import {DatabaseService} from '../../shared/database.service'
import {MatDialogRef} from '@angular/material/dialog'
import {NotificationService} from '../../shared/notification.service'
import {Observable} from 'rxjs'
import {map, startWith} from 'rxjs/operators'
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'

@Component({
  selector: 'app-zsb-email',
  templateUrl: './zsb-email.component.html',
  styleUrls: ['./zsb-email.component.css']
})
export class ZsbEmailComponent implements OnInit {
  recipientCtrl = new FormControl()
  filteredRecipients: Observable<string[]>
  availableRecipients: string[] = []
  recipients: string[] = []
  fileName = 'Datei auswählen'
  files: File[] = []

  @ViewChild('recipientInput') recipientInput: ElementRef<HTMLInputElement>

  constructor(
    private dbService: DatabaseService,
    public dialogRef: MatDialogRef<ZsbEmailComponent>,
    private notificationService: NotificationService) {
    this.filteredRecipients = this.recipientCtrl.valueChanges.pipe(
      startWith(null),
      map((recipient: string | null) => (recipient ? this._filter(recipient) : this.availableRecipients.slice()))
    )
  }

  public addresseesIds: string[] = []
  public formGroup: UntypedFormGroup = new UntypedFormGroup({
    msg: new UntypedFormControl('', Validators.required),
    subject: new UntypedFormControl('', Validators.required)
  })

  remove(recipient: string): void {
    const index = this.recipients.indexOf(recipient)
    if (index >= 0) {
      this.recipients.splice(index, 1)
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.recipients.push(event.option.viewValue)
    this.recipientInput.nativeElement.value = ''
    this.recipientCtrl.setValue(null)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase()
    return this.availableRecipients.filter(recipient => recipient.toLowerCase().includes(filterValue))
  }

  ngOnInit(): void {
    this.dbService.createMailAddressees(this.addresseesIds).subscribe(
      functions => {
        this.availableRecipients = functions
      },
      error => {
        console.error('Fehler beim Abrufen verfügbarer Funktionen:', error)
      }
    )
  }

  selectFile(event: any): void {
    const files = event.target.files
    if (files.length) {
      this.files = files
      this.fileName = Array.from(files).map((file: File) => file.name).join(', ')
    }
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.notificationService.failure('Bitte alle Felder ausfüllen.')
      return
    }

    const formData = new FormData()
    const formValue = this.formGroup.value

    formData.append('subject', formValue.subject)
    formData.append('msg', formValue.msg)
    formData.append('addressees', JSON.stringify(this.recipients))
    formData.append('schoolIds', JSON.stringify(this.addresseesIds))
    if (this.files.length) {
      [...this.files].forEach((file: File) => {
        formData.append('file', file, file.name)
      })
    }
    this.dbService.createEmail(formData).subscribe(result => {
      if (result && result.length > 0) {
        let unsendableSchoolsNames = 'Konnte an folgende Schulen nicht versendet werden:\n'
        result.forEach(schule => {
          unsendableSchoolsNames += schule.name + '\n'
        })
        this.notificationService.failure(unsendableSchoolsNames)
      } else {
        this.notificationService.success('Sendevorgang erfolgreich')
      }
    })

    this.dialogRef.close()
  }

  onCancel() {
    this.dialogRef.close()
  }
}
