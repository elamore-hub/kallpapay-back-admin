import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccountHolderInfoComponent } from '../list/account-holder-info.component';
import { AccountHolderInfoDetailComponent } from '../detail/account-holder-info-detail.component';
import { AccountHolderInfoUpdateComponent } from '../update/account-holder-info-update.component';
import { AccountHolderInfoRoutingResolveService } from './account-holder-info-routing-resolve.service';

const accountHolderInfoRoute: Routes = [
  {
    path: '',
    component: AccountHolderInfoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountHolderInfoDetailComponent,
    resolve: {
      accountHolderInfo: AccountHolderInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountHolderInfoUpdateComponent,
    resolve: {
      accountHolderInfo: AccountHolderInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountHolderInfoUpdateComponent,
    resolve: {
      accountHolderInfo: AccountHolderInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountHolderInfoRoute)],
  exports: [RouterModule],
})
export class AccountHolderInfoRoutingModule {}
