import {Component, OnInit} from '@angular/core'
import {DatabaseService} from '../../shared/database.service'
import {MatDialogRef} from '@angular/material/dialog'
import {Signature} from './signature'
import {Observable} from 'rxjs'
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms'
import {Letter} from './letter'
import {School} from '../../zsb-school/school'
import {saveBlobAsFile, generateTitle} from '../../shared/downloads'
import {DatePipe} from '@angular/common'

@Component({
  selector: 'app-zsb-letter',
  templateUrl: './zsb-letter.component.html',
  styleUrls: ['./zsb-letter.component.css']
})
export class ZsbLetterComponent implements OnInit {

  public addresseesIds: string[] = []
  private addressees: School[] = []
  public signatures: Observable<Signature[]>
  public formGroup: UntypedFormGroup = new UntypedFormGroup({
    msg: new UntypedFormControl('', Validators.required),
    signature_id: new UntypedFormControl(0)
  })

  constructor(private dbService: DatabaseService, public dialogRef: MatDialogRef<ZsbLetterComponent>, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.signatures = this.dbService.getSignatures()
    this.dbService.getSchoolsAtomic().subscribe(schools => {
      this.resolveAddresses(schools)
    })

    console.log('send stuff to schools with id:')
    console.log(this.addresseesIds)
  }

  resolveAddresses(schools: School[]) {
    schools.forEach(it => {
      if (this.addresseesIds.some(id => id === it.id)) {
        this.addressees.push(it)
      }
    })
  }

  onSubmit() {
    const formValue = this.formGroup.value
    const letter = new Letter(formValue.msg, this.addressees, formValue.signature_id)

    console.log('create letter')
    console.log(letter)

    this.dbService.createLetter(letter).subscribe(result => {
      saveBlobAsFile(result, generateTitle(this.addresseesIds, 'serienbrief', '.doc', this.datePipe))
    })

    this.dialogRef.close()
  }

  onCancel() {
    this.dialogRef.close()
  }
}
