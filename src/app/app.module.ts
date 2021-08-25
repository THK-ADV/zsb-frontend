import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {AppComponent} from './app.component'
import {RouterModule, Routes} from '@angular/router'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatSliderModule} from '@angular/material/slider'
import {HttpClientModule} from '@angular/common/http'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {ZsbSchuleComponent} from './zsb-school/zsb-schule.component'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {MatButtonModule} from '@angular/material/button'
import {MatTableModule} from '@angular/material/table'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatIconModule} from '@angular/material/icon'
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatSortModule} from '@angular/material/sort'
import {MatDialogModule} from '@angular/material/dialog'
import {ZsbSchuleListComponent} from './zsb-school/zsb-schule-list/zsb-schule-list.component'
import {ZsbSchuleDetailComponent} from './zsb-school/zsb-schule-detail/zsb-schule-detail.component'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatSelectModule} from '@angular/material/select'
import {MatInputModule} from '@angular/material/input'
import {MatGridListModule} from '@angular/material/grid-list'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {ZsbAddressComponent} from './zsb-address/zsb-address.component'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatListModule} from '@angular/material/list'
import {ZsbContactDetailComponent} from './zsb-contact/zsb-contact-detail/zsb-contact-detail.component'
import {ZsbContactSearchComponent} from './zsb-contact/zsb-contact-search/zsb-contact-search.component'
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {FlexLayoutModule} from '@angular/flex-layout'
import {MatSidenavModule} from '@angular/material/sidenav'
import {KeycloakAngularModule} from 'keycloak-angular'
import {ZsbEventsComponent} from './zsb-events/zsb-events.component'
import {ZsbEventsListComponent} from './zsb-events/zsb-events-list/zsb-events-list.component'
import {DatePipe} from '@angular/common'
import {ZsbEventsDetailComponent} from './zsb-events/zsb-events-detail/zsb-events-detail.component'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core'
import {MatTooltipModule} from '@angular/material/tooltip'
import {ZsbReportComponent} from './zsb-events/zsb-report/zsb-report.component'
import {ZsbInstitutionenComponent} from './zsb-institutions/zsb-institutionen.component'
import {ZsbInstitutionenListComponent} from './zsb-institutions/zsb-institutionen-list/zsb-institutionen-list.component'
import {ZsbInstitutionenDetailComponent} from './zsb-institutions/zsb-institutionen-detail/zsb-institutionen-detail.component'
import {ZsbLetterComponent} from './zsb-communication/zsb-letter/zsb-letter.component'
import {ZsbEmailComponent} from './zsb-communication/zsb-email/zsb-email.component'

const appRoutes: Routes = [
  {path: '', component: ZsbSchuleComponent},
  {path: 'schools/:schuleId', component: ZsbSchuleDetailComponent},
  {path: 'schools/:schuleId/address/:adresseId', component: ZsbAddressComponent},
  {path: 'schulen', component: ZsbSchuleDetailComponent},
  {path: 'veranstaltungen', component: ZsbEventsComponent},
  {path: 'veranstaltungen/:eventId', component: ZsbEventsDetailComponent},
  {path: 'institutionen', component: ZsbInstitutionenComponent},
  {path: 'institutions/:institutionId', component: ZsbInstitutionenDetailComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    ZsbSchuleComponent,
    ZsbSchuleListComponent,
    ZsbSchuleDetailComponent,
    ZsbAddressComponent,
    ZsbContactDetailComponent,
    ZsbContactSearchComponent,
    ZsbEventsComponent,
    ZsbEventsListComponent,
    ZsbEventsDetailComponent,
    ZsbReportComponent,
    ZsbInstitutionenComponent,
    ZsbInstitutionenListComponent,
    ZsbInstitutionenDetailComponent,
    ZsbLetterComponent,
    ZsbEmailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
      // {enableTracing: true} // debugging
    ),
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatSliderModule,
    FormsModule,
    NgbModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatListModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    MatSidenavModule,
    KeycloakAngularModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule
  ],
  providers: [
    DatePipe,
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'de-DE'
    },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: keycloakInitializer,
    //   multi: true,
    //   deps: [KeycloakService],
    // }
  ],
  bootstrap: [AppComponent]
  // entryComponents: [ZsbSchuleDetailComponent]
})
export class AppModule {
}
