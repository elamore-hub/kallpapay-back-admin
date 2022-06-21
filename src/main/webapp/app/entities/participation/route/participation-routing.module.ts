import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParticipationComponent } from '../list/participation.component';
import { ParticipationDetailComponent } from '../detail/participation-detail.component';
import { ParticipationUpdateComponent } from '../update/participation-update.component';
import { ParticipationRoutingResolveService } from './participation-routing-resolve.service';

const participationRoute: Routes = [
  {
    path: '',
    component: ParticipationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParticipationDetailComponent,
    resolve: {
      participation: ParticipationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParticipationUpdateComponent,
    resolve: {
      participation: ParticipationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParticipationUpdateComponent,
    resolve: {
      participation: ParticipationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(participationRoute)],
  exports: [RouterModule],
})
export class ParticipationRoutingModule {}
