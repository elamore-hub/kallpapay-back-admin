import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MyCauseComponent } from '../list/my-cause.component';
import { MyCauseDetailComponent } from '../detail/my-cause-detail.component';
import { MyCauseUpdateComponent } from '../update/my-cause-update.component';
import { MyCauseRoutingResolveService } from './my-cause-routing-resolve.service';

const myCauseRoute: Routes = [
  {
    path: '',
    component: MyCauseComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MyCauseDetailComponent,
    resolve: {
      myCause: MyCauseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MyCauseUpdateComponent,
    resolve: {
      myCause: MyCauseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MyCauseUpdateComponent,
    resolve: {
      myCause: MyCauseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(myCauseRoute)],
  exports: [RouterModule],
})
export class MyCauseRoutingModule {}
