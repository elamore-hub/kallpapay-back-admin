import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICause } from '../cause.model';
import { CauseService } from '../service/cause.service';

@Component({
  templateUrl: './cause-delete-dialog.component.html',
})
export class CauseDeleteDialogComponent {
  cause?: ICause;

  constructor(protected causeService: CauseService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.causeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
