import {Component, OnInit} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Report} from './report'
import {DatabaseService} from '../../shared/database.service'
import {Observable} from 'rxjs'
import {NotificationService} from '../../shared/notification.service'
import {MatDialogRef} from '@angular/material/dialog'

@Component({
  selector: 'app-zsb-report',
  templateUrl: './zsb-report.component.html',
  styleUrls: ['./zsb-report.component.css']
})
export class ZsbReportComponent implements OnInit {

  constructor(
    private dbService: DatabaseService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<ZsbReportComponent>) {
  }

  report: Report
  reportId: string
  eventId: string

  reportForm: FormGroup = new FormGroup({
    uuid: new FormControl(null),
    event_id: new FormControl(null),
    title: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    this.clearFormGroup()

    if (this.reportId !== null && this.reportId !== undefined) {
      this.dbService.getReportById(this.reportId).subscribe(it => {
        this.loadReport(it)
      })
    }
  }

  onSubmit() {
    console.log('submit')
    const updatedReport = this.reportForm.value as Report
    updatedReport.event_id = this.eventId

    let result: Observable<Report>
    if (updatedReport.uuid === null || updatedReport.uuid === undefined) {
      result = this.dbService.createReport(updatedReport)
    } else {
      result = this.dbService.updateReport(updatedReport)
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

  onClose(result?: Report) {
    console.log('terminate')
    this.ngOnInit()
    this.dialogRef.close(result)
  }

  clearFormGroup() {
    this.reportForm.setValue({
      uuid: null,
      event_id: null,
      title: '',
      text: ''
    })
  }

  loadReport(report: Report) {
    this.reportForm.setValue({
      uuid: report.uuid,
      event_id: report.event_id,
      title: report.title,
      text: report.text
    })
  }
}
