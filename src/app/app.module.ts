import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSliderModule} from '@angular/material/slider';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ZsbSchuleComponent} from './zsb-schule/zsb-schule.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {ZsbSchuleListComponent} from './zsb-schule/zsb-schule-list/zsb-schule-list.component';
import {ZsbSchuleDetailComponent} from './zsb-schule/zsb-schule-detail/zsb-schule-detail.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ZsbAdresseComponent} from './zsb-adresse/zsb-adresse.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatListModule} from '@angular/material/list';
import {ZsbKontaktDetailComponent} from './zsb-kontakt/zsb-kontakt-detail/zsb-kontakt-detail.component';
import {ZsbKontaktSearchComponent} from './zsb-kontakt/zsb-kontakt-search/zsb-kontakt-search.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatSidenavModule} from '@angular/material/sidenav';
import {keycloakInitializer} from './authentication/keycloak.init';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular'
import {ZsbVeranstaltungenComponent} from './zsb-veranstaltungen/zsb-veranstaltungen.component';
import {ZsbVeranstaltungenListComponent} from './zsb-veranstaltungen/zsb-veranstaltungen-list/zsb-veranstaltungen-list.component';
import {DatePipe} from '@angular/common';
import {ZsbVeranstaltungenDetailComponent} from './zsb-veranstaltungen/zsb-veranstaltungen-detail/zsb-veranstaltungen-detail.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';

const appRoutes: Routes = [
  {path: '', component: ZsbSchuleComponent},
  {path: 'schulen/:schuleId', component: ZsbSchuleDetailComponent},
  {path: 'schulen/:schuleId/adresse/:adresseId', component: ZsbAdresseComponent},
  {path: 'schulen', component: ZsbSchuleDetailComponent},
  {path: 'veranstaltungen', component: ZsbVeranstaltungenComponent},
  {path: 'veranstaltungen/:veranstaltungId', component: ZsbVeranstaltungenDetailComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    ZsbSchuleComponent,
    ZsbSchuleListComponent,
    ZsbSchuleDetailComponent,
    ZsbAdresseComponent,
    ZsbKontaktDetailComponent,
    ZsbKontaktSearchComponent,
    ZsbVeranstaltungenComponent,
    ZsbVeranstaltungenListComponent,
    ZsbVeranstaltungenDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
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
    MatNativeDateModule
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
  bootstrap: [AppComponent],
  // entryComponents: [ZsbSchuleDetailComponent]
})
export class AppModule {
}
