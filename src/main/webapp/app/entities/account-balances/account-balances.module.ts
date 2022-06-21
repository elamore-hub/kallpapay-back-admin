import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AccountBalancesComponent } from './list/account-balances.component';
import { AccountBalancesDetailComponent } from './detail/account-balances-detail.component';
import { AccountBalancesUpdateComponent } from './update/account-balances-update.component';
import { AccountBalancesDeleteDialogComponent } from './delete/account-balances-delete-dialog.component';
import { AccountBalancesRoutingModule } from './route/account-balances-routing.module';

@NgModule({
  imports: [SharedModule, AccountBalancesRoutingModule],
  declarations: [
    AccountBalancesComponent,
    AccountBalancesDetailComponent,
    AccountBalancesUpdateComponent,
    AccountBalancesDeleteDialogComponent,
  ],
  entryComponents: [AccountBalancesDeleteDialogComponent],
})
export class AccountBalancesModule {}
