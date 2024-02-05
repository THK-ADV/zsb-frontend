import {Component, Inject} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {SchoolNameFilter} from './filter'
import {SchoolWithEvents} from '../zsb-overview-list.component'

@Component({
  selector: 'app-zsb-filter',
  templateUrl: './zsb-filter.component.html',
  styleUrls: ['./zsb-filter.component.css']
})
export class ZsbFilterComponent {
  schoolNameChecked = false
  schoolName = ''
  schoolWithEvents: SchoolWithEvents[]

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ZsbFilterComponent>) {
    this.schoolWithEvents = data.schoolWithEvents
    console.log(this.schoolWithEvents)
  }

  onInputChange() {
    if (this.schoolName.trim() !== '') {
      this.schoolNameChecked = true
    }
  }

  onSubmit() {
    const schoolNameFilter = new SchoolNameFilter()
    const result = schoolNameFilter.filter(this.schoolWithEvents, this.schoolName)
    console.log(result)
    this.dialogRef.close(result)
  }

  onCancel() {
    this.dialogRef.close()
  }
}
