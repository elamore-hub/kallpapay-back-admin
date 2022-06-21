import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OnboardingComponent } from '../list/onboarding.component';
import { OnboardingDetailComponent } from '../detail/onboarding-detail.component';
import { OnboardingUpdateComponent } from '../update/onboarding-update.component';
import { OnboardingRoutingResolveService } from './onboarding-routing-resolve.service';

const onboardingRoute: Routes = [
  {
    path: '',
    component: OnboardingComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OnboardingDetailComponent,
    resolve: {
      onboarding: OnboardingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OnboardingUpdateComponent,
    resolve: {
      onboarding: OnboardingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OnboardingUpdateComponent,
    resolve: {
      onboarding: OnboardingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(onboardingRoute)],
  exports: [RouterModule],
})
export class OnboardingRoutingModule {}
