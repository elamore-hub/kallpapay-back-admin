import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountBalances } from '../account-balances.model';
import { AccountBalancesService } from '../service/account-balances.service';

@Component({
  templateUrl: './account-balances-delete-dialog.component.html',
})
export class AccountBalancesDeleteDialogComponent {
  accountBalances?: IAccountBalances;

  constructor(protected accountBalancesService: AccountBalancesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.accountBalancesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
