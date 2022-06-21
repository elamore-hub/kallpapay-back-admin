import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OnboardingComponent } from './list/onboarding.component';
import { OnboardingDetailComponent } from './detail/onboarding-detail.component';
import { OnboardingUpdateComponent } from './update/onboarding-update.component';
import { OnboardingDeleteDialogComponent } from './delete/onboarding-delete-dialog.component';
import { OnboardingRoutingModule } from './route/onboarding-routing.module';

@NgModule({
  imports: [SharedModule, OnboardingRoutingModule],
  declarations: [OnboardingComponent, OnboardingDetailComponent, OnboardingUpdateComponent, OnboardingDeleteDialogComponent],
  entryComponents: [OnboardingDeleteDialogComponent],
})
export class OnboardingModule {}
