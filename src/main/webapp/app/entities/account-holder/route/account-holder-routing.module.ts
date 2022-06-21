import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccountHolderComponent } from '../list/account-holder.component';
import { AccountHolderDetailComponent } from '../detail/account-holder-detail.component';
import { AccountHolderUpdateComponent } from '../update/account-holder-update.component';
import { AccountHolderRoutingResolveService } from './account-holder-routing-resolve.service';

const accountHolderRoute: Routes = [
  {
    path: '',
    component: AccountHolderComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountHolderDetailComponent,
    resolve: {
      accountHolder: AccountHolderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountHolderUpdateComponent,
    resolve: {
      accountHolder: AccountHolderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountHolderUpdateComponent,
    resolve: {
      accountHolder: AccountHolderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountHolderRoute)],
  exports: [RouterModule],
})
export class AccountHolderRoutingModule {}
