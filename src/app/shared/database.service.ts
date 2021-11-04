import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {School} from '../zsb-school/school'
import {Address} from '../zsb-address/address'
import {catchError, retry} from 'rxjs/operators'
import {Observable, throwError} from 'rxjs'
import {SchoolType} from '../zsb-school/schoolType'
import {City} from '../zsb-address/city'
import {AmountStudents} from '../zsb-school/amount-students'
import {Contact, ContactFunction, ContactSalutation} from '../zsb-contact/contact'
import {environment} from '../../environments/environment'
import {Event} from '../zsb-events/event'
import {Category} from '../zsb-events/category'
import {Level} from '../zsb-events/level'
import {PresentationType} from '../zsb-events/presentationType'
import {Institution} from '../zsb-institutions/institution'
import {Host} from '../zsb-events/host'
import {Report} from '../zsb-events/zsb-report/report'
import {CooperationPartner} from '../zsb-school/cooperationPartner'
import {Signature} from '../zsb-communication/zsb-letter/signature'
import {Letter} from '../zsb-communication/zsb-letter/letter'

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly DB_URL: string
  private readonly ATOMIC: string = '?resolve_ids=true'

  constructor(
    private httpClient: HttpClient
  ) {
    this.DB_URL = environment.backend_url_prefix
  }

  public schools: School[]

  getAddresses() {
    return this.httpClient.get<Address[]>(this.DB_URL + '/addresses')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getAddressesAtomic() {
    return this.httpClient.get<Address[]>(this.DB_URL + '/addresses?resolve_ids=true')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getAddressAtomicById(uuid: string) {
    return this.httpClient.get<Address>(this.DB_URL + '/addresses/' + uuid + '?resolve_ids=true')
  }

  updateOrCreateAddress(address: Address) {
    return this.httpClient.put<Address>(this.DB_URL + '/addresses', address)
  }

  getCities() {
    return this.httpClient.get<City[]>(this.DB_URL + '/cities')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  updateOrCreateCity(city: City) {
    return this.httpClient.put<City>(this.DB_URL + '/cities', city)
  }

  createSchool(school) {
    console.log('REQUEST: CREATE SCHULE')
    return this.httpClient.post<School>(this.DB_URL + '/schools', school)
  }

  updateSchool(school) {
    console.log('REQUEST: UPDATE SCHULE')
    return this.httpClient.put<School>(this.DB_URL + '/schools', school)
  }

  deleteSchool(uuid: string) {
    console.log('REQUEST: DELETE SCHULE ->' + uuid)
    return this.httpClient.delete(this.DB_URL + '/schools/' + uuid)
  }

  getSchoolsAtomic() {
    return this.httpClient.get<School[]>(this.DB_URL + '/schools?resolve_ids=true')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getSchools() {
    return this.httpClient.get<School[]>(this.DB_URL + '/schools')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getSchoolByIdAtomic(id: string) {
    return this.httpClient.get<School>(this.DB_URL + '/schools/' + id + '?resolve_ids=true')
  }

  getSchoolType() {
    return this.httpClient.get<SchoolType[]>(this.DB_URL + '/schools/schooltypes')
  }

  getAmountStudents() {
    return this.httpClient.get<AmountStudents[]>(this.DB_URL + '/schools/amountstudents')
  }

  getContactFunctions() {
    return this.httpClient.get<ContactFunction[]>(this.DB_URL + '/contacts/feature')
  }

  getAddressFromArrayByAddressId(addresses: Address[], id: string): Address {
    let result = null
    addresses.forEach(it => {
      if (it.address_id === id) {
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

  updateOrCreateContact(contact: Contact): Observable<Contact> {
    return this.httpClient.put<Contact>(this.DB_URL + '/contacts', contact)
  }

  getContactById(uuid: string) {
    return this.httpClient.get<Contact>(this.DB_URL + '/contacts/' + uuid)
  }

  getContacts(): Observable<Contact[]> {
    return this.httpClient.get<Contact[]>(this.DB_URL + '/contacts')
  }

  getContactSalutationOptions() {
    return this.httpClient.get<ContactSalutation[]>(this.DB_URL + '/contacts/salutations')
  }

  getAllEvents(): Observable<Event[]> {
    return this.httpClient.get<Event[]>(this.DB_URL + '/events?resolve_ids=true')
  }

  getEventById(uuid: string): Observable<Event> {
    return this.httpClient.get<Event>(this.DB_URL + '/events/' + uuid + '?resolve_ids=true')
  }

  deleteEvents(uuid: string): Observable<any> {
    return this.httpClient.delete(this.DB_URL + '/events/' + uuid)
  }

  getCategories() {
    return this.httpClient.get<Category[]>(this.DB_URL + '/events/categories')
  }

  getLevels() {
    return this.httpClient.get<Level[]>(this.DB_URL + '/events/levels')
  }

  getPresentationType() {
    return this.httpClient.get<PresentationType[]>(this.DB_URL + '/events/presentationtypes')
  }

  getAllInstitutions() {
    return this.httpClient.get<Institution[]>(this.DB_URL + '/institutions?resolve_ids=true')
  }

  updateEvent(event: Event) {
    return this.httpClient.put<Event>(this.DB_URL + '/events', event)
  }

  createEvent(event: Event) {
    return this.httpClient.post<Event>(this.DB_URL + '/events', event)
  }

  createHost(host: Host) {
    return this.httpClient.post<Host>(this.DB_URL + '/hosts', host)
  }

  updateHost(host: Host) {
    return this.httpClient.put<Host>(this.DB_URL + '/hosts', host)
  }

  getAllReports() {
    return this.httpClient.get<Report[]>(this.DB_URL + '/reports')
  }

  getReportById(uuid: string) {
    return this.httpClient.get<Report>(this.DB_URL + '/reports/' + uuid)
  }

  createReport(report: Report) {
    return this.httpClient.post<Report>(this.DB_URL + '/reports', report)
  }

  updateReport(report: Report) {
    return this.httpClient.put<Report>(this.DB_URL + '/reports', report)
  }

  getCooperationPartner() {
    return this.httpClient.get<CooperationPartner[]>(this.DB_URL + '/schools/cooperationpartner')
  }

  deleteInstitution(uuid: string): Observable<any> {
    return this.httpClient.delete(this.DB_URL + '/institutions/' + uuid)
  }

  getInstitutionAtomic(uuid: string) {
    return this.httpClient.get(this.DB_URL + '/institutions/' + uuid + '?resolve_ids=true')
  }

  createInstitution(institution: Institution) {
    return this.httpClient.post<Institution>(this.DB_URL + '/institutions', institution)
  }

  updateInstitution(institution: Institution) {
    return this.httpClient.put<Institution>(this.DB_URL + '/institutions', institution)
  }

  getSignatures() {
    return this.httpClient.get<Signature[]>(this.DB_URL + '/assets')
  }

  createLetter(letter: Letter): Observable<Blob> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8')
    return this.httpClient.post(
      this.DB_URL + '/serialletter',
      letter,
      { headers, responseType: 'blob'}
    )
  }

  createSheet(schools: School[]) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8')
    return this.httpClient.post(
      this.DB_URL + '/downloadsheet',
      schools,
      {headers}
    )
  }

  getInstitutionByIdAtomic(institutionId: string) {
    return this.httpClient.get<Institution>(this.DB_URL + '/institutions/' + institutionId + this.ATOMIC)
  }
}
