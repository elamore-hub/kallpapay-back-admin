import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StandingOrderComponent } from '../list/standing-order.component';
import { StandingOrderDetailComponent } from '../detail/standing-order-detail.component';
import { StandingOrderUpdateComponent } from '../update/standing-order-update.component';
import { StandingOrderRoutingResolveService } from './standing-order-routing-resolve.service';

const standingOrderRoute: Routes = [
  {
    path: '',
    component: StandingOrderComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StandingOrderDetailComponent,
    resolve: {
      standingOrder: StandingOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StandingOrderUpdateComponent,
    resolve: {
      standingOrder: StandingOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StandingOrderUpdateComponent,
    resolve: {
      standingOrder: StandingOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(standingOrderRoute)],
  exports: [RouterModule],
})
export class StandingOrderRoutingModule {}
