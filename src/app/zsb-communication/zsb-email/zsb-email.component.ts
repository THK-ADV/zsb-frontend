import {Component, Inject, OnDestroy} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {Email} from './email'
import {NotificationService} from '../../shared/notification.service'
import {Subscription} from 'rxjs'
import {DatabaseService} from '../../shared/database.service'

@Component({
  selector: 'app-zsb-email',
  templateUrl: './zsb-email.component.html',
  styleUrls: ['./zsb-email.component.css']
})
export class ZsbEmailComponent implements OnDestroy {

  public formGroup: FormGroup = new FormGroup({
    msg: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required)
  })
  private sub?: Subscription

  constructor(
    private dbService: DatabaseService,
    public dialogRef: MatDialogRef<ZsbEmailComponent>,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public emailAddresses: string[]
  ) {
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

  onSubmit() {
    const formValue = this.formGroup.value
    const email = new Email(formValue.msg, this.emailAddresses, formValue.subject)
    this.sub = this.dbService
      .createEmail(email)
      .subscribe(_ => {
          this.notificationService.success('Sendevorgang erfolgreich')
          this.dialogRef.close()
        },
        error => {
          this.notificationService.failure('Sendevorgang gescheitert. Fehler: ' + error)
          this.dialogRef.close()
        }
      )
  }

  onCancel() {
    this.dialogRef.close()
  }
}
