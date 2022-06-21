import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountHolder } from '../account-holder.model';
import { AccountHolderService } from '../service/account-holder.service';

@Component({
  templateUrl: './account-holder-delete-dialog.component.html',
})
export class AccountHolderDeleteDialogComponent {
  accountHolder?: IAccountHolder;

  constructor(protected accountHolderService: AccountHolderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.accountHolderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
