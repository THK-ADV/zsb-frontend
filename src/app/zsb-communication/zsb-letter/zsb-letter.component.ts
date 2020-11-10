import {Component, OnInit} from '@angular/core'
import {DatabaseService} from '../../shared/database.service'
import {MatDialogRef} from '@angular/material/dialog'
import {Signature} from './signature'
import {Observable} from 'rxjs'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Letter} from './letter'
import {Schule} from '../../zsb-schule/schule'

@Component({
  selector: 'app-zsb-letter',
  templateUrl: './zsb-letter.component.html',
  styleUrls: ['./zsb-letter.component.css']
})
export class ZsbLetterComponent implements OnInit {

  public addresseesIds: string[] = []
  private addressees: Schule[] = []
  public signatures: Observable<Signature[]>
  public formGroup: FormGroup = new FormGroup({
    msg: new FormControl('', Validators.required),
    signature_id: new FormControl(0)
  })

  constructor(private dbService: DatabaseService, public dialogRef: MatDialogRef<ZsbLetterComponent>) {
  }

  ngOnInit(): void {
    this.signatures = this.dbService.getSignatures()
    this.dbService.getSchulenAtomic().subscribe(schulen => {
      this.resolveAddresses(schulen)
    })

    console.log('send stuff to schulen with id:')
    console.log(this.addresseesIds)
  }

  resolveAddresses(schulen: Schule[]) {
    schulen.forEach(it => {
      if (this.addresseesIds.some(id => id === it.schule_id)) {
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
    link.download = 'Brief.doc'
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))

    setTimeout(_ => {
      window.URL.revokeObjectURL(data)
      link.remove()
    }, 100)
  }

  onCancel() {
    this.dialogRef.close()
  }
}
