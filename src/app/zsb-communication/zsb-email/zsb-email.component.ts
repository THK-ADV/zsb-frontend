import {Component, OnInit} from '@angular/core'
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms'
import {DatabaseService} from '../../shared/database.service'
import {MatDialogRef} from '@angular/material/dialog'
import {DatePipe} from '@angular/common'
import {School} from '../../zsb-school/school'
import {Letter} from '../zsb-letter/letter'
import {generateTitle, saveBlobAsFile} from '../../shared/downloads'
import {Email} from './email'
import {NotificationService} from '../../shared/notification.service'

@Component({
  selector: 'app-zsb-email',
  templateUrl: './zsb-email.component.html',
  styleUrls: ['./zsb-email.component.css']
})
export class ZsbEmailComponent implements OnInit {

  public addresseesIds: string[] = []
  private addressees: string[] = []
  public formGroup: UntypedFormGroup = new UntypedFormGroup({
    msg: new UntypedFormControl('', Validators.required),
    subject: new UntypedFormControl('', Validators.required)
  })

  constructor(
    private dbService: DatabaseService,
    public dialogRef: MatDialogRef<ZsbEmailComponent>,
    private notificationService: NotificationService,
    private datePipe: DatePipe) {
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
      if (this.addresseesIds.some(
        id => id === it.id)) {
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
