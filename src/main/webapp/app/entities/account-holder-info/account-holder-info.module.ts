import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AccountHolderInfoComponent } from './list/account-holder-info.component';
import { AccountHolderInfoDetailComponent } from './detail/account-holder-info-detail.component';
import { AccountHolderInfoUpdateComponent } from './update/account-holder-info-update.component';
import { AccountHolderInfoDeleteDialogComponent } from './delete/account-holder-info-delete-dialog.component';
import { AccountHolderInfoRoutingModule } from './route/account-holder-info-routing.module';

@NgModule({
  imports: [SharedModule, AccountHolderInfoRoutingModule],
  declarations: [
    AccountHolderInfoComponent,
    AccountHolderInfoDetailComponent,
    AccountHolderInfoUpdateComponent,
    AccountHolderInfoDeleteDialogComponent,
  ],
  entryComponents: [AccountHolderInfoDeleteDialogComponent],
})
export class AccountHolderInfoModule {}
