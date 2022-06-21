import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SEPABeneficiaryComponent } from '../list/sepa-beneficiary.component';
import { SEPABeneficiaryDetailComponent } from '../detail/sepa-beneficiary-detail.component';
import { SEPABeneficiaryUpdateComponent } from '../update/sepa-beneficiary-update.component';
import { SEPABeneficiaryRoutingResolveService } from './sepa-beneficiary-routing-resolve.service';

const sEPABeneficiaryRoute: Routes = [
  {
    path: '',
    component: SEPABeneficiaryComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SEPABeneficiaryDetailComponent,
    resolve: {
      sEPABeneficiary: SEPABeneficiaryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SEPABeneficiaryUpdateComponent,
    resolve: {
      sEPABeneficiary: SEPABeneficiaryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SEPABeneficiaryUpdateComponent,
    resolve: {
      sEPABeneficiary: SEPABeneficiaryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sEPABeneficiaryRoute)],
  exports: [RouterModule],
})
export class SEPABeneficiaryRoutingModule {}
