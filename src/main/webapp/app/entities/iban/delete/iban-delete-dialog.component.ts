import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIBAN } from '../iban.model';
import { IBANService } from '../service/iban.service';

@Component({
  templateUrl: './iban-delete-dialog.component.html',
})
export class IBANDeleteDialogComponent {
  iBAN?: IIBAN;

  constructor(protected iBANService: IBANService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.iBANService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
