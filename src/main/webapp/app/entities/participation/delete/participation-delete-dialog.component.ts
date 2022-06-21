import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParticipation } from '../participation.model';
import { ParticipationService } from '../service/participation.service';

@Component({
  templateUrl: './participation-delete-dialog.component.html',
})
export class ParticipationDeleteDialogComponent {
  participation?: IParticipation;

  constructor(protected participationService: ParticipationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.participationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
