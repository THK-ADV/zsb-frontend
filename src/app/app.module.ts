import {BrowserModule} from '@angular/platform-browser'
import {APP_INITIALIZER, NgModule} from '@angular/core'
import {AppComponent} from './app.component'
import {RouterModule} from '@angular/router'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatSliderModule} from '@angular/material/slider'
import {HttpClientModule} from '@angular/common/http'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {MatButtonModule} from '@angular/material/button'
import {MatTableModule} from '@angular/material/table'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatIconModule} from '@angular/material/icon'
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatSortModule} from '@angular/material/sort'
import {MatDialogModule} from '@angular/material/dialog'
import {ZsbSchoolDetailComponent} from './zsb-school/zsb-school-detail/zsb-school-detail.component'
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
import {MatSidenavModule} from '@angular/material/sidenav'
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular'
import {DatePipe} from '@angular/common'
import {ZsbEventsDetailComponent} from './zsb-events/zsb-events-detail/zsb-events-detail.component'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core'
import {MatTooltipModule} from '@angular/material/tooltip'
import {ZsbLetterComponent} from './zsb-communication/zsb-letter/zsb-letter.component'
import {ZsbEmailComponent} from './zsb-communication/zsb-email/zsb-email.component'
import {MatRadioModule} from '@angular/material/radio'
import {MatCardModule} from '@angular/material/card'
import {ZsbSchoolEventDetailComponent} from './zsb-overview/zsb-school-event-detail/zsb-school-event-detail.component'
import {appRoutes} from './routes'
import { ZsbOverviewListComponent } from './zsb-overview/zsb-overview-list/zsb-overview-list.component'
import { ZsbOverviewComponent } from './zsb-overview/zsb-overview.component'
import {MatExpansionModule} from '@angular/material/expansion'
import { ZsbFilterComponent } from './zsb-overview/zsb-overview-list/zsb-filter/zsb-filter.component'
import {MatBadgeModule} from '@angular/material/badge'
import {MatChipsModule} from '@angular/material/chips'
import {keycloakInitializer} from './authentication/keycloak.init'

@NgModule({
  declarations: [
    AppComponent,
    ZsbSchoolDetailComponent,
    ZsbAddressComponent,
    ZsbContactDetailComponent,
    ZsbContactSearchComponent,
    ZsbEventsDetailComponent,
    ZsbLetterComponent,
    ZsbEmailComponent,
    ZsbSchoolEventDetailComponent,
    ZsbOverviewListComponent,
    ZsbOverviewComponent,
    ZsbFilterComponent
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
        MatSidenavModule,
        KeycloakAngularModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatRadioModule,
        MatCardModule,
        MatExpansionModule,
        MatBadgeModule,
        MatChipsModule
    ],
  providers: [
    DatePipe,
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'de-DE'
    },
     {
       provide: APP_INITIALIZER,
       useFactory: keycloakInitializer,
       multi: true,
       deps: [KeycloakService],
     }
  ],
  bootstrap: [AppComponent]
  // entryComponents: [ZsbSchoolEventDetailComponent]
})
export class AppModule {
}
