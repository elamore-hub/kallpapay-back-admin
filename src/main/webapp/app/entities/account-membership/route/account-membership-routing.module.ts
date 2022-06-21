import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccountMembershipComponent } from '../list/account-membership.component';
import { AccountMembershipDetailComponent } from '../detail/account-membership-detail.component';
import { AccountMembershipUpdateComponent } from '../update/account-membership-update.component';
import { AccountMembershipRoutingResolveService } from './account-membership-routing-resolve.service';

const accountMembershipRoute: Routes = [
  {
    path: '',
    component: AccountMembershipComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountMembershipDetailComponent,
    resolve: {
      accountMembership: AccountMembershipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountMembershipUpdateComponent,
    resolve: {
      accountMembership: AccountMembershipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountMembershipUpdateComponent,
    resolve: {
      accountMembership: AccountMembershipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountMembershipRoute)],
  exports: [RouterModule],
})
export class AccountMembershipRoutingModule {}
