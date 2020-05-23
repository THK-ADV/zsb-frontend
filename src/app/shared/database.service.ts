import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Ort} from '../zsb-orte/ort';
import {Schule} from '../zsb-schule/schule';
import {Adresse} from '../zsb-orte/adresse';
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Schulform} from '../zsb-schule/schulform';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  readonly DB_PORT = 8080;
  readonly DB_URL = 'http://localhost:' + this.DB_PORT;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public schulen: Schule[];

  getAdressen() {
    return this.httpClient.get<Adresse[]>(this.DB_URL + '/adressen')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAdressenAtomic() {
    return this.httpClient.get<Adresse[]>(this.DB_URL + '/adressen?resolve_ids=true')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getOrte() {
    return this.httpClient.get<Ort[]>(this.DB_URL + '/orte')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createOrt() {
    // TODO read from form
    const data: Ort = {
      ort_id: null,
      plz: 10115,
      bezeichnung: 'Berlin'
    };

    console.log('REQUEST: CREATE ORT');
    return this.httpClient.post<Ort>(this.DB_URL + '/orte', data);
  }

  createSchule(schule: Schule) {
    console.log('REQUEST: CREATE SCHULE');
    return this.httpClient.post<Schule>(this.DB_URL + '/schulen', schule);
  }

  updateSchule(schule: Schule) {
    console.log('REQUEST: UPDATE SCHULE');
    return this.httpClient.put<Schule>(this.DB_URL + '/schulen', schule);
  }

  getSchulenAtomic() {
    return this.httpClient.get<Schule[]>(this.DB_URL + '/schulen?resolve_ids=true')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getSchulen() {
    return this.httpClient.get<Schule[]>(this.DB_URL + '/schulen')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getSchuleById(id: number) {
    return this.httpClient.get<Schule>(this.DB_URL + '/schulen/' + id);
  }

  getSchuleByIdAtomic(id: number) {
    return this.httpClient.get<Schule>(this.DB_URL + '/schulen/' + id + '?resolve_ids=true');
  }

  getSchulform() {
    return this.httpClient.get<Schulform[]>(this.DB_URL + '/schulen/schulformen');
  }

  getAdresseFromArrayByAdressId(adressen: Adresse[], id: number): Adresse {
    let result = null;
    adressen.forEach(it => {
      if (it.adress_id === id) {
        result = it;
      }
    });
    return result;
  }

  handleError(error) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
