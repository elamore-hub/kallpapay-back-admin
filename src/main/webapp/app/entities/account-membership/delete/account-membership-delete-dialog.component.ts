import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountMembership } from '../account-membership.model';
import { AccountMembershipService } from '../service/account-membership.service';

@Component({
  templateUrl: './account-membership-delete-dialog.component.html',
})
export class AccountMembershipDeleteDialogComponent {
  accountMembership?: IAccountMembership;

  constructor(protected accountMembershipService: AccountMembershipService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.accountMembershipService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
