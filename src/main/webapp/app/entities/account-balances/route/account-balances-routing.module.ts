import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccountBalancesComponent } from '../list/account-balances.component';
import { AccountBalancesDetailComponent } from '../detail/account-balances-detail.component';
import { AccountBalancesUpdateComponent } from '../update/account-balances-update.component';
import { AccountBalancesRoutingResolveService } from './account-balances-routing-resolve.service';

const accountBalancesRoute: Routes = [
  {
    path: '',
    component: AccountBalancesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountBalancesDetailComponent,
    resolve: {
      accountBalances: AccountBalancesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountBalancesUpdateComponent,
    resolve: {
      accountBalances: AccountBalancesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountBalancesUpdateComponent,
    resolve: {
      accountBalances: AccountBalancesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountBalancesRoute)],
  exports: [RouterModule],
})
export class AccountBalancesRoutingModule {}
