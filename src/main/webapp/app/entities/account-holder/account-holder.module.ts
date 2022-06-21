import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AccountHolderComponent } from './list/account-holder.component';
import { AccountHolderDetailComponent } from './detail/account-holder-detail.component';
import { AccountHolderUpdateComponent } from './update/account-holder-update.component';
import { AccountHolderDeleteDialogComponent } from './delete/account-holder-delete-dialog.component';
import { AccountHolderRoutingModule } from './route/account-holder-routing.module';

@NgModule({
  imports: [SharedModule, AccountHolderRoutingModule],
  declarations: [AccountHolderComponent, AccountHolderDetailComponent, AccountHolderUpdateComponent, AccountHolderDeleteDialogComponent],
  entryComponents: [AccountHolderDeleteDialogComponent],
})
export class AccountHolderModule {}
