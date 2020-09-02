import {Component, OnInit} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Bericht} from './bericht'
import {DatabaseService} from '../../shared/database.service'
import {Observable} from 'rxjs'
import {NotificationService} from '../../shared/notification.service'
import {MatDialogRef} from '@angular/material/dialog'

@Component({
  selector: 'app-zsb-bericht',
  templateUrl: './zsb-bericht.component.html',
  styleUrls: ['./zsb-bericht.component.css']
})
export class ZsbBerichtComponent implements OnInit {

  constructor(
    private dbService: DatabaseService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<ZsbBerichtComponent>) {
  }

  bericht: Bericht
  berichtId: string
  veranstaltungId: string

  berichtForm: FormGroup = new FormGroup({
    uuid: new FormControl(null),
    veranstaltung_id: new FormControl(null),
    titel: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    this.clearFormGroup()

    if (this.berichtId !== null && this.berichtId !== undefined) {
      this.dbService.getBerichtById(this.berichtId).subscribe(it => {
        this.loadBericht(it)
      })
    }
  }

  onSubmit() {
    console.log('submit')
    const updatedBericht = this.berichtForm.value as Bericht
    updatedBericht.veranstaltung_id = this.veranstaltungId

    let result: Observable<Bericht>
    if (updatedBericht.uuid === null || updatedBericht.uuid === undefined) {
      result = this.dbService.createBericht(updatedBericht)
    } else {
      result = this.dbService.updateBericht(updatedBericht)
    }

    result.subscribe(it => {
      if (it.uuid !== null && it.uuid !== undefined) {
        this.notificationService.success('yay')
        this.onClose(it)
      } else {
        this.notificationService.failure('nay')
      }
    })
  }

  onClose(result?: Bericht) {
    console.log('terminate')
    this.ngOnInit()
    this.dialogRef.close(result)
  }

  clearFormGroup() {
    this.berichtForm.setValue({
      uuid: null,
      veranstaltung_id: null,
      titel: '',
      text: ''
    })
  }

  loadBericht(bericht: Bericht) {
    this.berichtForm.setValue({
      uuid: bericht.uuid,
      veranstaltung_id: bericht.veranstaltung_id,
      titel: bericht.titel,
      text: bericht.text
    })
  }
}
