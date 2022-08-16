import {Routes} from '@angular/router'
import {ZsbSchoolComponent} from './zsb-school/zsb-school.component'
import {ZsbSchoolEditComponent} from './zsb-school/zsb-school-edit/zsb-school-edit.component'
import {ZsbAddressComponent} from './zsb-address/zsb-address.component'
import {ZsbSchoolDetailComponent} from './zsb-school/zsb-school-detail/zsb-school-detail.component'
import {ZsbEventsComponent} from './zsb-events/zsb-events.component'
import {ZsbEventsDetailComponent} from './zsb-events/zsb-events-detail/zsb-events-detail.component'
import {ZsbInstitutionsComponent} from './zsb-institutions/zsb-institutions.component'
import {ZsbInstitutionsDetailComponent} from './zsb-institutions/zsb-institutions-detail/zsb-institutions-detail.component'

export const appRoutes: Routes = [
  {path: '', component: ZsbSchoolComponent},
  {path: 'schools/:schoolId', component: ZsbSchoolEditComponent},
  {path: 'schools/:schoolId/address/:addressId', component: ZsbAddressComponent},
  {path: 'schools/edit/:schoolId', component: ZsbSchoolEditComponent},
  {path: 'schools/detail/:schoolId', component: ZsbSchoolDetailComponent},
  {path: 'schools', component: ZsbSchoolEditComponent},
  {path: 'events', component: ZsbEventsComponent},
  {path: 'events/:eventId', component: ZsbEventsDetailComponent},
  {path: 'institutions', component: ZsbInstitutionsComponent},
  {path: 'institutions/:institutionId', component: ZsbInstitutionsDetailComponent},
]
