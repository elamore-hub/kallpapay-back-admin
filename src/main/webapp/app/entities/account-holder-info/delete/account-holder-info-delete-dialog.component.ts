import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountHolderInfo } from '../account-holder-info.model';
import { AccountHolderInfoService } from '../service/account-holder-info.service';

@Component({
  templateUrl: './account-holder-info-delete-dialog.component.html',
})
export class AccountHolderInfoDeleteDialogComponent {
  accountHolderInfo?: IAccountHolderInfo;

  constructor(protected accountHolderInfoService: AccountHolderInfoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.accountHolderInfoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
