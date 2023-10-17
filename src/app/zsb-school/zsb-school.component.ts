import {Component, OnInit} from '@angular/core'
import {Observable} from 'rxjs'
import {School} from './school'
import {DatabaseService} from '../shared/database.service'
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog'

@Component({
  selector: 'app-zsb-school',
  templateUrl: './zsb-school.component.html',
  styleUrls: ['./zsb-school.component.css']
})
export class ZsbSchoolComponent implements OnInit {
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
