import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CauseComponent } from '../list/cause.component';
import { CauseDetailComponent } from '../detail/cause-detail.component';
import { CauseUpdateComponent } from '../update/cause-update.component';
import { CauseRoutingResolveService } from './cause-routing-resolve.service';

const causeRoute: Routes = [
  {
    path: '',
    component: CauseComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CauseDetailComponent,
    resolve: {
      cause: CauseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CauseUpdateComponent,
    resolve: {
      cause: CauseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CauseUpdateComponent,
    resolve: {
      cause: CauseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(causeRoute)],
  exports: [RouterModule],
})
export class CauseRoutingModule {}
