import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {School} from '../zsb-school/school'
import {Address} from '../zsb-address/address'
import {catchError, retry} from 'rxjs/operators'
import {Observable, throwError} from 'rxjs'
import {SchoolType} from '../zsb-school/schoolType'
import {City} from '../zsb-address/city'
import {Contact, ContactFunction, ContactSalutation} from '../zsb-contact/contact'
import {environment} from '../../environments/environment'
import {DatabaseEvent, Event} from '../zsb-events/event'
import {Category} from '../zsb-events/category'
import {Level} from '../zsb-events/level'
import {PresentationType} from '../zsb-events/presentationType'
import {CooperationPartner} from '../zsb-school/cooperationPartner'
import {Signature} from '../zsb-communication/zsb-letter/signature'
import {Letter} from '../zsb-communication/zsb-letter/letter'
import {Email} from '../zsb-communication/zsb-email/email'
import {KaoaSupervisor} from '../zsb-school/kaoaSupervisor'
import {ContactSchool, ContactUniversity} from '../zsb-events/eventContacts'

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

  createSchool(school: School) {
    return this.httpClient.post<School>(this.DB_URL + '/schools', school)
  }

  updateSchool(school: School) {
    return this.httpClient.put<School>(this.DB_URL + '/schools', school)
  }

  deleteSchool(uuid: string) {
    return this.httpClient.delete(this.DB_URL + '/schools/' + uuid)
  }

  getSchoolsAtomic() {
    return this.httpClient.get<School[]>(this.DB_URL + '/schools?resolve_ids=true')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  createMailAddressees(schools: School[]) {
    return this.httpClient.post<string[]>(this.DB_URL + '/email/addressees', schools)
  }

  getSchools() {
    return this.httpClient.get<School[]>(this.DB_URL + '/schools')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getSchoolById(id: string) {
    return this.httpClient.get<School>(this.DB_URL + '/schools/' + id)
  }

  getSchoolType() {
    return this.httpClient.get<SchoolType[]>(this.DB_URL + '/schools/schooltypes')
  }

  getContactFunctions() {
    return this.httpClient.get<ContactFunction[]>(this.DB_URL + '/contacts/feature')
  }

  getAddressFromArrayByAddressId(addresses: Address[], id: string): Address {
    let result = null
    addresses.forEach(it => {
      if (it.id === id) {
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

  getEvents(): Observable<DatabaseEvent[]> {
    return this.httpClient.get<DatabaseEvent[]>(this.DB_URL + '/events?resolve_ids=true')
  }

  getEventById(uuid: string): Observable<DatabaseEvent> {
    return this.httpClient.get<DatabaseEvent>(this.DB_URL + '/events/' + uuid + '?resolve_ids=true')
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

  updateEvent(event: DatabaseEvent) {
    return this.httpClient.put<DatabaseEvent>(this.DB_URL + '/events', event)
  }

  createEvent(event: DatabaseEvent) {
    return this.httpClient.post<DatabaseEvent>(this.DB_URL + '/events', event)
  }
  getCooperationPartner() {
    return this.httpClient.get<CooperationPartner[]>(this.DB_URL + '/schools/cooperationPartner')
  }

  getKaoaSupervisors() {
    return this.httpClient.get<KaoaSupervisor[]>(this.DB_URL + '/schools/kaoaSupervisors')
  }

  getTalentScouts() {
    return this.httpClient.get<KaoaSupervisor[]>(this.DB_URL + '/schools/talentScouts')
  }

  getSchoolContacts() {
    return this.httpClient.get<ContactSchool[]>(this.DB_URL + '/schoolContacts')
  }

  createSchoolContact(contact: ContactSchool) {
    console.log('schoolContact', contact)
    return this.httpClient.post<ContactSchool>(this.DB_URL + '/schoolContacts', contact)
  }

  getUniversityContacts() {
    return this.httpClient.get<ContactUniversity[]>(this.DB_URL + '/universityContacts')
  }

  createUniversityContact(contact: ContactUniversity) {
    console.log('universityContact', contact)
    return this.httpClient.post<ContactUniversity>(this.DB_URL + '/universityContacts', contact)
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

  createSheet(schools: School[]): Observable<Blob> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8')
    return this.httpClient.post(
      this.DB_URL + '/downloadsheet',
      schools,
      {headers, responseType: 'blob'}
    )
  }

  createEmail(email: Email) {
    return this.httpClient.post<Email>(this.DB_URL + '/email', email)
  }
}
