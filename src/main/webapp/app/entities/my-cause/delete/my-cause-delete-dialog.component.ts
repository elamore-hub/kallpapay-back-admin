import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMyCause } from '../my-cause.model';
import { MyCauseService } from '../service/my-cause.service';

@Component({
  templateUrl: './my-cause-delete-dialog.component.html',
})
export class MyCauseDeleteDialogComponent {
  myCause?: IMyCause;

  constructor(protected myCauseService: MyCauseService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.myCauseService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
