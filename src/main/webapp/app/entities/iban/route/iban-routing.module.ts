import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IBANComponent } from '../list/iban.component';
import { IBANDetailComponent } from '../detail/iban-detail.component';
import { IBANUpdateComponent } from '../update/iban-update.component';
import { IBANRoutingResolveService } from './iban-routing-resolve.service';

const iBANRoute: Routes = [
  {
    path: '',
    component: IBANComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IBANDetailComponent,
    resolve: {
      iBAN: IBANRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IBANUpdateComponent,
    resolve: {
      iBAN: IBANRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IBANUpdateComponent,
    resolve: {
      iBAN: IBANRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(iBANRoute)],
  exports: [RouterModule],
})
export class IBANRoutingModule {}
