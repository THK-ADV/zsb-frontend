import {Routes} from '@angular/router'
import {ZsbAddressComponent} from './zsb-address/zsb-address.component'
import {ZsbSchoolEventDetailComponent} from './zsb-overview/zsb-school-event-detail/zsb-school-event-detail.component'
import {ZsbEventsDetailComponent} from './zsb-events/zsb-events-detail/zsb-events-detail.component'
import {ZsbOverviewComponent} from './zsb-overview/zsb-overview.component'
import {ZsbSchoolDetailComponent} from './zsb-school/zsb-school-detail/zsb-school-detail.component'

export const appRoutes: Routes = [
  {path: '', component: ZsbOverviewComponent},
  {path: 'schools/:schoolId', component: ZsbSchoolEventDetailComponent},
  {path: 'schools/:schoolId/address/:addressId', component: ZsbAddressComponent},
  {path: 'schools/edit/:schoolId', component: ZsbSchoolDetailComponent},
  {path: 'schools/detail/:schoolId', component: ZsbSchoolEventDetailComponent},
  {path: 'schools', component: ZsbSchoolDetailComponent},
  {path: 'events', component: ZsbEventsDetailComponent},
  {path: 'events/:eventId', component: ZsbEventsDetailComponent},
]
