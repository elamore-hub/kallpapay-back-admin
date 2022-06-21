import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OAuthRedirectParametersComponent } from '../list/o-auth-redirect-parameters.component';
import { OAuthRedirectParametersDetailComponent } from '../detail/o-auth-redirect-parameters-detail.component';
import { OAuthRedirectParametersUpdateComponent } from '../update/o-auth-redirect-parameters-update.component';
import { OAuthRedirectParametersRoutingResolveService } from './o-auth-redirect-parameters-routing-resolve.service';

const oAuthRedirectParametersRoute: Routes = [
  {
    path: '',
    component: OAuthRedirectParametersComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OAuthRedirectParametersDetailComponent,
    resolve: {
      oAuthRedirectParameters: OAuthRedirectParametersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OAuthRedirectParametersUpdateComponent,
    resolve: {
      oAuthRedirectParameters: OAuthRedirectParametersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OAuthRedirectParametersUpdateComponent,
    resolve: {
      oAuthRedirectParameters: OAuthRedirectParametersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(oAuthRedirectParametersRoute)],
  exports: [RouterModule],
})
export class OAuthRedirectParametersRoutingModule {}
