import {Component, OnInit} from '@angular/core'
import {Observable} from 'rxjs'
import {School} from '../zsb-school/school'
import {DatabaseService} from '../shared/database.service'
import {MatDialog} from '@angular/material/dialog'

@Component({
  selector: 'app-zsb-school',
  templateUrl: './zsb-overview.component.html',
  styleUrls: ['./zsb-overview.component.css']
})
export class ZsbOverviewComponent implements OnInit {
  schools: Observable<School[]>

  constructor(private databaseService: DatabaseService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.schools = this.databaseService.getSchoolsAtomic()
  }

  filterList() {
  }

  addSchule() {
    // this.dialog.open(E)
  }

  editSchool(id: number) {
  }

  deleteSchool(id: number) {
  }
}
