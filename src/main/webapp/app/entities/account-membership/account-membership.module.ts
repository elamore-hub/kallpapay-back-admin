import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AccountMembershipComponent } from './list/account-membership.component';
import { AccountMembershipDetailComponent } from './detail/account-membership-detail.component';
import { AccountMembershipUpdateComponent } from './update/account-membership-update.component';
import { AccountMembershipDeleteDialogComponent } from './delete/account-membership-delete-dialog.component';
import { AccountMembershipRoutingModule } from './route/account-membership-routing.module';

@NgModule({
  imports: [SharedModule, AccountMembershipRoutingModule],
  declarations: [
    AccountMembershipComponent,
    AccountMembershipDetailComponent,
    AccountMembershipUpdateComponent,
    AccountMembershipDeleteDialogComponent,
  ],
  entryComponents: [AccountMembershipDeleteDialogComponent],
})
export class AccountMembershipModule {}
