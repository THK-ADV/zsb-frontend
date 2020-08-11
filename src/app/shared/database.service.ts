import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Schule} from '../zsb-schule/schule';
import {Adresse} from '../zsb-adresse/adresse';
import {catchError, retry} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Schulform} from '../zsb-schule/schulform';
import {Ort} from '../zsb-adresse/ort';
import {AnzahlSus} from '../zsb-schule/anzahl-sus';
import {Kontakt, KontaktFunktion} from '../zsb-kontakt/kontakt';

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

  updateOrCreateAdresse(adresse: Adresse) {
    return this.httpClient.put<Adresse>(this.DB_URL + '/adressen', adresse);
  }

  getOrte() {
    return this.httpClient.get<Ort[]>(this.DB_URL + '/orte')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateOrCreateOrt(ort: Ort) {
    return this.httpClient.put<Ort>(this.DB_URL + '/orte', ort);
  }

  createSchule(schule) {
    console.log('REQUEST: CREATE SCHULE');
    return this.httpClient.post<Schule>(this.DB_URL + '/schulen', schule);
  }

  updateSchule(schule) {
    console.log('REQUEST: UPDATE SCHULE');
    return this.httpClient.put<Schule>(this.DB_URL + '/schulen', schule);
  }

  deleteSchule(uuid: string) {
    console.log('REQUEST: DELETE SCHULE ->' + uuid);
    return this.httpClient.delete(this.DB_URL + '/schulen/' + uuid);
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

  getSchuleById(id: string) {
    return this.httpClient.get<Schule>(this.DB_URL + '/schulen/' + id);
  }

  getSchuleByIdAtomic(id: string) {
    return this.httpClient.get<Schule>(this.DB_URL + '/schulen/' + id + '?resolve_ids=true');
  }

  getSchulform() {
    return this.httpClient.get<Schulform[]>(this.DB_URL + '/schulen/schulformen');
  }

  getAnzahlSus() {
    return this.httpClient.get<AnzahlSus[]>(this.DB_URL + '/schulen/anzahl_sus');
  }

  getKontaktFunktionen() {
    return this.httpClient.get<KontaktFunktion[]>(this.DB_URL + '/kontakte/funktion');
  }

  getAdresseFromArrayByAdressId(adressen: Adresse[], id: string): Adresse {
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

  updateOrCreateKontakt(kontakt: Kontakt): Observable<Kontakt> {
    return this.httpClient.put<Kontakt>(this.DB_URL + '/kontakte', kontakt);
  }

  getKontaktById(uuid: string) {
    return this.httpClient.get<Kontakt>(this.DB_URL + '/kontakte/' + uuid);
  }

  getKontakte(): Observable<Kontakt[]> {
    return this.httpClient.get<Kontakt[]>(this.DB_URL + '/kontakte');
  }
}
