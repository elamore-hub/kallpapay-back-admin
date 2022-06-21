import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AddressInfoComponent } from '../list/address-info.component';
import { AddressInfoDetailComponent } from '../detail/address-info-detail.component';
import { AddressInfoUpdateComponent } from '../update/address-info-update.component';
import { AddressInfoRoutingResolveService } from './address-info-routing-resolve.service';

const addressInfoRoute: Routes = [
  {
    path: '',
    component: AddressInfoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AddressInfoDetailComponent,
    resolve: {
      addressInfo: AddressInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AddressInfoUpdateComponent,
    resolve: {
      addressInfo: AddressInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AddressInfoUpdateComponent,
    resolve: {
      addressInfo: AddressInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(addressInfoRoute)],
  exports: [RouterModule],
})
export class AddressInfoRoutingModule {}
