import {Component, OnInit} from '@angular/core'
import {DatabaseService} from '../../shared/database.service'
import {MatDialogRef} from '@angular/material/dialog'
import {Signature} from './signature'
import {Observable} from 'rxjs'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Letter} from './letter'
import {School} from '../../zsb-school/school'
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
  public formGroup: FormGroup = new FormGroup({
    msg: new FormControl('', Validators.required),
    signature_id: new FormControl(0)
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
      if (this.addresseesIds.some(id => id === it.school_id)) {
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
      this.saveBlobAsMsWordDoc(result)
    })

    this.dialogRef.close()
  }

  // further details on https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api
  saveBlobAsMsWordDoc(blob: Blob) {
    const newBlob = new Blob([blob], { type: 'application/msword' })

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob)
      return
    }

    const data = window.URL.createObjectURL(newBlob)

    const link = document.createElement('a')
    link.href = data
    link.download = this.generateDocumentTitle(this.addressees)
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))

    setTimeout(_ => {
      window.URL.revokeObjectURL(data)
      link.remove()
    }, 100)
  }

  generateDocumentTitle(addressees: School[]): string {
    const currentDate = new Date()
    const currentDateString = this.datePipe.transform(currentDate, 'yyyy-MM-dd')

    if (addressees.length === 0) return ''
    if (addressees.length > 1) {
      return 'Serienbrief-' + addressees.length + '_' + currentDateString + '.doc'
    }

    const schoolName = addressees.pop().name
    return schoolName + '_' + currentDateString + '.doc'
  }

  onCancel() {
    this.dialogRef.close()
  }
}
