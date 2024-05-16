import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core'
import {FormControl, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms'
import {DatabaseService} from '../../shared/database.service'
import {MatDialogRef} from '@angular/material/dialog'
import {Email} from './email'
import {NotificationService} from '../../shared/notification.service'
import {forkJoin, Observable} from 'rxjs'
import {map, startWith} from 'rxjs/operators'
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'
import {School} from '../../zsb-school/school'

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

  @ViewChild('recipientInput') fruitInput: ElementRef<HTMLInputElement>

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
  private schools: School[]
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
    this.fruitInput.nativeElement.value = ''
    this.recipientCtrl.setValue(null)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase()
    return this.availableRecipients.filter(recipient => recipient.toLowerCase().includes(filterValue))
  }

  ngOnInit(): void {
    // TODO
    // funktionen direkt anzeigen
    // anzeigen, an welche Schulen nicht versendet werden konnte
    const observables = this.addresseesIds.map(id => this.dbService.getSchoolById(id))
    forkJoin(observables).subscribe(
      schools => {
        this.schools = schools
        console.log('Schulen:', this.schools)
        this.dbService.createMailAddressees(schools).subscribe(
          functions => {
            this.availableRecipients = functions
            console.log('Schulen mit Mail-Adressen:', this.availableRecipients)
          },
          error => {
            console.error('Fehler beim Abrufen verfügbarer Funktionen:', error)
          }
        )
      },
      error => {
        console.error('Fehler beim Abrufen von Schulen:', error)
      }
    )
  }

  onSubmit() {
    const formValue = this.formGroup.value
    const email = new Email(formValue.msg, this.recipients, this.schools, formValue.subject)

    console.log('create email')
    console.log(email)

    this.dbService.createEmail(email).subscribe(result => {
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

  private _filter(recipient: string) {
    return []
  }
}
