import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStandingOrder } from '../standing-order.model';
import { StandingOrderService } from '../service/standing-order.service';

@Component({
  templateUrl: './standing-order-delete-dialog.component.html',
})
export class StandingOrderDeleteDialogComponent {
  standingOrder?: IStandingOrder;

  constructor(protected standingOrderService: StandingOrderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.standingOrderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
