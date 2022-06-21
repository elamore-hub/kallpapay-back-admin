import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PortfolioComponent } from '../list/portfolio.component';
import { PortfolioDetailComponent } from '../detail/portfolio-detail.component';
import { PortfolioUpdateComponent } from '../update/portfolio-update.component';
import { PortfolioRoutingResolveService } from './portfolio-routing-resolve.service';

const portfolioRoute: Routes = [
  {
    path: '',
    component: PortfolioComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PortfolioDetailComponent,
    resolve: {
      portfolio: PortfolioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PortfolioUpdateComponent,
    resolve: {
      portfolio: PortfolioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PortfolioUpdateComponent,
    resolve: {
      portfolio: PortfolioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(portfolioRoute)],
  exports: [RouterModule],
})
export class PortfolioRoutingModule {}
