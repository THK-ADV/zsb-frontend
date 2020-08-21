import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {Observable} from 'rxjs';
import {Veranstaltung} from '../zsb-veranstaltungen/veranstaltung';

@Injectable({
  providedIn: 'root'
})
export class VeranstaltungService {

  constructor(private dbService: DatabaseService) {
  }

  getVeranstaltungen(): Observable<Veranstaltung[]> {
    return this.dbService.getAllVeranstaltungen();
  }
}
