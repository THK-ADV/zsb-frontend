import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Schule} from '../zsb-schule/schule'
import {Adresse} from '../zsb-adresse/adresse'
import {catchError, retry} from 'rxjs/operators'
import {Observable, throwError} from 'rxjs'
import {Schulform} from '../zsb-schule/schulform'
import {Ort} from '../zsb-adresse/ort'
import {AnzahlSus} from '../zsb-schule/anzahl-sus'
import {Kontakt, KontaktAnrede, KontaktFunktion} from '../zsb-kontakt/kontakt'
import {environment} from '../../environments/environment'
import {Veranstaltung} from '../zsb-veranstaltungen/veranstaltung'
import {Kategorie} from '../zsb-veranstaltungen/kategorie'
import {Stufe} from '../zsb-veranstaltungen/stufe'
import {Vortragsart} from '../zsb-veranstaltungen/vortragsart'
import {Institution} from '../zsb-institutionen/institution'
import {Veranstalter} from '../zsb-veranstaltungen/veranstalter'
import {Bericht} from '../zsb-veranstaltungen/zsb-bericht/bericht'
import {Kooperationspartner} from '../zsb-schule/kooperationspartner'

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly DB_URL: string

  constructor(
    private httpClient: HttpClient
  ) {
    this.DB_URL = environment.backend_url_prefix
  }

  public schulen: Schule[]

  getAdressen() {
    return this.httpClient.get<Adresse[]>(this.DB_URL + '/adressen')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getAdressenAtomic() {
    return this.httpClient.get<Adresse[]>(this.DB_URL + '/adressen?resolve_ids=true')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getAdresseAtomicById(uuid: string) {
    return this.httpClient.get<Adresse>(this.DB_URL + '/adressen/' + uuid + '?resolve_ids=true')
  }

  updateOrCreateAdresse(adresse: Adresse) {
    return this.httpClient.put<Adresse>(this.DB_URL + '/adressen', adresse)
  }

  getOrte() {
    return this.httpClient.get<Ort[]>(this.DB_URL + '/orte')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  updateOrCreateOrt(ort: Ort) {
    return this.httpClient.put<Ort>(this.DB_URL + '/orte', ort)
  }

  createSchule(schule) {
    console.log('REQUEST: CREATE SCHULE')
    return this.httpClient.post<Schule>(this.DB_URL + '/schulen', schule)
  }

  updateSchule(schule) {
    console.log('REQUEST: UPDATE SCHULE')
    return this.httpClient.put<Schule>(this.DB_URL + '/schulen', schule)
  }

  deleteSchule(uuid: string) {
    console.log('REQUEST: DELETE SCHULE ->' + uuid)
    return this.httpClient.delete(this.DB_URL + '/schulen/' + uuid)
  }

  getSchulenAtomic() {
    return this.httpClient.get<Schule[]>(this.DB_URL + '/schulen?resolve_ids=true')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getSchulen() {
    return this.httpClient.get<Schule[]>(this.DB_URL + '/schulen')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getSchuleByIdAtomic(id: string) {
    return this.httpClient.get<Schule>(this.DB_URL + '/schulen/' + id + '?resolve_ids=true')
  }

  getSchulform() {
    return this.httpClient.get<Schulform[]>(this.DB_URL + '/schulen/schulformen')
  }

  getAnzahlSus() {
    return this.httpClient.get<AnzahlSus[]>(this.DB_URL + '/schulen/anzahl_sus')
  }

  getKontaktFunktionen() {
    return this.httpClient.get<KontaktFunktion[]>(this.DB_URL + '/kontakte/funktion')
  }

  getAdresseFromArrayByAdressId(adressen: Adresse[], id: string): Adresse {
    let result = null
    adressen.forEach(it => {
      if (it.adress_id === id) {
        result = it
      }
    })
    return result
  }

  handleError(error) {
    let errorMessage: string
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    window.alert(errorMessage)
    return throwError(errorMessage)
  }

  updateOrCreateKontakt(kontakt: Kontakt): Observable<Kontakt> {
    return this.httpClient.put<Kontakt>(this.DB_URL + '/kontakte', kontakt)
  }

  getKontaktById(uuid: string) {
    return this.httpClient.get<Kontakt>(this.DB_URL + '/kontakte/' + uuid)
  }

  getKontakte(): Observable<Kontakt[]> {
    return this.httpClient.get<Kontakt[]>(this.DB_URL + '/kontakte')
  }

  getKontaktAnredeOptionen() {
    return this.httpClient.get<KontaktAnrede[]>(this.DB_URL + '/kontakte/anreden')
  }

  getAllVeranstaltungen(): Observable<Veranstaltung[]> {
    return this.httpClient.get<Veranstaltung[]>(this.DB_URL + '/veranstaltungen?resolve_ids=true')
  }

  getVeranstaltungById(uuid: string): Observable<Veranstaltung> {
    return this.httpClient.get<Veranstaltung>(this.DB_URL + '/veranstaltungen/' + uuid + '?resolve_ids=true')
  }

  deleteVeranstaltung(uuid: string): Observable<any> {
    return this.httpClient.delete(this.DB_URL + '/veranstaltungen/' + uuid)
  }

  getKategorien() {
    return this.httpClient.get<Kategorie[]>(this.DB_URL + '/veranstaltungen/kategorien')
  }

  getStufen() {
    return this.httpClient.get<Stufe[]>(this.DB_URL + '/veranstaltungen/stufen')
  }

  getVortragsarten() {
    return this.httpClient.get<Vortragsart[]>(this.DB_URL + '/veranstaltungen/vortragsarten')
  }

  getAllInstitutionen() {
    return this.httpClient.get<Institution[]>(this.DB_URL + '/institutionen?resolve_ids=true')
  }

  updateVeranstaltung(veranstaltung: Veranstaltung) {
    return this.httpClient.put<Veranstaltung>(this.DB_URL + '/veranstaltungen', veranstaltung)
  }

  createVeranstaltung(veranstaltung: Veranstaltung) {
    return this.httpClient.post<Veranstaltung>(this.DB_URL + '/veranstaltungen', veranstaltung)
  }

  createVeranstalter(veranstalter: Veranstalter) {
    return this.httpClient.post<Veranstalter>(this.DB_URL + '/veranstalter', veranstalter)
  }

  updateVeranstalter(veranstalter: Veranstalter) {
    return this.httpClient.put<Veranstalter>(this.DB_URL + '/veranstalter', veranstalter)
  }

  getAllBerichte() {
    return this.httpClient.get<Bericht[]>(this.DB_URL + '/berichte')
  }

  getBerichtById(uuid: string) {
    return this.httpClient.get<Bericht>(this.DB_URL + '/berichte/' + uuid)
  }

  createBericht(bericht: Bericht) {
    return this.httpClient.post<Bericht>(this.DB_URL + '/berichte', bericht)
  }

  updateBericht(bericht: Bericht) {
    return this.httpClient.put<Bericht>(this.DB_URL + '/berichte', bericht)
  }

  getKooperationspartner() {
    return this.httpClient.get<Kooperationspartner[]>(this.DB_URL + '/schulen/kooperationspartner')
  }

  deleteInstitution(uuid: string): Observable<any> {
    return this.httpClient.delete(this.DB_URL + '/institutionen/' + uuid)
  }

  getInstitutionAtomic(uuid: string) {
    return this.httpClient.get(this.DB_URL + '/institutionen/' + uuid + '?resolve_ids=true')
  }

  createInstitution(institution: Institution) {
    return this.httpClient.post<Institution>(this.DB_URL + '/institutionen', institution)
  }

  updateInstitution(institution: Institution) {
    return this.httpClient.put<Institution>(this.DB_URL + '/institutionen', institution)
  }
}
