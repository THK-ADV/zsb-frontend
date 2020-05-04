import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Schule} from './schule';
import {DatabaseService} from '../shared/database.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-zsb-schule',
  templateUrl: './zsb-schule.component.html',
  styleUrls: ['./zsb-schule.component.css']
})
export class ZsbSchuleComponent implements OnInit {
  schulen: Observable<Schule[]>;

  constructor(private databaseService: DatabaseService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.schulen = this.databaseService.getSchulenAtomic();
  }

  filterList() {
  }

  addSchule() {
    // this.dialog.open(E)
  }

  editSchule(id: number) {
  }

  deleteSchule(id: number) {
  }
}
