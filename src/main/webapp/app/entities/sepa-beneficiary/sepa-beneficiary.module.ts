import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SEPABeneficiaryComponent } from './list/sepa-beneficiary.component';
import { SEPABeneficiaryDetailComponent } from './detail/sepa-beneficiary-detail.component';
import { SEPABeneficiaryUpdateComponent } from './update/sepa-beneficiary-update.component';
import { SEPABeneficiaryDeleteDialogComponent } from './delete/sepa-beneficiary-delete-dialog.component';
import { SEPABeneficiaryRoutingModule } from './route/sepa-beneficiary-routing.module';

@NgModule({
  imports: [SharedModule, SEPABeneficiaryRoutingModule],
  declarations: [
    SEPABeneficiaryComponent,
    SEPABeneficiaryDetailComponent,
    SEPABeneficiaryUpdateComponent,
    SEPABeneficiaryDeleteDialogComponent,
  ],
  entryComponents: [SEPABeneficiaryDeleteDialogComponent],
})
export class SEPABeneficiaryModule {}
