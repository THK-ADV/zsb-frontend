import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core'
import {FormControl, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms'
import {DatabaseService} from '../../shared/database.service'
import {MatDialogRef} from '@angular/material/dialog'
import {DatePipe} from '@angular/common'
import {School} from '../../zsb-school/school'
import {Email} from './email'
import {NotificationService} from '../../shared/notification.service'
import {Observable} from 'rxjs'
import {map, startWith} from 'rxjs/operators'
import {MatChipInputEvent} from '@angular/material/chips'
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'

@Component({
  selector: 'app-zsb-email',
  templateUrl: './zsb-email.component.html',
  styleUrls: ['./zsb-email.component.css']
})
export class ZsbEmailComponent implements OnInit {
  recipientCtrl = new FormControl()
  filteredRecipients: Observable<string[]>
  availableRecipients: string[] = [
    'Standard',
    'Schulleitung',
    'Sekretariat',
    'Lehrer*in'
  ]
  recipients: string[] = []

  @ViewChild('recipientInput') fruitInput: ElementRef<HTMLInputElement>

  constructor(
    private dbService: DatabaseService,
    public dialogRef: MatDialogRef<ZsbEmailComponent>,
    private notificationService: NotificationService,
    private datePipe: DatePipe) {
    this.filteredRecipients = this.recipientCtrl.valueChanges.pipe(
      startWith(null),
      map((recipient: string | null) => (recipient ? this._filter(recipient) : this.availableRecipients.slice()))
    )
  }

  public addresseesIds: string[] = []
  private addressees: string[] = []
  public formGroup: UntypedFormGroup = new UntypedFormGroup({
    msg: new UntypedFormControl('', Validators.required),
    subject: new UntypedFormControl('', Validators.required)
  })

  add(recipient: MatChipInputEvent): void {
    const value = (recipient.value || '').trim()
    if (value) {
      this.recipients.push(value)
    }
    recipient.chipInput.clear()
    this.recipientCtrl.setValue(null)
  }

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
    this.dbService.getSchoolsAtomic().subscribe(schools => {
      this.resolveMails(schools)
    })
    console.log('send stuff to schools with mail adresses:')
    console.log(this.addresseesIds)
  }

  resolveMails(schools: School[]) {
    schools.forEach(it => {
      if (this.addresseesIds.some(id => id === it.id)) {
        // TODO: checken an wen die mails gehen
        this.addressees.push(it.email)
        it.contacts.forEach(c => this.addressees.push(c.email))
      }
    })
  }

  onSubmit() {
    const formValue = this.formGroup.value
    const email = new Email(formValue.msg, this.addressees, formValue.subject)

    console.log('create email')
    console.log(email)

    this.dbService.createEmail(email).subscribe(result => {
      this.notificationService.success('Sendevorgang erfolgreich')
    })

    this.dialogRef.close()
  }

  onCancel() {
    this.dialogRef.close()
  }

}
