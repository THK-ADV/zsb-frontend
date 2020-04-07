import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../database.service';
import {Observable} from 'rxjs';
import {Ort} from './ort';

@Component({
  selector: 'app-zsb-orte',
  templateUrl: './zsb-orte.component.html',
  styleUrls: ['./zsb-orte.component.css']
})
export class ZsbOrteComponent implements OnInit {
  orte: Observable<Ort[]>;
  newOrt: Observable<Ort>;

  constructor(private databaseService: DatabaseService) {
  }

  ngOnInit(): void {
    this.orte = this.databaseService.getOrte();
  }

  createOrt() {
    this.newOrt = this.databaseService.createOrt();
  }
}
