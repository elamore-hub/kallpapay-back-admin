import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISEPABeneficiary } from '../sepa-beneficiary.model';
import { SEPABeneficiaryService } from '../service/sepa-beneficiary.service';

@Component({
  templateUrl: './sepa-beneficiary-delete-dialog.component.html',
})
export class SEPABeneficiaryDeleteDialogComponent {
  sEPABeneficiary?: ISEPABeneficiary;

  constructor(protected sEPABeneficiaryService: SEPABeneficiaryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sEPABeneficiaryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
