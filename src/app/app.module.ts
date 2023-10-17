import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {AppComponent} from './app.component'
import {RouterModule} from '@angular/router'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatLegacySliderModule as MatSliderModule} from '@angular/material/legacy-slider'
import {HttpClientModule} from '@angular/common/http'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {ZsbSchoolComponent} from './zsb-school/zsb-school.component'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button'
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table'
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox'
import {MatIconModule} from '@angular/material/icon'
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator'
import {MatSortModule} from '@angular/material/sort'
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog'
import {ZsbSchoolListComponent} from './zsb-school/zsb-school-list/zsb-school-list.component'
import {ZsbSchoolEditComponent} from './zsb-school/zsb-school-edit/zsb-school-edit.component'
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field'
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select'
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input'
import {MatGridListModule} from '@angular/material/grid-list'
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar'
import {ZsbAddressComponent} from './zsb-address/zsb-address.component'
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete'
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list'
import {ZsbContactDetailComponent} from './zsb-contact/zsb-contact-detail/zsb-contact-detail.component'
import {ZsbContactSearchComponent} from './zsb-contact/zsb-contact-search/zsb-contact-search.component'
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle'
import {FlexLayoutModule} from '@angular/flex-layout'
import {MatSidenavModule} from '@angular/material/sidenav'
import {KeycloakAngularModule} from 'keycloak-angular'
import {ZsbEventsComponent} from './zsb-events/zsb-events.component'
import {ZsbEventsListComponent} from './zsb-events/zsb-events-list/zsb-events-list.component'
import {DatePipe} from '@angular/common'
import {ZsbEventsDetailComponent} from './zsb-events/zsb-events-detail/zsb-events-detail.component'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core'
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip'
import {ZsbReportComponent} from './zsb-events/zsb-report/zsb-report.component'
import {ZsbInstitutionsComponent} from './zsb-institutions/zsb-institutions.component'
import {ZsbInstitutionsListComponent} from './zsb-institutions/zsb-institutions-list/zsb-institutions-list.component'
import {ZsbInstitutionsDetailComponent} from './zsb-institutions/zsb-institutions-detail/zsb-institutions-detail.component'
import {ZsbLetterComponent} from './zsb-communication/zsb-letter/zsb-letter.component'
import {ZsbEmailComponent} from './zsb-communication/zsb-email/zsb-email.component'
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio'
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card'
import {ZsbSchoolDetailComponent} from './zsb-school/zsb-school-detail/zsb-school-detail.component'
import {appRoutes} from './routes'

@NgModule({
  declarations: [
    AppComponent,
    ZsbSchoolComponent,
    ZsbSchoolListComponent,
    ZsbSchoolEditComponent,
    ZsbAddressComponent,
    ZsbContactDetailComponent,
    ZsbContactSearchComponent,
    ZsbEventsComponent,
    ZsbEventsListComponent,
    ZsbEventsDetailComponent,
    ZsbReportComponent,
    ZsbInstitutionsComponent,
    ZsbInstitutionsListComponent,
    ZsbInstitutionsDetailComponent,
    ZsbLetterComponent,
    ZsbEmailComponent,
    ZsbSchoolDetailComponent
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
    MatTooltipModule,
    MatRadioModule,
    MatCardModule
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
  // entryComponents: [ZsbSchoolDetailComponent]
})
export class AppModule {
}
