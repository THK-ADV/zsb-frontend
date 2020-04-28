import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSliderModule} from '@angular/material/slider';
import {HttpClientModule} from '@angular/common/http';
import {ZsbOrteComponent} from './zsb-orte/zsb-orte.component';
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


const appRoutes: Routes = [
  {path: '', component: ZsbSchuleComponent},
  {path: 'schulen/:schuleId', component: ZsbSchuleDetailComponent},
  {path: 'schulen', component: ZsbSchuleDetailComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ZsbOrteComponent,
    ZsbSchuleComponent,
    ZsbSchuleListComponent,
    ZsbSchuleDetailComponent
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
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
